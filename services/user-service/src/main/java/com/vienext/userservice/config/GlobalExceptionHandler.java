package com.vienext.userservice.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        if (ex.getMessage().contains("already exists")) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST); // 400
        } else if (ex.getMessage().contains("User not found") || ex.getMessage().contains("Invalid password")) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED); // 401
        }
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(ResponseStatusException ex) {
        return new ResponseEntity<>(ex.getReason(), ex.getStatusCode());
    }
}