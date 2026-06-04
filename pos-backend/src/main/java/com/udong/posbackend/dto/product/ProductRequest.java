package com.udong.posbackend.dto.product;

import com.udong.posbackend.constant.Category;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Emoji cannot be blank")
    private String emoji;

    private String imageUrl;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    private BigDecimal price;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", message = "Cost price must be non-negative")
    private BigDecimal costPrice;

    private String description;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;

    @NotNull(message = "Low stock threshold is required")
    @Min(value = 0, message = "Low stock threshold must be non-negative")
    private Integer lowStockThreshold;
}
