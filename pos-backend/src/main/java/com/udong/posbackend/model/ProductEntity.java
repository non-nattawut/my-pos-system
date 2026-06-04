package com.udong.posbackend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import com.udong.posbackend.constant.Category;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEntity extends BaseEntity {
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "emoji", nullable = false)
    private String emoji;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(name = "cost_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Builder.Default
    @Column(name = "low_stock_threshold", nullable = false)
    private Integer lowStockThreshold = 5;

    @Builder.Default
    @Column(name = "deleted", nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;
    
    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
