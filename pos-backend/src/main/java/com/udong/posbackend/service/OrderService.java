package com.udong.posbackend.service;

import com.udong.posbackend.config.PosProperties;
import com.udong.posbackend.dto.order.OrderItemRequest;
import com.udong.posbackend.dto.order.OrderRequest;
import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.dto.receipt.ReceiptResponse;
import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.constant.PaymentMethod;
import com.udong.posbackend.constant.ServiceType;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.model.OrderEntity;
import com.udong.posbackend.model.OrderItemEntity;
import com.udong.posbackend.model.ProductEntity;
import com.udong.posbackend.model.ReceiptEntity;
import com.udong.posbackend.model.VoucherEntity;
import com.udong.posbackend.repository.*;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.model.CafeTableEntity;
import com.udong.posbackend.mapper.OrderMapper;
import com.udong.posbackend.mapper.ReceiptMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CafeTableRepository cafeTableRepository;
    private final ReceiptRepository receiptRepository;
    private final ReceiptNumberGeneratorService receiptNumberGeneratorService;
    private final OrderMapper orderMapper;
    private final ReceiptMapper receiptMapper;
    private final VoucherRepository voucherRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(String maidName, String receiptNumber, LocalDateTime startDate, LocalDateTime endDate) {
        startDate = startDate == null ? LocalDate.now().atStartOfDay() : startDate;
        endDate = endDate == null ? LocalDate.now().atTime(23, 59, 59) : endDate;

        Specification<OrderEntity> spec = Specification.where((OrderSpecifications.hasDateRange(startDate, endDate)));

        if (receiptNumber != null && !receiptNumber.isBlank()) {
            Specification<OrderEntity> receiptNumberSpec = OrderSpecifications.hasReceiptNumber(receiptNumber);
            spec = Specification.where(receiptNumberSpec);
        }
        if (maidName != null && !maidName.isBlank()) {
            Specification<OrderEntity> maidSpec = OrderSpecifications.hasMaidName(maidName);
            spec = spec.and(maidSpec);
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        List<OrderEntity> orders = orderRepository.findAll(spec, sort);
        return orders.stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getPendingDineInOrdersByTable(String tableNumber) {
        return orderRepository.findByServiceTypeAndTableTableNumberAndReceiptIdIsNull(ServiceType.DINE_IN, tableNumber).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional
    public ReceiptResponse payTable(String tableNumber, String voucherCode) {
        List<OrderEntity> pendingOrders = orderRepository.findByServiceTypeAndTableTableNumberAndReceiptIdIsNull(ServiceType.DINE_IN, tableNumber);
        if (pendingOrders.isEmpty()) {
            throw new ResourceNotFoundException("No pending orders found for table " + tableNumber);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal serviceCharge = BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal total = BigDecimal.ZERO;

        for (OrderEntity order : pendingOrders) {
            order.setStatus(OrderStatus.COMPLETED);
            
            BigDecimal orderSubtotal = orderMapper.calculateSubtotal(order);
            BigDecimal orderServiceCharge = orderMapper.calculateServiceCharge(order);
            BigDecimal orderTax = orderMapper.calculateTax(order);

            subtotal = subtotal.add(orderSubtotal);
            serviceCharge = serviceCharge.add(orderServiceCharge);
            tax = tax.add(orderTax);
        }

        if (voucherCode != null && !voucherCode.isBlank()) {
            VoucherEntity voucher = voucherRepository.findByCode(voucherCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with code: " + voucherCode));
            if (voucher.getMaxUses() != null && voucher.getUsedCount() >= voucher.getMaxUses()) {
                throw new IllegalArgumentException("Voucher is out of uses");
            }
            voucher.setUsedCount(voucher.getUsedCount() + 1);
            voucherRepository.save(voucher);

            BigDecimal percentage = BigDecimal.valueOf(voucher.getDiscountPercentage());
            discount = subtotal.multiply(percentage).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        }

        total = subtotal.add(serviceCharge).add(tax).subtract(discount).max(BigDecimal.ZERO);

        UserEntity maid = pendingOrders.get(0).getMaid();
        CafeTableEntity table = pendingOrders.get(0).getTable();

        // Create 1 ReceiptEntity for the table checkout
        String receiptNum = receiptNumberGeneratorService.generateReceiptNumber();
        ReceiptEntity receipt = ReceiptEntity.builder()
                .receiptNumber(receiptNum)
                .subtotal(subtotal)
                .tax(tax)
                .serviceCharge(serviceCharge)
                .discount(discount)
                .total(total)
                .paymentMethod(PaymentMethod.CASH)
                .serviceType(ServiceType.DINE_IN)
                .tableId(table != null ? table.getId() : null)
                .table(table)
                .maidId(maid.getId())
                .maid(maid)
                .build();

        ReceiptEntity savedReceipt = receiptRepository.save(receipt);

        for (OrderEntity order : pendingOrders) {
            order.setReceiptId(savedReceipt.getId());
            order.setReceipt(savedReceipt);
        }
        savedReceipt.setOrders(pendingOrders);
        orderRepository.saveAll(pendingOrders);

        return receiptMapper.toResponse(savedReceipt);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setStatus(status);
        OrderEntity savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        UserEntity maid = userRepository.findByEmail(request.getMaidEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Maid not found with email: " + request.getMaidEmail()));

        CafeTableEntity table = null;
        UUID tableId = null;
        if (request.getServiceType() == ServiceType.DINE_IN && request.getTableNumber() != null && !request.getTableNumber().isBlank()) {
            table = cafeTableRepository.findByTableNumber(request.getTableNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found with number: " + request.getTableNumber()));
            tableId = table.getId();
        }

        OrderEntity order = orderMapper.toEntity(request);
        order.generateId();
        order.setMaid(maid);
        order.setMaidId(maid.getId());
        order.setTable(table);
        order.setTableId(tableId);
        order.setItems(new ArrayList<>());

        // Process items and validate stock
        for (OrderItemRequest itemReq : request.getItems()) {
            ProductEntity product = productRepository.findActiveByIdOrThrow(itemReq.getProductId());

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName() 
                        + ". Available: " + product.getStockQuantity() + ", Requested: " + itemReq.getQuantity());
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .order(order)
                    .orderId(order.getId())
                    .product(product)
                    .productId(product.getId())
                    .quantity(itemReq.getQuantity())
                    .note(itemReq.getNote())
                    .build();

            order.getItems().add(orderItem);
        }

        if (request.getServiceType() == ServiceType.TAKEAWAY) {
            // For takeaway, immediately generate a receipt
            String receiptNum = receiptNumberGeneratorService.generateReceiptNumber();
            BigDecimal subtotal = orderMapper.calculateSubtotal(order);
            BigDecimal serviceCharge = orderMapper.calculateServiceCharge(order);
            BigDecimal tax = orderMapper.calculateTax(order);
            BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
            if (request.getVoucherCode() != null && !request.getVoucherCode().isBlank()) {
                VoucherEntity voucher = voucherRepository.findByCode(request.getVoucherCode())
                        .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with code: " + request.getVoucherCode()));
                if (voucher.getMaxUses() != null && voucher.getUsedCount() >= voucher.getMaxUses()) {
                    throw new IllegalArgumentException("Voucher is out of uses");
                }
                voucher.setUsedCount(voucher.getUsedCount() + 1);
                voucherRepository.save(voucher);

                BigDecimal percentage = BigDecimal.valueOf(voucher.getDiscountPercentage());
                discount = subtotal.multiply(percentage).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
            }
            BigDecimal total = subtotal.add(serviceCharge).add(tax).subtract(discount).max(BigDecimal.ZERO);

            ReceiptEntity receipt = ReceiptEntity.builder()
                    .receiptNumber(receiptNum)
                    .subtotal(subtotal)
                    .tax(tax)
                    .serviceCharge(serviceCharge)
                    .discount(discount)
                    .total(total)
                    .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH)
                    .serviceType(ServiceType.TAKEAWAY)
                    .maidId(maid.getId())
                    .maid(maid)
                    .build();

            ReceiptEntity savedReceipt = receiptRepository.save(receipt);
            order.setReceiptId(savedReceipt.getId());
            order.setReceipt(savedReceipt);
            savedReceipt.setOrders(List.of(order));
            order.setStatus(OrderStatus.PENDING);
        } else {
            order.setStatus(OrderStatus.PENDING);
        }

        OrderEntity savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getActiveOrders() {
        return orderRepository.findByStatusNotOrderByCreatedAtAsc(OrderStatus.COMPLETED).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    public OrderResponse mapToResponse(OrderEntity order) {
        return orderMapper.toResponse(order);
    }
}
