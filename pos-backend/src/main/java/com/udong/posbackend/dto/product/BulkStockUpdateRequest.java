package com.udong.posbackend.dto.product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkStockUpdateRequest {
    @NotEmpty(message = "Stock updates list cannot be empty")
    @Valid
    private List<StockUpdateItem> updates;
}
