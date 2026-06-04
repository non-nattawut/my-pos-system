package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.receipt.ReceiptResponse;
import com.udong.posbackend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<List<ReceiptResponse>>> getAllReceipts(
            @RequestParam(required = false) String maidName,
            @RequestParam(required = false) String receiptNumber,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<ReceiptResponse> receipts = receiptService.getAllReceipts(maidName, receiptNumber, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Receipts retrieved successfully", receipts));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<ReceiptResponse>> getReceiptById(@PathVariable UUID id) {
        ReceiptResponse receipt = receiptService.getReceiptById(id);
        return ResponseEntity.ok(ApiResponse.success("Receipt retrieved successfully", receipt));
    }
}
