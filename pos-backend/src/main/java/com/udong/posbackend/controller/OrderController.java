package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.order.OrderRequest;
import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID')")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Order processed successfully", response));
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) String maidName,
            @RequestParam(required = false) String receiptNumber,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<OrderResponse> orders = orderService.getAllOrders(maidName, receiptNumber, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Order history retrieved successfully", orders));
    }

}
