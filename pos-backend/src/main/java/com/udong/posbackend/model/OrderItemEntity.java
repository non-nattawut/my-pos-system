package com.udong.posbackend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemEntity extends BaseEntity {
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "order_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, insertable = false, updatable = false)
    private OrderEntity order;

    @Column(name = "product_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, insertable = false, updatable = false)
    private ProductEntity product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "note")
    private String note;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
