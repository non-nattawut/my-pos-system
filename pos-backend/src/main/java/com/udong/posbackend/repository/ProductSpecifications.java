package com.udong.posbackend.repository;

import com.udong.posbackend.constant.Category;
import com.udong.posbackend.model.ProductEntity;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;

public class ProductSpecifications {

    public static Specification<ProductEntity> hasDeletedStatus(Boolean deleted) {
        return (root, query, cb) -> deleted == null ? null : cb.equal(root.get("deleted"), deleted);
    }

    public static Specification<ProductEntity> hasName(String name) {
        return (root, query, cb) -> name == null ? null :
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<ProductEntity> hasCategory(Category category) {
        return (root, query, cb) -> category == null ? null :
                cb.equal(root.get("category"), category);
    }

    public static Specification<ProductEntity> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) return cb.between(root.get("price"), minPrice, maxPrice);
            if (minPrice != null) return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<ProductEntity> hasStockQuantityBetween(Integer minStock, Integer maxStock) {
        return (root, query, cb) -> {
            if (minStock == null && maxStock == null) return null;
            if (minStock != null && maxStock != null) return cb.between(root.get("stockQuantity"), minStock, maxStock);
            if (minStock != null) return cb.greaterThanOrEqualTo(root.get("stockQuantity"), minStock);
            return cb.lessThanOrEqualTo(root.get("stockQuantity"), maxStock);
        };
    }
}
