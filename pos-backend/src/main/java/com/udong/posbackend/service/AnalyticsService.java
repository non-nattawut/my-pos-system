package com.udong.posbackend.service;

import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.dto.analytics.CategoryShareResponse;
import com.udong.posbackend.dto.analytics.MaidLeaderboardEntry;
import com.udong.posbackend.dto.analytics.MetricsResponse;
import com.udong.posbackend.model.OrderEntity;
import com.udong.posbackend.model.OrderItemEntity;
import com.udong.posbackend.repository.OrderRepository;
import com.udong.posbackend.repository.OrderSpecifications;
import com.udong.posbackend.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public MetricsResponse getMetrics(LocalDateTime startDate, LocalDateTime endDate) {
        List<OrderEntity> orders = fetchCompletedOrders(startDate, endDate);

        BigDecimal grossRevenue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        for (OrderEntity order : orders) {
            grossRevenue = grossRevenue.add(orderMapper.calculateTotal(order));
            for (OrderItemEntity item : order.getItems()) {
                BigDecimal cost = item.getProduct() != null && item.getProduct().getCostPrice() != null 
                        ? item.getProduct().getCostPrice() 
                        : BigDecimal.ZERO;
                totalCost = totalCost.add(cost.multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }

        long orderVolume = orders.size();
        BigDecimal averageOrderValue = orderVolume > 0
                ? grossRevenue.divide(BigDecimal.valueOf(orderVolume), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal netProfit = grossRevenue.subtract(totalCost);
        BigDecimal profitMargin = grossRevenue.compareTo(BigDecimal.ZERO) > 0
                ? netProfit.multiply(BigDecimal.valueOf(100)).divide(grossRevenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Integer> categoryQuantities = new HashMap<>();
        for (OrderEntity order : orders) {
            for (OrderItemEntity item : order.getItems()) {
                if (item.getProduct() != null && item.getProduct().getCategory() != null) {
                    String categoryName = item.getProduct().getCategory().name();
                    categoryQuantities.put(categoryName, categoryQuantities.getOrDefault(categoryName, 0) + item.getQuantity());
                }
            }
        }

        String hottestCategory = categoryQuantities.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        return MetricsResponse.builder()
                .grossRevenue(grossRevenue)
                .orderVolume(orderVolume)
                .averageOrderValue(averageOrderValue)
                .hottestCategory(hottestCategory)
                .netProfit(netProfit)
                .profitMargin(profitMargin)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CategoryShareResponse> getCategoryShare(LocalDateTime startDate, LocalDateTime endDate) {
        List<OrderEntity> orders = fetchCompletedOrders(startDate, endDate);

        Map<String, BigDecimal> categorySales = new HashMap<>();
        BigDecimal totalSales = BigDecimal.ZERO;

        for (OrderEntity order : orders) {
            for (OrderItemEntity item : order.getItems()) {
                if (item.getProduct() != null && item.getProduct().getCategory() != null) {
                    String categoryName = item.getProduct().getCategory().name();
                    BigDecimal itemPrice = item.getProduct().getPrice();
                    BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                    
                    categorySales.put(categoryName, categorySales.getOrDefault(categoryName, BigDecimal.ZERO).add(itemTotal));
                    totalSales = totalSales.add(itemTotal);
                }
            }
        }

        List<CategoryShareResponse> shares = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categorySales.entrySet()) {
            BigDecimal share = totalSales.compareTo(BigDecimal.ZERO) > 0
                    ? entry.getValue().multiply(BigDecimal.valueOf(100)).divide(totalSales, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            shares.add(CategoryShareResponse.builder()
                    .category(entry.getKey())
                    .sales(entry.getValue())
                    .sharePercentage(share)
                    .build());
        }

        shares.sort((a, b) -> b.getSales().compareTo(a.getSales()));
        return shares;
    }

    @Transactional(readOnly = true)
    public List<MaidLeaderboardEntry> getMaidLeaderboard(LocalDateTime startDate, LocalDateTime endDate) {
        List<OrderEntity> orders = fetchCompletedOrders(startDate, endDate);

        Map<String, MaidLeaderboardEntry> leaderboardMap = new HashMap<>();
        for (OrderEntity order : orders) {
            String maidName = order.getMaid() != null ? order.getMaid().getName() : "Guest Staff";
            String emoji = (order.getMaid() != null && order.getMaid().getEmoji() != null) ? order.getMaid().getEmoji() : "🐾";
            String imageUrl = order.getMaid() != null ? order.getMaid().getImageUrl() : null;
            
            MaidLeaderboardEntry entry = leaderboardMap.computeIfAbsent(maidName, name -> 
                MaidLeaderboardEntry.builder()
                    .maidName(name)
                    .sales(BigDecimal.ZERO)
                    .orderCount(0L)
                    .emoji(emoji)
                    .imageUrl(imageUrl)
                    .build()
            );

            entry.setSales(entry.getSales().add(orderMapper.calculateTotal(order)));
            entry.setOrderCount(entry.getOrderCount() + 1);
        }

        List<MaidLeaderboardEntry> leaderboard = new ArrayList<>(leaderboardMap.values());
        leaderboard.sort((a, b) -> b.getSales().compareTo(a.getSales()));
        return leaderboard;
    }

    private List<OrderEntity> fetchCompletedOrders(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            startDate = LocalDate.now().atStartOfDay();
            endDate = LocalDate.now().atTime(23, 59, 59);
        }

        Specification<OrderEntity> spec = Specification.where(OrderSpecifications.hasDateRange(startDate, endDate))
                .and((root, query, cb) -> cb.equal(root.get("status"), OrderStatus.COMPLETED));

        return orderRepository.findAll(spec);
    }
}
