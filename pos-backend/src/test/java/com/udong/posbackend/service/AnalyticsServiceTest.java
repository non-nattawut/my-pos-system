package com.udong.posbackend.service;

import com.udong.posbackend.constant.Category;
import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.dto.analytics.CategoryShareResponse;
import com.udong.posbackend.dto.analytics.MaidLeaderboardEntry;
import com.udong.posbackend.dto.analytics.MetricsResponse;
import com.udong.posbackend.model.CafeTableEntity;
import com.udong.posbackend.model.OrderEntity;
import com.udong.posbackend.model.OrderItemEntity;
import com.udong.posbackend.model.ProductEntity;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.repository.OrderRepository;
import com.udong.posbackend.mapper.OrderMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private AnalyticsService analyticsService;

    private List<OrderEntity> mockOrders;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();

        UserEntity maid1 = UserEntity.builder()
                .id(UUID.randomUUID())
                .name("Maid Yuna #01")
                .build();

        UserEntity maid2 = UserEntity.builder()
                .id(UUID.randomUUID())
                .name("Maid Rin #02")
                .build();

        ProductEntity product1 = ProductEntity.builder()
                .id(UUID.randomUUID())
                .name("Kawaii Strawberry Cake")
                .price(BigDecimal.valueOf(10.00))
                .costPrice(BigDecimal.valueOf(4.00))
                .category(Category.DESSERTS)
                .build();

        ProductEntity product2 = ProductEntity.builder()
                .id(UUID.randomUUID())
                .name("Holo Mascot Keyring")
                .price(BigDecimal.valueOf(5.00))
                .costPrice(BigDecimal.valueOf(2.00))
                .category(Category.MERCH)
                .build();

        OrderEntity order1 = OrderEntity.builder()
                .id(UUID.randomUUID())
                .status(OrderStatus.COMPLETED)
                .maid(maid1)
                .build();

        OrderItemEntity item1 = OrderItemEntity.builder()
                .product(product1)
                .quantity(2)
                .build();
        OrderItemEntity item2 = OrderItemEntity.builder()
                .product(product2)
                .quantity(1)
                .build();
        order1.setItems(Arrays.asList(item1, item2));

        OrderEntity order2 = OrderEntity.builder()
                .id(UUID.randomUUID())
                .status(OrderStatus.COMPLETED)
                .maid(maid2)
                .build();

        OrderItemEntity item3 = OrderItemEntity.builder()
                .product(product2)
                .quantity(3)
                .build();
        order2.setItems(Arrays.asList(item3));

        mockOrders = Arrays.asList(order1, order2);

        // Stub orderMapper
        lenient().when(orderMapper.calculateTotal(order1)).thenReturn(BigDecimal.valueOf(25.00));
        lenient().when(orderMapper.calculateTotal(order2)).thenReturn(BigDecimal.valueOf(15.00));
    }

    @Test
    void getMetrics_CalculatesCorrectly() {
        when(orderRepository.findAll(any(Specification.class))).thenReturn(mockOrders);

        MetricsResponse response = analyticsService.getMetrics(now, now);

        assertNotNull(response);
        assertEquals(BigDecimal.valueOf(40.00), response.getGrossRevenue());
        assertEquals(2, response.getOrderVolume());
        assertEquals(BigDecimal.valueOf(20.00).setScale(2, RoundingMode.HALF_UP), response.getAverageOrderValue());
        assertEquals("MERCH", response.getHottestCategory());
        assertEquals(BigDecimal.valueOf(24.00).setScale(2, RoundingMode.HALF_UP), response.getNetProfit().setScale(2, RoundingMode.HALF_UP));
        assertEquals(BigDecimal.valueOf(60.00).setScale(2, RoundingMode.HALF_UP), response.getProfitMargin().setScale(2, RoundingMode.HALF_UP));
    }

    @Test
    void getCategoryShare_CalculatesCorrectly() {
        when(orderRepository.findAll(any(Specification.class))).thenReturn(mockOrders);

        List<CategoryShareResponse> response = analyticsService.getCategoryShare(now, now);

        assertNotNull(response);
        assertEquals(2, response.size());

        CategoryShareResponse share1 = response.get(0);
        assertEquals("MERCH", share1.getCategory());
        assertEquals(BigDecimal.valueOf(20.00), share1.getSales());
        assertEquals(BigDecimal.valueOf(50.00).setScale(2, RoundingMode.HALF_UP), share1.getSharePercentage());

        CategoryShareResponse share2 = response.get(1);
        assertEquals("DESSERTS", share2.getCategory());
        assertEquals(BigDecimal.valueOf(20.00), share2.getSales());
        assertEquals(BigDecimal.valueOf(50.00).setScale(2, RoundingMode.HALF_UP), share2.getSharePercentage());
    }

    @Test
    void getMaidLeaderboard_CalculatesCorrectly() {
        when(orderRepository.findAll(any(Specification.class))).thenReturn(mockOrders);

        List<MaidLeaderboardEntry> response = analyticsService.getMaidLeaderboard(now, now);

        assertNotNull(response);
        assertEquals(2, response.size());

        MaidLeaderboardEntry topMaid = response.get(0);
        assertEquals("Maid Yuna #01", topMaid.getMaidName());
        assertEquals(BigDecimal.valueOf(25.00), topMaid.getSales());
        assertEquals(1, topMaid.getOrderCount());

        MaidLeaderboardEntry secondMaid = response.get(1);
        assertEquals("Maid Rin #02", secondMaid.getMaidName());
        assertEquals(BigDecimal.valueOf(15.00), secondMaid.getSales());
        assertEquals(1, secondMaid.getOrderCount());
    }
}
