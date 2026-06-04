package com.udong.posbackend.repository;

import com.udong.posbackend.model.RunnerReceiptNumberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface RunnerReceiptNumberRepository extends JpaRepository<RunnerReceiptNumberEntity, UUID> {
    Optional<RunnerReceiptNumberEntity> findBySeqDate(String seqDate);
}
