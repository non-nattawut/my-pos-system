package com.udong.posbackend.mapper;

import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.model.OrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.math.BigDecimal;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, DateTimeMapper.class})
public interface OrderMapper {

    @Mapping(target = "maidName", expression = "java(order.getMaid() != null ? order.getMaid().getName() : null)")
    @Mapping(target = "tableNumber", expression = "java(order.getTable() != null ? order.getTable().getTableNumber() : null)")
    @Mapping(target = "receiptNumber", expression = "java(order.getReceipt() != null ? order.getReceipt().getReceiptNumber() : null)")
    @Mapping(target = "paymentMethod", expression = "java(order.getReceipt() != null ? order.getReceipt().getPaymentMethod() : null)")
    @Mapping(target = "subtotal", expression = "java(calculateSubtotal(order))")
    @Mapping(target = "tax", expression = "java(calculateTax(order))")
    @Mapping(target = "serviceCharge", expression = "java(calculateServiceCharge(order))")
    @Mapping(target = "discount", expression = "java(order.getReceipt() != null ? order.getReceipt().getDiscount() : java.math.BigDecimal.ZERO)")
    @Mapping(target = "total", expression = "java(calculateTotal(order))")
    OrderResponse toResponse(OrderEntity order);

    default BigDecimal calculateSubtotal(OrderEntity order) {
        if (order.getItems() == null) return BigDecimal.ZERO;
        return order.getItems().stream()
                .map(item -> {
                    if (item.getProduct() == null) return BigDecimal.ZERO;
                    return item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default BigDecimal calculateServiceCharge(OrderEntity order) {
        return calculateSubtotal(order).multiply(new BigDecimal("0.10"));
    }

    default BigDecimal calculateTax(OrderEntity order) {
        return calculateSubtotal(order).multiply(new BigDecimal("0.07"));
    }

    default BigDecimal calculateTotal(OrderEntity order) {
        BigDecimal sub = calculateSubtotal(order);
        BigDecimal sc = calculateServiceCharge(order);
        BigDecimal tax = calculateTax(order);
        BigDecimal disc = order.getReceipt() != null ? order.getReceipt().getDiscount() : BigDecimal.ZERO;
        return sub.add(sc).add(tax).subtract(disc).max(BigDecimal.ZERO);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "receiptId", ignore = true)
    @Mapping(target = "receipt", ignore = true)
    @Mapping(target = "maid", ignore = true)
    @Mapping(target = "maidId", ignore = true)
    @Mapping(target = "table", ignore = true)
    @Mapping(target = "tableId", ignore = true)
    @Mapping(target = "items", ignore = true)
    OrderEntity toEntity(com.udong.posbackend.dto.order.OrderRequest request);
}
