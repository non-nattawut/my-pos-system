package com.udong.posbackend.mapper;

import com.udong.posbackend.dto.order.OrderItemResponse;
import com.udong.posbackend.model.OrderItemEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class, DateTimeMapper.class})
public interface OrderItemMapper {

    OrderItemResponse toResponse(OrderItemEntity item);
}
