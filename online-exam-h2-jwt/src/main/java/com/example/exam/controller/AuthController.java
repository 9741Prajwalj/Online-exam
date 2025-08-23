package com.example.exam.controller;
import com.example.exam.dto.*; import com.example.exam.model.*; import com.example.exam.repository.UserRepository; import com.example.exam.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired; import org.springframework.http.ResponseEntity; import org.springframework.security.authentication.*; import org.springframework.security.core.Authentication; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @CrossOrigin public class AuthController {
 @Autowired private AuthenticationManager authenticationManager; @Autowired private JwtUtil jwtUtil; @Autowired private PasswordEncoder passwordEncoder; @Autowired private UserRepository userRepository;
 @PostMapping("/register") public ResponseEntity<?> register(@RequestBody RegisterRequest req){
  if(userRepository.existsByUsername(req.getUsername())) return ResponseEntity.badRequest().body("Username already exists");
  if(req.getRole()==null) req.setRole(Role.STUDENT);
  User user = User.builder().username(req.getUsername()).email(req.getEmail()).password(passwordEncoder.encode(req.getPassword())).role(req.getRole()).build();
  userRepository.save(user); String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name()); return ResponseEntity.ok(new JwtResponse(token));
 }
 @PostMapping("/login") public ResponseEntity<?> login(@RequestBody LoginRequest req){
  Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
  SecurityContextHolder.getContext().setAuthentication(auth);
  User user = userRepository.findByUsername(req.getUsername()).orElseThrow(() -> new RuntimeException("User not found: "+req.getUsername()));
  String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name()); return ResponseEntity.ok(new JwtResponse(token));
 }
}
