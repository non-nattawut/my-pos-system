package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.voucher.VoucherRequest;
import com.udong.posbackend.dto.voucher.VoucherResponse;
import com.udong.posbackend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getAllVouchers() {
        List<VoucherResponse> vouchers = voucherService.getAllVouchers();
        return ResponseEntity.ok(ApiResponse.success("Vouchers retrieved successfully", vouchers));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(@PathVariable UUID id) {
        VoucherResponse voucher = voucherService.getVoucherById(id);
        return ResponseEntity.ok(ApiResponse.success("Voucher retrieved successfully", voucher));
    }

    @GetMapping("/code/{code}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID')")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherByCode(@PathVariable String code) {
        VoucherResponse voucher = voucherService.getVoucherByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Voucher code applied successfully", voucher));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(@Valid @RequestBody VoucherRequest request) {
        VoucherResponse voucher = voucherService.createVoucher(request);
        return ResponseEntity.ok(ApiResponse.success("Voucher created successfully", voucher));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(@PathVariable UUID id, @Valid @RequestBody VoucherRequest request) {
        VoucherResponse voucher = voucherService.updateVoucher(id, request);
        return ResponseEntity.ok(ApiResponse.success("Voucher updated successfully", voucher));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable UUID id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.ok(ApiResponse.success("Voucher deleted successfully", null));
    }
}
