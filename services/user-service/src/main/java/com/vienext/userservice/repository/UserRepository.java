package com.vienext.userservice.repository;

import com.vienext.userservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}