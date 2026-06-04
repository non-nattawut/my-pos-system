package com.udong.posbackend.service;

import com.udong.posbackend.dto.receipt.ReceiptResponse;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.mapper.ReceiptMapper;
import com.udong.posbackend.model.ReceiptEntity;
import com.udong.posbackend.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptMapper receiptMapper;

    @Transactional(readOnly = true)
    public List<ReceiptResponse> getAllReceipts(String maidName, String receiptNumber, LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime start = startDate == null ? LocalDate.now().atStartOfDay() : startDate;
        LocalDateTime end = endDate == null ? LocalDate.now().atTime(23, 59, 59) : endDate;

        final LocalDateTime finalStart = start;
        final LocalDateTime finalEnd = end;

        Specification<ReceiptEntity> spec = Specification.where((root, query, cb) -> 
            cb.between(root.get("createdAt"), finalStart, finalEnd)
        );

        if (receiptNumber != null && !receiptNumber.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("receiptNumber"), receiptNumber));
        }

        if (maidName != null && !maidName.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.join("maid").get("name")), "%" + maidName.toLowerCase() + "%"));
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        List<ReceiptEntity> receipts = receiptRepository.findAll(spec, sort);

        return receipts.stream()
                .map(receiptMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReceiptResponse getReceiptById(UUID id) {
        ReceiptEntity receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with id: " + id));
        return receiptMapper.toResponse(receipt);
    }
}
