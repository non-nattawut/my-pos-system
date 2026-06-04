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
public class MaidLeaderboardEntry {
    private String maidName;
    private BigDecimal sales;
    private long orderCount;
    private String emoji;
    private String imageUrl;
}
