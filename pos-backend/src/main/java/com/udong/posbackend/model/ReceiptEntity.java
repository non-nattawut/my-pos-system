package com.udong.posbackend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import com.udong.posbackend.constant.PaymentMethod;
import com.udong.posbackend.constant.ServiceType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "receipts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptEntity extends BaseEntity {

    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "receipt_number", nullable = false, unique = true)
    private String receiptNumber;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "tax", nullable = false, precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(name = "service_charge", nullable = false, precision = 10, scale = 2)
    private BigDecimal serviceCharge;

    @Column(name = "discount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @Column(name = "table_id", columnDefinition = "VARCHAR(36)")
    private UUID tableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", insertable = false, updatable = false)
    private CafeTableEntity table;

    @Column(name = "maid_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private UUID maidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maid_id", nullable = false, insertable = false, updatable = false)
    private UserEntity maid;

    @OneToMany(mappedBy = "receipt")
    @Builder.Default
    private List<OrderEntity> orders = new ArrayList<>();

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
