package com.udong.posbackend.repository;

import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.model.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, UUID>, JpaSpecificationExecutor<ProductEntity> {

    default ProductEntity findActiveByIdOrThrow(UUID id) {
        return findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
