package com.udong.posbackend.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricsResponse {
    private BigDecimal grossRevenue;
    private long orderVolume;
    private BigDecimal averageOrderValue;
    private String hottestCategory;
    private BigDecimal netProfit;
    private BigDecimal profitMargin;
}
