package com.example.exam.service;
import com.example.exam.model.User; import com.example.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.userdetails.*; import org.springframework.stereotype.Service; import java.util.List;
@Service public class CustomUserDetailsService implements UserDetailsService {
 @Autowired private UserRepository userRepository;
 @Override public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
  User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: "+username));
  return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_"+user.getRole().name())));
 }
}
