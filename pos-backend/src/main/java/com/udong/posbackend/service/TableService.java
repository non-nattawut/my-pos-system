package com.udong.posbackend.service;

import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.dto.table.TableRequest;
import com.udong.posbackend.dto.table.TableResponse;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.mapper.OrderMapper;
import com.udong.posbackend.mapper.TableMapper;
import com.udong.posbackend.model.CafeTableEntity;
import com.udong.posbackend.model.OrderEntity;
import com.udong.posbackend.repository.CafeTableRepository;
import com.udong.posbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final CafeTableRepository cafeTableRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final TableMapper tableMapper;

    @Transactional(readOnly = true)
    public List<TableResponse> getAllTables() {
        return cafeTableRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TableResponse getTableByNumber(String tableNumber) {
        CafeTableEntity table = cafeTableRepository.findByTableNumber(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with number: " + tableNumber));
        return mapToResponse(table);
    }

    @Transactional
    public TableResponse createTable(TableRequest request) {
        if (cafeTableRepository.findByTableNumber(request.getTableNumber()).isPresent()) {
            throw new IllegalArgumentException("Table with number " + request.getTableNumber() + " already exists");
        }

        CafeTableEntity table = CafeTableEntity.builder()
                .tableNumber(request.getTableNumber())
                .seatSize(request.getSeatSize())
                .build();

        CafeTableEntity savedTable = cafeTableRepository.save(table);
        return mapToResponse(savedTable);
    }

    @Transactional
    public void deleteTable(UUID id) {
        CafeTableEntity table = cafeTableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        // Check if there are active pending orders
        List<OrderEntity> activeOrders = orderRepository.findByTableIdAndReceiptIdIsNull(id);
        if (!activeOrders.isEmpty()) {
            throw new IllegalArgumentException("Cannot delete table because it has active pending orders");
        }

        cafeTableRepository.delete(table);
    }

    private TableResponse mapToResponse(CafeTableEntity table) {
        List<OrderEntity> orders = orderRepository.findByTableIdAndReceiptIdIsNull(table.getId());
        List<OrderResponse> activeOrders = orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());

        return tableMapper.toResponse(table, activeOrders, !activeOrders.isEmpty());
    }
}
