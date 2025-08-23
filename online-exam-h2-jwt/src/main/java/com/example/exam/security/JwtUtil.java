package com.example.exam.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component; import java.nio.charset.StandardCharsets; import java.security.Key; import java.util.Date;
@Component public class JwtUtil {
 private final Key key; private final long expirationMs;
 public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration}") long expirationMs){
  if(secret==null || secret.length()<32) throw new IllegalArgumentException("JWT secret must be >=32 chars");
  this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expirationMs = expirationMs;
 }
 public String generateToken(String username, String role){ Date now=new Date(); Date exp=new Date(now.getTime()+expirationMs);
  return Jwts.builder().setSubject(username).claim("role", role).setIssuedAt(now).setExpiration(exp).signWith(key, SignatureAlgorithm.HS256).compact(); }
 public String extractUsername(String token){ return getAllClaims(token).getSubject(); }
 public boolean isTokenValid(String token, String username){ return username.equals(extractUsername(token)) && getAllClaims(token).getExpiration().after(new Date()); }
 private Claims getAllClaims(String token){ return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody(); }
}
