package com.example.exam.security;
import com.example.exam.service.CustomUserDetailsService;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.security.core.userdetails.UserDetails; import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException;
@Component public class JwtAuthFilter extends OncePerRequestFilter {
 @Autowired private JwtUtil jwtUtil; @Autowired private CustomUserDetailsService userDetailsService;
 @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
  String header = request.getHeader("Authorization"); String username=null; String token=null;
  if(header!=null && header.startsWith("Bearer ")) { token = header.substring(7); try { username = jwtUtil.extractUsername(token);} catch(Exception ignored){} }
  if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
   UserDetails userDetails = userDetailsService.loadUserByUsername(username);
   if(jwtUtil.isTokenValid(token, userDetails.getUsername())){
     UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
     auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); SecurityContextHolder.getContext().setAuthentication(auth);
   }
  }
  chain.doFilter(request, response);
 }
}
