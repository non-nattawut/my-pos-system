package com.udong.posbackend.repository;

import com.udong.posbackend.model.CafeTableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CafeTableRepository extends JpaRepository<CafeTableEntity, UUID> {
    Optional<CafeTableEntity> findByTableNumber(String tableNumber);
}
