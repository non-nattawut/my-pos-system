package com.udong.posbackend.controller;

import com.udong.posbackend.constant.Category;
import com.udong.posbackend.dto.ApiResponse;
import com.udong.posbackend.dto.PagedResponse;
import com.udong.posbackend.dto.product.BulkStockUpdateRequest;
import com.udong.posbackend.dto.product.ProductRequest;
import com.udong.posbackend.dto.product.ProductResponse;
import com.udong.posbackend.dto.product.StockUpdateRequest;
import com.udong.posbackend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<Category[]>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", Category.values()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minStock,
            @RequestParam(required = false) Integer maxStock,
            @RequestParam(required = false, defaultValue = "false") Boolean deleted) {
        
        PagedResponse<ProductResponse> products = productService.getAllProducts(
                page, size, name, category, minPrice, maxPrice, minStock, maxStock, deleted);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID', 'CHEF')")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable UUID id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable UUID id, 
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateStock(
            @PathVariable UUID id, 
            @Valid @RequestBody StockUpdateRequest request) {
        ProductResponse product = productService.updateStock(id, request);
        return ResponseEntity.ok(ApiResponse.success("Stock updated successfully", product));
    }

    @PutMapping("/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MAID')")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> updateStockList(
            @Valid @RequestBody BulkStockUpdateRequest request) {
        List<ProductResponse> products = productService.updateStockList(request);
        return ResponseEntity.ok(ApiResponse.success("Stock list updated successfully", products));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> restoreProduct(@PathVariable UUID id) {
        ProductResponse product = productService.restoreProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product restored successfully", product));
    }
}
