package com.udong.posbackend.service;

import com.udong.posbackend.constant.Role;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = UserEntity.builder()
                .id(UUID.randomUUID())
                .email("testuser@pos.com")
                .name("Test Maid")
                .password("encodedPassword")
                .role(Role.MAID)
                .build();
    }

    @Test
    void loadUserByUsername_Success() {
        when(userRepository.findByEmail("testuser@pos.com")).thenReturn(Optional.of(testUser));

        UserDetails result = userService.loadUserByUsername("testuser@pos.com");

        assertNotNull(result);
        assertEquals("testuser@pos.com", result.getUsername());
        verify(userRepository, times(1)).findByEmail("testuser@pos.com");
    }

    @Test
    void loadUserByUsername_NotFound() {
        when(userRepository.findByEmail("nonexistent@pos.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("nonexistent@pos.com"));
        verify(userRepository, times(1)).findByEmail("nonexistent@pos.com");
    }
}
