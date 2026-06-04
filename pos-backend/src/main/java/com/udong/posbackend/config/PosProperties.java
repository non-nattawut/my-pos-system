package com.udong.posbackend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Data
@Component
@ConfigurationProperties(prefix = "pos")
public class PosProperties {

    /**
     * Tax rate as a decimal fraction (e.g. 0.07 = 7%).
     */
    private BigDecimal taxRate = new BigDecimal("0.07");

    /**
     * Service charge rate as a decimal fraction (e.g. 0.10 = 10%).
     */
    private BigDecimal serviceChargeRate = new BigDecimal("0.10");
}
