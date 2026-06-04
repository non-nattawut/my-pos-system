package com.udong.posbackend.controller;

import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/queue")
@RequiredArgsConstructor
public class QueueController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getActiveQueueOrders() {
        List<OrderResponse> orders = orderService.getActiveOrders();
        return ResponseEntity.ok(ApiResponse.success("Active queue orders retrieved successfully", orders));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateQueueOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status) {
        OrderResponse response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Queue order status updated successfully", response));
    }
}
