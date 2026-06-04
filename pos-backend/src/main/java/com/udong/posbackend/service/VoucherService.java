package com.udong.posbackend.service;

import com.udong.posbackend.dto.voucher.VoucherRequest;
import com.udong.posbackend.dto.voucher.VoucherResponse;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.mapper.VoucherMapper;
import com.udong.posbackend.model.VoucherEntity;
import com.udong.posbackend.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Transactional(readOnly = true)
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAll().stream()
                .map(voucherMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VoucherResponse getVoucherById(UUID id) {
        VoucherEntity voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + id));
        return voucherMapper.toResponse(voucher);
    }

    @Transactional(readOnly = true)
    public VoucherResponse getVoucherByCode(String code) {
        VoucherEntity voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with code: " + code));
        if (voucher.getMaxUses() != null && voucher.getUsedCount() >= voucher.getMaxUses()) {
            throw new IllegalArgumentException("Voucher is out of uses");
        }
        return voucherMapper.toResponse(voucher);
    }

    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        if (voucherRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Voucher code '" + request.getCode() + "' already exists");
        }
        VoucherEntity voucher = voucherMapper.toEntity(request);
        VoucherEntity savedVoucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(savedVoucher);
    }

    @Transactional
    public VoucherResponse updateVoucher(UUID id, VoucherRequest request) {
        VoucherEntity voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + id));

        // Check if updating code to an existing code of a different voucher
        voucherRepository.findByCode(request.getCode())
                .ifPresent(v -> {
                    if (!v.getId().equals(id)) {
                        throw new IllegalArgumentException("Voucher code '" + request.getCode() + "' already exists");
                    }
                });

        voucherMapper.updateEntityFromRequest(request, voucher);
        VoucherEntity savedVoucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(savedVoucher);
    }

    @Transactional
    public void deleteVoucher(UUID id) {
        if (!voucherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Voucher not found with id: " + id);
        }
        voucherRepository.deleteById(id);
    }
}
