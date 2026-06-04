package com.udong.posbackend.repository;

import com.udong.posbackend.model.ReceiptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReceiptRepository extends JpaRepository<ReceiptEntity, UUID>, JpaSpecificationExecutor<ReceiptEntity> {
    List<ReceiptEntity> findAllByOrderByCreatedAtDesc();
}
