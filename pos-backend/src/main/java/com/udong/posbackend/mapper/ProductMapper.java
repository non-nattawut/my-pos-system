package com.udong.posbackend.mapper;

import com.udong.posbackend.dto.product.ProductRequest;
import com.udong.posbackend.dto.product.ProductResponse;
import com.udong.posbackend.model.ProductEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface ProductMapper {

    ProductResponse toResponse(ProductEntity product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    ProductEntity toEntity(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateEntity(ProductRequest request, @MappingTarget ProductEntity product);
}
