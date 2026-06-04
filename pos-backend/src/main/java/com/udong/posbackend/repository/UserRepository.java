package com.udong.posbackend.repository;

import com.udong.posbackend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    java.util.List<UserEntity> findByRole(com.udong.posbackend.constant.Role role);
}
