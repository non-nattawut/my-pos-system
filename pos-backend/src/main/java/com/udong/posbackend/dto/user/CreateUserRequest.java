package com.udong.posbackend.dto.user;

import com.udong.posbackend.constant.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotNull(message = "Role cannot be null")
    private Role role;

    private String emoji;
    private String imageUrl;
}
