package com.udong.posbackend.controller;

import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.dto.receipt.ReceiptResponse;
import com.udong.posbackend.dto.table.TableRequest;
import com.udong.posbackend.dto.table.TableResponse;
import com.udong.posbackend.service.OrderService;
import com.udong.posbackend.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;
    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAllTables() {
        List<TableResponse> tables = tableService.getAllTables();
        return ResponseEntity.ok(ApiResponse.success("Tables retrieved successfully", tables));
    }

    @GetMapping("/{tableNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<TableResponse>> getTableByNumber(@PathVariable String tableNumber) {
        TableResponse table = tableService.getTableByNumber(tableNumber);
        return ResponseEntity.ok(ApiResponse.success("Table retrieved successfully", table));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TableResponse>> createTable(@Valid @RequestBody TableRequest request) {
        TableResponse table = tableService.createTable(request);
        return ResponseEntity.ok(ApiResponse.success("Table created successfully", table));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable UUID id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.success("Table deleted successfully", null));
    }

    @GetMapping("/{tableNumber}/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getPendingTableOrders(@PathVariable String tableNumber) {
        List<OrderResponse> orders = orderService.getPendingDineInOrdersByTable(tableNumber);
        return ResponseEntity.ok(ApiResponse.success("Pending orders retrieved for table " + tableNumber, orders));
    }

    @PostMapping("/{tableNumber}/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID')")
    public ResponseEntity<ApiResponse<ReceiptResponse>> payTableOrders(
            @PathVariable String tableNumber,
            @RequestParam(required = false) String voucherCode) {
        ReceiptResponse receipt = orderService.payTable(tableNumber, voucherCode);
        return ResponseEntity.ok(ApiResponse.success("Table " + tableNumber + " bill settled successfully", receipt));
    }
}
