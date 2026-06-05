package com.udong.posbackend.controller;

import com.udong.posbackend.config.PosProperties;
import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.config.ConfigResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/config")
@RequiredArgsConstructor
public class ConfigController {

    private final PosProperties posProperties;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ConfigResponse>> getConfig() {
        ConfigResponse config = ConfigResponse.builder()
                .taxRate(posProperties.getTaxRate())
                .serviceChargeRate(posProperties.getServiceChargeRate())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Configuration retrieved successfully", config));
    }
}
