package com.vienext.userservice.service;

import com.vienext.userservice.config.JwtUtil;
import com.vienext.userservice.dto.LoginDTO;
import com.vienext.userservice.dto.RegisterDTO;
import com.vienext.userservice.dto.UpgradePlanDTO;
import com.vienext.userservice.dto.UserDTO;
import com.vienext.userservice.exception.BadRequestException;
import com.vienext.userservice.exception.ForbiddenException;
import com.vienext.userservice.exception.NotFoundException;
import com.vienext.userservice.exception.UnauthorizedException;
import com.vienext.userservice.model.SubscriptionPlan;
import com.vienext.userservice.model.User;
import com.vienext.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final long OTP_EXPIRY_MINUTES = 5;

    private Map<String, String> otpStorage = new HashMap<>();
    private Map<String, String> statusUpdateOtpStorage = new HashMap<>(); // Lưu OTP cho thay đổi trạng thái
    private Map<String, String> pendingStatusChanges = new HashMap<>(); // Lưu trạng thái dự kiến

    public String generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));

//        Lưu OTP vào Redis với key là email, hết hạn sau 5p
        redisTemplate.opsForValue().set("OTP:" + email, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);

//        Gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Registration");
        message.setText("Your OTP for registration is: " + otp + "\nThis OTP is valid for 5 minutes.");
        mailSender.send(message);

        return otp;  // return để debug nếu cần
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisTemplate.opsForValue().get("OTP:" + email);
        if (storedOtp == null) {
            throw new RuntimeException("OTP has expired or not exist");
        }
        if (!storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        // Xóa sau khi xác thực thành công
        redisTemplate.delete("OTP:" + email);
        return true;
    }

    public String generateRandomUsername() {
        String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder username = new StringBuilder("@");

        // 8 kí tự (không tính @)
        for (int i = 0; i < 8; i++) {
            username.append(characters.charAt(random.nextInt(characters.length())));
        }

        String generatedUsername = username.toString();
        while (userRepository.findByUsername(generatedUsername).isPresent()) {
            username = new StringBuilder("@");
            for (int i = 0; i < 8; i++) {
                username.append(characters.charAt(random.nextInt(characters.length())));
            }
            generatedUsername = username.toString();
        }
        return generatedUsername;
    }

    public boolean isUsername(String input) {
        if (input == null || input.isEmpty()) return false;

        String usernamePattern = "^@[a-zA-Z0-9]$";
        Pattern pattern = Pattern.compile(usernamePattern);

        return pattern.matcher(input).matches();
    }

    public User register(RegisterDTO registerDTO) {

        // Kiểm tra ít nhất một trong hai (email hoặc phoneNumber) được cung cấp
        if ((registerDTO.getEmail() == null || registerDTO.getEmail().trim().isEmpty()) &&
                (registerDTO.getPhoneNumber() == null || registerDTO.getPhoneNumber().trim().isEmpty())) {
            throw new RuntimeException("Either email or phone number must be provided");
        }

        // Kiểm tra email nếu được cung cấp
        if (registerDTO.getEmail() != null && !registerDTO.getEmail().trim().isEmpty()) {
            var existingUser = userRepository.findByEmail(registerDTO.getEmail());
            if (existingUser.isPresent()) {
                User user = existingUser.get();
                if ("PENDING".equals(user.getStatus())) {
                    userRepository.delete(user);
                } else {
                    throw new RuntimeException("Email already exists. Please log in or reset your password.");
                }
            }
        }

        // Kiểm tra phoneNumber nếu được cung cấp
        if (registerDTO.getPhoneNumber() != null && !registerDTO.getPhoneNumber().trim().isEmpty()) {
            var existingUser = userRepository.findByPhoneNumber(registerDTO.getPhoneNumber());
            if (existingUser.isPresent()) {
                User user = existingUser.get();
                if ("PENDING".equals(user.getStatus())) {
                    // Nếu tài khoản ở trạng thái PENDING, xóa tài khoản cũ và tạo mới
                    userRepository.delete(user);
                } else {
                    // Nếu tài khoản đã ACTIVE, báo lỗi
                    throw new RuntimeException("Phone number already exists. Please log in or reset your password.");
                }
            }
        }

        // Tạo username randoom nếu lúc đăng kí không điền
        if (!isUsername(registerDTO.getUsername())) {
            registerDTO.setUsername(generateRandomUsername());
        }

        User user = User.builder()
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role("ROLE_USER")
                .phoneNumber(registerDTO.getPhoneNumber())
                .status("PENDING") // Mới tạo là PENDING, chờ xác thực OTP
                .subscriptionPlan("FREE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return userRepository.save(user);
    }

    public void activateUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus("ACTIVE");
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public String login(LoginDTO loginDTO) {
        String identifier = loginDTO.getIdentifier();
        String password = loginDTO.getPassword();
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                .orElseThrow(() -> new NotFoundException("User not found")));

        if ("PENDING".equals(user.getStatus())) {
            throw new ForbiddenException("Account is not activated.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail() != null ? user.getEmail() : user.getPhoneNumber(),
                user.getRole(),
                user.getId()
        );
        storeTokenInRedis(user.getEmail(), token);
        return token;
    }

    // admin update status of user
    public UserDTO updateUserStatus(String userId, String newStatus) {
        if (!"PENDING".equals(newStatus) && !"ACTIVE".equals(newStatus)) {
            throw new RuntimeException("Invalid status. Status must be either PENDING or ACTIVE.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(newStatus);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return mapToUserDTO(user);
    }

    public void requestStatusUpdate(String newStatus) {
        if (!"PENDING".equals(newStatus) && !"ACTIVE".equals(newStatus)) {
            throw new BadRequestException("Invalid status. Status must be either PENDING or ACTIVE");
        }

        // Lấy thông tin người dùng từ token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String identifier = authentication.getName();

        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                .orElseThrow(() -> new NotFoundException("User not found")));

        // Kiểm tra user có email để gửi OTP không
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new BadRequestException("User does not have an email address. Please provide an email address for your account..");
        }

        // Tạo OTP và lưu vào storage
        String userId = user.getId();
        String otp = String.format("%06d", new Random().nextInt(999999));
        statusUpdateOtpStorage.put("STATUS_OTP:" + userId, otp);
        pendingStatusChanges.put(userId, newStatus);

        // Gửi OTP qua email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your OTP for Status Update");
        message.setText("Your OTP to update your account status is: " + otp + "\nThis OTP is valid for 5 minutes.");
        mailSender.send(message);
    }

    public UserDTO verifyStatusUpdate(String otp) {
        // Lấy thông tin người dùng từ token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String identifier = authentication.getName();

        // Tìm user bằng email hoặc phoneNumber
        User user = userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByPhoneNumber(identifier)
                        .orElseThrow(() -> new NotFoundException("User not found")));

        String userId = user.getId();

        // Kiểm tra OTP
        String storedOtp = statusUpdateOtpStorage.get("STATUS_OTP:" + userId);
        if (storedOtp == null) {
            throw new BadRequestException("OTP has expired or does not exist");
        }
        if (!storedOtp.equals(otp)) {
            throw new BadRequestException("Invalid OTP");
        }

        // Lấy trạng thái dự kiến
        String newStatus = pendingStatusChanges.get(userId);
        if (newStatus == null) {
            throw new BadRequestException("No status update request found");
        }

        // Cập nhật trạng thái
        user.setStatus(newStatus);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Xóa OTP và trạng thái tạm
        statusUpdateOtpStorage.remove("STATUS_OTP:" + userId);
        pendingStatusChanges.remove(userId);

        return mapToUserDTO(user);
    }

    public UserDTO getUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setGender(user.getGender());
        userDTO.setAddress(user.getAddress());
        userDTO.setProfilePicture(user.getProfilePicture());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        userDTO.setLastLogin(user.getLastLogin());
        userDTO.setStatus(user.getStatus());
        userDTO.setSubscriptionPlan(user.getSubscriptionPlan());

        return userDTO;
    }

    public UserDTO updateUser(String userId, @Valid UserDTO updateUserDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        User user = userOptional.get();

        if (updateUserDTO.getFirstName() != null) {
            user.setFirstName(updateUserDTO.getFirstName());
        }
        if (updateUserDTO.getLastName() != null) {
            user.setLastName(updateUserDTO.getLastName());
        }
        if (updateUserDTO.getDateOfBirth() != null) {
            user.setDateOfBirth(updateUserDTO.getDateOfBirth());
        }
        if (updateUserDTO.getGender() != null) {
            user.setGender(updateUserDTO.getGender());
        }
        if (updateUserDTO.getAddress() != null) {
            user.setAddress(updateUserDTO.getAddress());
        }
        if (updateUserDTO.getProfilePicture() != null) {
            user.setProfilePicture(updateUserDTO.getProfilePicture());
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setUsername(updatedUser.getUsername());
        userDTO.setEmail(updatedUser.getEmail());
        userDTO.setPhoneNumber(updatedUser.getPhoneNumber());
        userDTO.setRole(updatedUser.getRole());
        userDTO.setFirstName(updatedUser.getFirstName());
        userDTO.setLastName(updatedUser.getLastName());
        userDTO.setDateOfBirth(updatedUser.getDateOfBirth());
        userDTO.setGender(updatedUser.getGender());
        userDTO.setAddress(updatedUser.getAddress());
        userDTO.setProfilePicture(updatedUser.getProfilePicture());
        userDTO.setCreatedAt(updatedUser.getCreatedAt());
        userDTO.setUpdatedAt(updatedUser.getUpdatedAt());
        userDTO.setLastLogin(updatedUser.getLastLogin());
        userDTO.setStatus(updatedUser.getStatus());
        userDTO.setSubscriptionPlan(updatedUser.getSubscriptionPlan());

        return userDTO;
    }

    public UserDTO upgradeUserPlan(String userId, UpgradePlanDTO upgradePlanDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newPlan = upgradePlanDTO.getSubscriptionPlan();

        // Kiểm tra gói mới có hợp lệ không
        boolean isValidPlan = Arrays.stream(SubscriptionPlan.values())
                .anyMatch(plan -> plan.getPlanName().equals(newPlan));
        if (!isValidPlan) {
            throw new RuntimeException("Invalid subscription plan: " + newPlan);
        }

        // Kiểm tra xem gói mới có khác gói hiện tại không
        if (user.getSubscriptionPlan().equals(newPlan)) {
            throw new RuntimeException("User is already on the " + newPlan + " plan");
        }

        user.setSubscriptionPlan(newPlan);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return mapToUserDTO(user);
    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setGender(user.getGender());
        userDTO.setAddress(user.getAddress());
        userDTO.setProfilePicture(user.getProfilePicture());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        userDTO.setLastLogin(user.getLastLogin());
        userDTO.setStatus(user.getStatus());
        userDTO.setSubscriptionPlan(user.getSubscriptionPlan());
        return userDTO;
    }

    public void storeTokenInRedis(String email, String token) {
        System.out.println("Storing token for user: " + email + ", token: " + token);
    }
}