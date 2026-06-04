package com.udong.posbackend.mapper;

import com.udong.posbackend.dto.voucher.VoucherRequest;
import com.udong.posbackend.dto.voucher.VoucherResponse;
import com.udong.posbackend.model.VoucherEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VoucherMapper {

    VoucherResponse toResponse(VoucherEntity voucher);

    @Mapping(target = "id", ignore = true)
    VoucherEntity toEntity(VoucherRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(VoucherRequest request, @MappingTarget VoucherEntity voucher);
}
