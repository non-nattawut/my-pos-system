package com.udong.posbackend.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    private String emoji;
    private String imageUrl;
    private String password; // optional, only updated if not empty
    private String oldPassword; // required if password is changed
}
