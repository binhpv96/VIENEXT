package com.vienext.userservice.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Configuring SecurityFilterChain");
        System.out.println("Client ID: " + System.getenv("GOOGLE_CLIENT_ID"));
        System.out.println("Client Secret: " + System.getenv("GOOGLE_CLIENT_SECRET"));
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/register", "/api/users/login", "/api/users/auth/google", "/api/users/auth/success", "/login/oauth2/**", "/error", "/favicon.ico").permitAll()
                        .requestMatchers("/api/users/**").hasAnyRole("USER", "VIP")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            System.out.println("Unauthorized access: " + authException.getMessage());
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: " + authException.getMessage());
                        })
                )
                .oauth2Login(oauth2 -> {
                    System.out.println("Configuring OAuth2 login");
                    oauth2
                            .authorizationEndpoint(auth -> {
                                System.out.println("Starting OAuth2 authorization at /api/users/auth/google");
                                auth.baseUri("/api/users/auth"); // Chỉ định base URI cho OAuth 2.0
                            })
                            .redirectionEndpoint(redir -> {
                                System.out.println("Configuring redirection endpoint for OAuth2");
                                redir.baseUri("/login/oauth2/code/*");
                            })
                            .successHandler((request, response, authentication) -> {
                                System.out.println("OAuth2 login successful, redirecting to /api/users/auth/success");
                                response.sendRedirect("/api/users/auth/success");
                            })
                            .failureHandler((request, response, exception) -> {
                                System.out.println("OAuth2 login failed: " + exception.getMessage());
                                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "OAuth2 login failed: " + exception.getMessage());
                            });
                })
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}