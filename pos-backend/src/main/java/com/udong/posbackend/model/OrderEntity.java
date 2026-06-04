package com.udong.posbackend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.*;
import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.constant.PaymentMethod;
import com.udong.posbackend.constant.ServiceType;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity extends BaseEntity {
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItemEntity> items = new ArrayList<>();

    @Column(name = "receipt_id", columnDefinition = "VARCHAR(36)")
    private UUID receiptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", insertable = false, updatable = false)
    private ReceiptEntity receipt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status;

    @Column(name = "maid_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID maidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maid_id", nullable = false, insertable = false, updatable = false)
    private UserEntity maid;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type")
    private ServiceType serviceType;

    @Column(name = "table_id", columnDefinition = "VARCHAR(36)")
    private UUID tableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", insertable = false, updatable = false)
    private CafeTableEntity table;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
