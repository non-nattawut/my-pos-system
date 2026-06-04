package com.udong.posbackend.mapper;

import com.udong.posbackend.dto.receipt.ReceiptResponse;
import com.udong.posbackend.model.ReceiptEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderMapper.class, DateTimeMapper.class})
public interface ReceiptMapper {

    @Mapping(target = "maidName", expression = "java(receipt.getMaid() != null ? receipt.getMaid().getName() : null)")
    @Mapping(target = "tableNumber", expression = "java(receipt.getTable() != null ? receipt.getTable().getTableNumber() : null)")
    ReceiptResponse toResponse(ReceiptEntity receipt);
}
