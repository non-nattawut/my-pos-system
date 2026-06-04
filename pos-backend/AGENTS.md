# Agent & Developer Guidelines: Spring Boot POS Backend

Welcome! This document outlines the architectural standards, API design patterns, and Spring Boot best practices to follow when developing features in the POS (Point-of-Sale) backend system.

---

## 📖 Core Rules for AI Agents
1. Whenever you work on this project, you **must** read the Spring Boot developer skill file at [java-springboot/SKILL.md](file:///F:/Work/Programming/my-pos-system/pos-backend/.agents/skills/java-springboot/SKILL.md) to ensure compliance with the defined patterns.
2. Whenever you **create** or **delete** a file, you **must** immediately update [index.md](file:///F:/Work/Programming/my-pos-system/pos-backend/index.md) to reflect the new file/folder structure.
3. For UUIDv7 generation, do not use the fully qualified class name `com.github.f4b6a3.uuid.UuidCreator.getTimeOrderedEpoch()`. Always import `com.github.f4b6a3.uuid.UuidCreator` and invoke `UuidCreator.getTimeOrderedEpoch()` directly to keep the code clean and readable.
4. You **must always** create a detailed implementation plan and obtain explicit user approval before executing any modifications or running commands on the codebase.

---

## 🏗️ Architecture & Package Structure (MVC/Layered)

We follow a classic **Model-View-Controller (MVC) / Layered** package structure. This organizes code by technical layer (Controller/Web, Service, Repository/Model) rather than by feature domain.

```
com.udong.posbackend
├── PosBackendApplication.java
├── config                  # Configuration beans, security, and spring profiles
├── controller              # Controllers (View/API representation layer)
│   ├── ProductController.java
│   ├── SaleController.java
│   └── CustomerController.java
├── service                 # Business logic layer
│   ├── ProductService.java
│   ├── SaleService.java
│   └── CustomerService.java
├── repository              # Database access layer (Spring Data JPA)
│   ├── ProductRepository.java
│   ├── SaleRepository.java
│   └── CustomerRepository.java
├── model                   # Database Entities (Domain model objects)
│   ├── Product.java
│   ├── Sale.java
│   ├── SaleItem.java
│   └── Customer.java
├── dto                     # Data Transfer Objects (Request/Response payloads)
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   └── SaleRequest.java
└── exception               # Global exception handlers & custom exception classes
    ├── GlobalExceptionHandler.java
    └── ResourceNotFoundException.java
```

### Key Architectural Layers:
1. **Controller (API Layer)**: Handles HTTP requests, performs request validation, and maps requests to services. Returns standard API DTO responses.
2. **Service (Business Layer)**: Coordinates business transactions, applies logic, and acts as the bridge between Controllers and Repositories.
3. **Model / Repository (Data Layer)**: Represents the database entities (JPA `@Entity`) and provides database query operations via Spring Data Interfaces.

---

## ⚡ Java & Spring Boot Best Practices

### 1. Dependency Injection
* **Constructor Injection**: Always use constructor-based injection for required dependencies.
* **Immutability**: Declare dependencies as `private final` to ensure thread safety and simple testing. Do not use field injection (`@Autowired` on fields).
* Use `@RequiredArgsConstructor` from Lombok to generate constructors automatically.

```java
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    // Lombok automatically generates the constructor for the final fields
}
```

### 2. API Design & DTOs
* **No Raw Entities in API**: Never expose JPA entities (`@Entity` in `model/`) directly to the API controllers. Always use specific Request/Response Data Transfer Objects (DTOs) in the `dto/` package.
* **No Java Records**: Do not use Java `record` classes for DTOs.
* **Lombok DTO Classes**: Use standard Java classes annotated with Lombok (`@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`) for all request and response DTO payloads.
* **Use Enums for Constants**: For all fields with a finite set of constant values (e.g., payment method, status, service type, category, role), always define and use a Java `enum` instead of hardcoded string constants.
* **Validation**: Annotate DTO parameters with JSR 380 bean validation (e.g., `@NotNull`, `@NotBlank`, `@DecimalMin`, `@PositiveOrZero`). Enable validation in controllers using `@Valid`.
* **Standard Response Format**: Wrap API responses in a consistent wrapper (e.g., `ApiResponse<T>`).

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    @NotBlank(message = "Product name cannot be blank")
    private String name;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;
    
    @PositiveOrZero(message = "Initial stock must be zero or positive")
    private int stockQuantity;
}
```

### 3. Business & Service Layer
* **Transaction Integrity**: Annotate business transaction methods in `@Service` classes with Spring's `@Transactional` annotation.
* **Read-only Transactions**: For query-only methods, specify `@Transactional(readOnly = true)` to optimize DB performance.
* **Statelessness**: Services must be stateless to allow horizontal scaling.

### 4. Global Exception Handling
* Do not return raw stack traces or default Tomcat error pages.
* Implement a `@RestControllerAdvice` (in `exception/`) that catches custom runtime business exceptions (e.g., `ProductNotFoundException`, `InsufficientStockException`) and returns standardized error structures.

```json
{
  "timestamp": "2026-05-30T13:37:26Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product with ID 123 not found",
  "path": "/api/v1/products/123"
}
```

### 5. Type Declarations
* **No `var` Keyword**: Do not use the `var` keyword for local variable type inference in Java. Always declare local variables with their explicit, real types (e.g., `List<OrderEntity> orders = ...` instead of `var orders = ...`).

---

## 🧪 Testing Guidelines
* **Mandatory Coverage**: You must write unit tests for every API (Controller) and Service class created or modified.
* **Unit Testing**: Target 80%+ test coverage on all services. Use JUnit 5 and Mockito.
* **API Controller Testing**: Use `@WebMvcTest` to test controllers in isolation without booting the full Spring Boot application context.
* **Repository Testing**: Use `@DataJpaTest` for persistence layer verification.
