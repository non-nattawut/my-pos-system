package com.udong.posbackend.mapper;

import com.udong.posbackend.dto.order.OrderResponse;
import com.udong.posbackend.dto.table.TableResponse;
import com.udong.posbackend.model.CafeTableEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class})
public interface TableMapper {

    @Mapping(target = "id", source = "table.id")
    @Mapping(target = "tableNumber", source = "table.tableNumber")
    @Mapping(target = "seatSize", source = "table.seatSize")
    @Mapping(target = "activeOrders", source = "activeOrders")
    @Mapping(target = "occupied", source = "occupied")
    TableResponse toResponse(CafeTableEntity table, List<OrderResponse> activeOrders, boolean occupied);
}
