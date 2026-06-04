package com.udong.posbackend.repository;

import com.udong.posbackend.model.OrderEntity;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.model.ReceiptEntity;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;

public class OrderSpecifications {

    public static Specification<OrderEntity> hasReceiptNumber(String receiptNumber) {
        return (root, query, cb) -> {
            if (receiptNumber == null || receiptNumber.isBlank()) return null;
            Join<OrderEntity, ReceiptEntity> receiptJoin = root.join("receipt");
            return cb.like(cb.lower(receiptJoin.get("receiptNumber")), "%" + receiptNumber.toLowerCase() + "%");
        };
    }

    public static Specification<OrderEntity> hasMaidName(String maidName) {
        return (root, query, cb) -> {
            if (maidName == null || maidName.isBlank()) return null;
            Join<OrderEntity, UserEntity> maidJoin = root.join("maid");
            return cb.equal(cb.lower(maidJoin.get("name")), maidName.toLowerCase());
        };
    }

    public static Specification<OrderEntity> hasDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null) return null;
            if (startDate != null && endDate != null) {
                return cb.between(root.get("createdAt"), startDate, endDate);
            }
            if (startDate != null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            }
            return cb.lessThanOrEqualTo(root.get("createdAt"), endDate);
        };
    }
}
