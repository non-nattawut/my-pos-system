package com.udong.posbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.udong.posbackend.constant.Category;
import com.udong.posbackend.dto.PagedResponse;
import com.udong.posbackend.dto.product.ProductResponse;
import com.udong.posbackend.exception.GlobalExceptionHandler;
import com.udong.posbackend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void getCategories_Success() throws Exception {
        mockMvc.perform(get("/v1/products/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Categories retrieved successfully"))
                .andExpect(jsonPath("$.data[0]").value("MAINS"))
                .andExpect(jsonPath("$.data[1]").value("DRINKS"));
    }

    @Test
    void getAllProducts_Success() throws Exception {
        ProductResponse productResponse = ProductResponse.builder()
                .id(UUID.randomUUID())
                .name("Coffee")
                .price(BigDecimal.valueOf(4.50))
                .category(Category.DRINKS)
                .stockQuantity(10)
                .build();

        PagedResponse<ProductResponse> pagedResponse = PagedResponse.<ProductResponse>builder()
                .content(Collections.singletonList(productResponse))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1L)
                .totalPages(1)
                .last(true)
                .build();

        when(productService.getAllProducts(anyInt(), anyInt(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/v1/products")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].name").value("Coffee"))
                .andExpect(jsonPath("$.data.content[0].category").value("DRINKS"));
    }

    @Test
    void deleteProduct_Success() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/v1/products/" + UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product deleted successfully"));
    }

    @Test
    void restoreProduct_Success() throws Exception {
        UUID id = UUID.randomUUID();
        ProductResponse productResponse = ProductResponse.builder()
                .id(id)
                .name("Coffee")
                .price(BigDecimal.valueOf(4.50))
                .category(Category.DRINKS)
                .stockQuantity(10)
                .build();

        when(productService.restoreProduct(any(UUID.class))).thenReturn(productResponse);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/v1/products/" + id + "/restore"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Product restored successfully"))
                .andExpect(jsonPath("$.data.name").value("Coffee"));
    }
}
