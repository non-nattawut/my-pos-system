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
public class CategoryShareResponse {
    private String category;
    private BigDecimal sales;
    private BigDecimal sharePercentage;
}
