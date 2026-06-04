package com.udong.posbackend.dto.table;

import com.udong.posbackend.dto.order.OrderResponse;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableResponse {
    private UUID id;
    private String tableNumber;
    private Integer seatSize;
    private boolean occupied;
    private List<OrderResponse> activeOrders;

    // Audit fields
    private ZonedDateTime createdAt;
    private String createdBy;
    private ZonedDateTime updatedAt;
    private String updatedBy;
}
