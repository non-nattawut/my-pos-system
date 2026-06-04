package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.auth.UserResponse;
import com.udong.posbackend.dto.user.CreateUserRequest;
import com.udong.posbackend.dto.user.UpdateProfileRequest;
import com.udong.posbackend.dto.user.UpdateUserRequest;
import com.udong.posbackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.udong.posbackend.constant.Role;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<Role[]>> getRoles() {
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully", Role.values()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", response));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Principal principal) {
        UserResponse response = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Principal principal) {
        UserResponse response = userService.updateUserProfile(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", response));
    }
}
