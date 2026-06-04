package com.udong.posbackend.dto.receipt;

import com.udong.posbackend.constant.PaymentMethod;
import com.udong.posbackend.constant.ServiceType;
import com.udong.posbackend.dto.order.OrderResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptResponse {
    private UUID id;
    private String receiptNumber;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal serviceCharge;
    private BigDecimal discount;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private ServiceType serviceType;
    private String tableNumber;
    private String maidName;
    private List<OrderResponse> orders;

    // Audit fields
    private ZonedDateTime createdAt;
    private String createdBy;
    private ZonedDateTime updatedAt;
    private String updatedBy;
}
