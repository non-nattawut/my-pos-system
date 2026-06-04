package com.udong.posbackend.repository;

import com.udong.posbackend.constant.OrderStatus;
import com.udong.posbackend.constant.ServiceType;
import com.udong.posbackend.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID>, JpaSpecificationExecutor<OrderEntity> {
    List<OrderEntity> findAllByOrderByCreatedAtDesc();
    List<OrderEntity> findByServiceTypeAndTableTableNumberAndStatus(ServiceType serviceType, String tableNumber, OrderStatus status);
    List<OrderEntity> findByTableIdAndStatus(UUID tableId, OrderStatus status);
    List<OrderEntity> findByServiceTypeAndTableTableNumberAndStatusNot(ServiceType serviceType, String tableNumber, OrderStatus status);
    List<OrderEntity> findByTableIdAndStatusNot(UUID tableId, OrderStatus status);
    List<OrderEntity> findByStatusNotOrderByCreatedAtAsc(OrderStatus status);
    List<OrderEntity> findByServiceTypeAndTableTableNumberAndReceiptIdIsNull(ServiceType serviceType, String tableNumber);
    List<OrderEntity> findByTableIdAndReceiptIdIsNull(UUID tableId);
}
