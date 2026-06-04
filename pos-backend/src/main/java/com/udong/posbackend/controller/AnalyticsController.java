package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.analytics.CategoryShareResponse;
import com.udong.posbackend.dto.analytics.MaidLeaderboardEntry;
import com.udong.posbackend.dto.analytics.MetricsResponse;
import com.udong.posbackend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/analytics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<MetricsResponse>> getMetrics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        MetricsResponse metrics = analyticsService.getMetrics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Metrics calculated successfully", metrics));
    }

    @GetMapping("/category-share")
    public ResponseEntity<ApiResponse<List<CategoryShareResponse>>> getCategoryShare(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<CategoryShareResponse> categoryShare = analyticsService.getCategoryShare(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Category share calculated successfully", categoryShare));
    }

    @GetMapping("/maid-leaderboard")
    public ResponseEntity<ApiResponse<List<MaidLeaderboardEntry>>> getMaidLeaderboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<MaidLeaderboardEntry> leaderboard = analyticsService.getMaidLeaderboard(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Maid leaderboard calculated successfully", leaderboard));
    }
}
