package com.udong.posbackend.repository;

import com.udong.posbackend.model.VoucherEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoucherRepository extends JpaRepository<VoucherEntity, UUID> {
    Optional<VoucherEntity> findByCode(String code);
}
