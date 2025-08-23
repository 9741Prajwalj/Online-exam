package com.example.exam.model;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Exam {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String subject; private Integer durationMinutes; private LocalDateTime dateTime;
}
