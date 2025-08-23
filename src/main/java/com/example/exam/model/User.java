package com.example.exam.model;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="users")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(unique=true, nullable=false) private String username;
 @Column(nullable=false) private String password;
 @Column(unique=true) private String email;
 @Enumerated(EnumType.STRING) private Role role;
}
