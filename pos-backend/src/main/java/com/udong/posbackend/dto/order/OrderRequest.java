package com.udong.posbackend.dto.order;

import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.constant.PaymentMethod;
import com.udong.posbackend.constant.ServiceType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;

    @NotNull(message = "Discount is required")
    @DecimalMin(value = "0.0", message = "Discount must be non-negative")
    private BigDecimal discount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Status is required")
    private OrderStatus status;

    @NotBlank(message = "Maid email is required")
    @Email(message = "Invalid email format")
    private String maidEmail;

    private ServiceType serviceType;
    private String tableNumber;
    private String voucherCode;
}
