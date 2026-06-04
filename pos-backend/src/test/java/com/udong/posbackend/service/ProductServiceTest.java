package com.udong.posbackend.service;

import com.udong.posbackend.constant.Category;
import com.udong.posbackend.dto.product.ProductResponse;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.mapper.ProductMapper;
import com.udong.posbackend.model.ProductEntity;
import com.udong.posbackend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private UUID productId;
    private ProductEntity productEntity;
    private ProductResponse productResponse;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        productEntity = ProductEntity.builder()
                .id(productId)
                .name("Neko Curry")
                .price(BigDecimal.valueOf(14.50))
                .category(Category.MAINS)
                .stockQuantity(10)
                .deleted(false)
                .build();

        productResponse = ProductResponse.builder()
                .id(productId)
                .name("Neko Curry")
                .price(BigDecimal.valueOf(14.50))
                .category(Category.MAINS)
                .stockQuantity(10)
                .build();
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findActiveByIdOrThrow(productId)).thenReturn(productEntity);
        when(productMapper.toResponse(productEntity)).thenReturn(productResponse);

        ProductResponse response = productService.getProductById(productId);

        assertNotNull(response);
        assertEquals(productId, response.getId());
    }

    @Test
    void getProductById_SoftDeleted() {
        when(productRepository.findActiveByIdOrThrow(productId))
                .thenThrow(new ResourceNotFoundException("Product not found with id: " + productId));

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(productId));
    }

    @Test
    void deleteProduct_Success() {
        when(productRepository.findActiveByIdOrThrow(productId)).thenReturn(productEntity);
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        productService.deleteProduct(productId);

        assertTrue(productEntity.isDeleted());
        verify(productRepository, times(1)).save(productEntity);
        verify(productRepository, never()).delete(any(ProductEntity.class));
    }

    @Test
    void restoreProduct_Success() {
        productEntity.setDeleted(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(productEntity));
        when(productRepository.save(any(ProductEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productMapper.toResponse(productEntity)).thenReturn(productResponse);

        ProductResponse response = productService.restoreProduct(productId);

        assertNotNull(response);
        assertFalse(productEntity.isDeleted());
        verify(productRepository, times(1)).save(productEntity);
    }

    @Test
    void restoreProduct_NotDeleted() {
        when(productRepository.findById(productId)).thenReturn(Optional.of(productEntity));

        assertThrows(IllegalStateException.class, () -> productService.restoreProduct(productId));
        verify(productRepository, never()).save(any());
    }
}
