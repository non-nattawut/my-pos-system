package com.udong.posbackend.service;

import com.udong.posbackend.constant.Category;
import com.udong.posbackend.dto.PagedResponse;
import com.udong.posbackend.dto.product.BulkStockUpdateRequest;
import com.udong.posbackend.dto.product.StockUpdateItem;
import com.udong.posbackend.dto.product.ProductRequest;
import com.udong.posbackend.dto.product.ProductResponse;
import com.udong.posbackend.dto.product.StockUpdateRequest;
import com.udong.posbackend.exception.ResourceNotFoundException;
import com.udong.posbackend.mapper.ProductMapper;
import com.udong.posbackend.model.ProductEntity;
import com.udong.posbackend.repository.ProductRepository;
import com.udong.posbackend.repository.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getAllProducts(
            int page, int size, String name, Category category,
            BigDecimal minPrice, BigDecimal maxPrice,
            Integer minStock, Integer maxStock, Boolean deleted) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Specification<ProductEntity> spec = Specification.where(ProductSpecifications.hasDeletedStatus(deleted))
                .and(ProductSpecifications.hasName(name))
                .and(ProductSpecifications.hasCategory(category))
                .and(ProductSpecifications.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecifications.hasStockQuantityBetween(minStock, maxStock));
                
        Page<ProductResponse> productPage = productRepository.findAll(spec, pageable)
                .map(productMapper::toResponse);
                
        return PagedResponse.fromPage(productPage);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(UUID id) {
        ProductEntity product = productRepository.findActiveByIdOrThrow(id);
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        ProductEntity product = productMapper.toEntity(request);
        
        ProductEntity savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        ProductEntity product = productRepository.findActiveByIdOrThrow(id);

        productMapper.updateEntity(request, product);

        ProductEntity updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }

    @Transactional
    public ProductResponse updateStock(UUID id, StockUpdateRequest request) {
        ProductEntity product = productRepository.findActiveByIdOrThrow(id);
        
        product.setStockQuantity(request.getStockQuantity());
        ProductEntity updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        ProductEntity product = productRepository.findActiveByIdOrThrow(id);
        product.setDeleted(true);
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse restoreProduct(UUID id) {
        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        if (!product.isDeleted()) {
            throw new IllegalStateException("Product is not deleted");
        }
        product.setDeleted(false);
        ProductEntity savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    @Transactional
    public List<ProductResponse> updateStockList(BulkStockUpdateRequest request) {
        List<ProductResponse> responses = new ArrayList<>();
        for (StockUpdateItem item : request.getUpdates()) {
            ProductEntity product = productRepository.findActiveByIdOrThrow(item.getProductId());
            product.setStockQuantity(item.getStockQuantity());
            ProductEntity updatedProduct = productRepository.save(product);
            responses.add(productMapper.toResponse(updatedProduct));
        }
        return responses;
    }
}
