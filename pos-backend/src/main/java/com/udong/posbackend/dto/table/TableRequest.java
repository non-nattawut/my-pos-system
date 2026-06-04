package com.udong.posbackend.dto.table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableRequest {
    @NotBlank(message = "Table number cannot be blank")
    private String tableNumber;

    @NotNull(message = "Seat size is required")
    @Positive(message = "Seat size must be positive")
    private Integer seatSize;
}
