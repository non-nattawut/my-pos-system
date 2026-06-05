package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.auth.LoginRequest;
import com.udong.posbackend.dto.auth.LoginResponse;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.config.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.udong.posbackend.dto.auth.UserResponse;
import com.udong.posbackend.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @GetMapping("/maids")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getMaids() {
        List<UserResponse> maids = userService.getAllMaids();
        return ResponseEntity.ok(ApiResponse.success("Maids list retrieved successfully", maids));
    }

    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserEntity user = (UserEntity) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        
        LoginResponse responseData = LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .emoji(user.getEmoji())
                .imageUrl(user.getImageUrl())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Login successful", responseData));
    }
}
