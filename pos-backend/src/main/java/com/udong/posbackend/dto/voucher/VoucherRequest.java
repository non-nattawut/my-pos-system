package com.udong.posbackend.dto.voucher;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {
    @NotBlank(message = "Voucher code cannot be blank")
    private String code;

    @NotNull(message = "Discount percentage is required")
    @Min(value = 0, message = "Discount percentage must be non-negative")
    @Max(value = 100, message = "Discount percentage cannot exceed 100")
    private Integer discountPercentage;

    @NotNull(message = "Max uses is required")
    @Min(value = 1, message = "Max uses must be at least 1")
    private Integer maxUses;
}
