package com.udong.posbackend.service;

import com.udong.posbackend.model.RunnerReceiptNumberEntity;
import com.udong.posbackend.repository.RunnerReceiptNumberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ReceiptNumberGeneratorService {

    private final RunnerReceiptNumberRepository repository;
    private final Random random = new Random();
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public String getNextReceiptNumber(String dateStr) {
        RunnerReceiptNumberEntity runner = repository.findBySeqDate(dateStr)
                .orElseGet(() -> RunnerReceiptNumberEntity.builder()
                        .seqDate(dateStr)
                        .lastValue(0L)
                        .build());

        long nextValue = runner.getLastValue() + 1;
        runner.setLastValue(nextValue);
        
        repository.saveAndFlush(runner);
        
        return String.format("NKB-%s-%04d", dateStr, nextValue);
    }

    public String generateReceiptNumber() {
        String dateStr = LocalDate.now().format(dateFormatter);
        int maxRetries = 10;
        int attempt = 0;

        while (attempt < maxRetries) {
            try {
                return getNextReceiptNumber(dateStr);
            } catch (ObjectOptimisticLockingFailureException | jakarta.persistence.OptimisticLockException e) {
                attempt++;
                if (attempt >= maxRetries) {
                    throw new RuntimeException("Failed to generate unique receipt number under concurrent load", e);
                }
                try {
                    Thread.sleep(50 + random.nextInt(50));
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Receipt number generation interrupted", ie);
                }
            }
        }
        throw new RuntimeException("Failed to generate receipt number");
    }
}
