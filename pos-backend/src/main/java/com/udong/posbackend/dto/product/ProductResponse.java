package com.udong.posbackend.dto.product;

import com.udong.posbackend.constant.Category;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String name;
    private String emoji;
    private String imageUrl;
    private Category category;
    private BigDecimal price;
    private BigDecimal costPrice;
    private String description;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private boolean deleted;

    // Audit fields
    private java.time.LocalDateTime createdAt;
    private String createdBy;
    private java.time.LocalDateTime updatedAt;
    private String updatedBy;
}
