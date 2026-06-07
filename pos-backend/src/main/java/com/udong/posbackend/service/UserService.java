package com.udong.posbackend.service;

import com.udong.posbackend.constant.Role;
import com.udong.posbackend.dto.auth.UserResponse;
import com.udong.posbackend.dto.user.CreateUserRequest;
import com.udong.posbackend.dto.user.ChangePasswordRequest;
import com.udong.posbackend.dto.user.UpdateProfileRequest;
import com.udong.posbackend.dto.user.UpdateUserRequest;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
  
  @Transactional
  public void changePassword(String email, ChangePasswordRequest request) {
      UserEntity user = userRepository.findByEmail(email)
              .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
      
      if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
          throw new IllegalArgumentException("Current password does not match");
      }
      
      user.setPassword(passwordEncoder.encode(request.getNewPassword()));
      userRepository.save(user);
  }

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllMaids() {
        return userRepository.findByRole(Role.MAID).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken");
        }
        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .emoji(request.getEmoji())
                .imageUrl(request.getImageUrl())
                .build();
        UserEntity saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserProfile(String email, UpdateProfileRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        user.setName(request.getName());
        user.setEmoji(request.getEmoji());
        user.setImageUrl(request.getImageUrl());
        
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (request.getOldPassword() == null || request.getOldPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Current password is required to set a new password");
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password does not match");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        UserEntity saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Transactional
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // If email is changing, make sure it is not taken
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email is already taken");
            }
            user.setEmail(request.getEmail());
        }

        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setEmoji(request.getEmoji());
        user.setImageUrl(request.getImageUrl());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        UserEntity saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    private UserResponse mapToUserResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .emoji(user.getEmoji())
                .imageUrl(user.getImageUrl())
                .build();
    }
}
