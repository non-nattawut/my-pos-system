package com.udong.posbackend.dto.order;

import com.udong.posbackend.dto.product.ProductResponse;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private UUID id;
    private ProductResponse product;
    private Integer quantity;
    private String note;

    // Audit fields
    private java.time.ZonedDateTime createdAt;
    private String createdBy;
    private java.time.ZonedDateTime updatedAt;
    private String updatedBy;
}
