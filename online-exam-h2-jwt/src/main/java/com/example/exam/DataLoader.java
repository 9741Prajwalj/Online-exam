package com.example.exam;

import com.example.exam.model.User;
import com.example.exam.model.Role;
import com.example.exam.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {
 @Bean
 CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder encoder) {
  return args -> {
   if (!userRepository.existsByUsername("admin")) {
    userRepository.save(
            User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ADMIN)   // Now unambiguous
                    .build()
    );
   }
  };
 }
}
