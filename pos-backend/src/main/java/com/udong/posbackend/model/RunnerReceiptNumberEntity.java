package com.udong.posbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import com.github.f4b6a3.uuid.UuidCreator;

@Entity
@Table(name = "runner_receipt_numbers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunnerReceiptNumberEntity {
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "seq_date", nullable = false, unique = true)
    private String seqDate; // Format: "DD-MM-YYYY"

    @Column(name = "last_value", nullable = false)
    private Long lastValue;

    @Version
    @Column(name = "version")
    private Long version;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
