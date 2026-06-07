package com.udong.posbackend.dto.order;

import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.constant.PaymentMethod;
import com.udong.posbackend.constant.ServiceType;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private UUID receiptId;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal serviceCharge;
    private BigDecimal discount;
    private BigDecimal total;
    private ZonedDateTime createdAt;
    private String createdBy;
    private ZonedDateTime updatedAt;
    private String updatedBy;
    private PaymentMethod paymentMethod;
    private OrderStatus status;
    private String receiptNumber;
    private String maidName;
    private ServiceType serviceType;
    private String tableNumber;
}
