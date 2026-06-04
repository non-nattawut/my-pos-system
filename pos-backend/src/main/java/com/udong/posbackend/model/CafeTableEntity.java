package com.udong.posbackend.model;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "cafe_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CafeTableEntity extends BaseEntity {
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    @Column(name = "table_number", nullable = false, unique = true)
    private String tableNumber;

    @Column(name = "seat_size", nullable = false)
    private Integer seatSize;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
    }
}
