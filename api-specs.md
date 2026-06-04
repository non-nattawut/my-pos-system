# NekoBite Cafe POS — API Specifications

This document outlines the REST API endpoints and data contract exposed by the Spring Boot `pos-backend` to the Next.js `pos-frontend` client. 

---

## 🚀 General System Configuration

* **Base URL**: `http://localhost:8080`
* **Content-Type**: `application/json`
* **Authentication**: Token-based using JWT. Add the token to the `Authorization` header on all secured endpoints:
  ```http
  Authorization: Bearer <jwt_token>
  ```

### Standard Response Wrapper
All API responses from the backend follow a standardized JSON envelope structure:
```typescript
interface ApiResponse<T> {
  success: boolean;       // true if the request succeeded, false otherwise
  message: string;        // Developer-friendly message detailing the result
  data: T;                // The payload (null if success is false)
  timestamp: string;      // ISO-8601 DateTime (e.g. "2026-05-30T17:45:00")
}
```

---

## 👤 Seeded Maid Accounts (Security PINs)

The database is pre-seeded with one `ADMIN` staff and four `MAID` maids. Maids authenticate via their security PINs (which act as passwords).

| Email | PIN (Password) | Display Name | Role |
| :--- | :--- | :--- | :--- |
| `admin@pos.com` | `admin123` | Admin Staff | `ADMIN` |
| `yuna@nekobite.com` | `1111` | Maid Yuna #01 | `MAID` |
| `rin@nekobite.com` | `2222` | Maid Rin #02 | `MAID` |
| `mei@nekobite.com` | `3333` | Maid Mei #03 | `MAID` |
| `koko@nekobite.com` | `4444` | Maid Koko #04 | `MAID` |

---

## 🪑 Seeded Cafe Tables

The database is pre-seeded with 8 dining tables. Odd-numbered tables have 2 seats, and even-numbered tables have 4 seats:

| Table Number | Seat Capacity (Size) |
| :--- | :--- |
| `1` | 2 |
| `2` | 4 |
| `3` | 2 |
| `4` | 4 |
| `5` | 2 |
| `6` | 4 |
| `7` | 2 |
| `8` | 4 |

---

## 🗂️ Product Category Enum

In the backend Java codebase, the product categories are defined using the uppercase enum constant names: `MAINS`, `DRINKS`, `DESSERTS`, `MERCH`. 

However, to maintain perfect compatibility with the Next.js frontend, Jackson converts these values to and from their lowercase representations (`"mains"`, `"drinks"`, `"desserts"`, `"merch"`) in all API JSON payloads. When persisting to the SQLite database, standard uppercase strings (`"MAINS"`, `"DRINKS"`, etc.) are written.

---

## 📦 Seeded Product Mappings (Mock IDs to UUIDs)

The database is pre-seeded with the 16 menu items. Because they use deterministic UUIDs derived from their initial mockup IDs (`m1`, `d1`, etc.), here is their exact mapping for database querying and synchronization:

### Mains (`MAINS`)
* **m1** `Neko Curry 🍛`
* **m2** `Cyber Soy Ramen 🍜`
* **m3** `Moe Maid Omurice 🍳`
* **m4** `Sakura Bento Box 🍱`

### Drinks (`DRINKS`)
* **d1** `Neko Matcha Latte 🍵`
* **d2** `Neon Boba Tea 🧋`
* **d3** `Strawberry Ramune 🥤`
* **d4** `Mana Potion Elixir 🧪`

### Desserts (`DESSERTS`)
* **de1** `Souffle Pancakes 🥞`
* **de2** `Hanami Dango 🍡`
* **de3** `Kawaii Berry Parfait 🍧`
* **de4** `Anko Taiyaki Waffle 🐟`

### Merch (`MERCH`)
* **me1** `Neko Maid Earbands 🐱`
* **me2** `Holo Mascot Keyring 🔑`
* **me3** `Cyber Cafe Poster 🖼️`
* **me4** `Signature Mascot Mug ☕`

---

## 🛠️ API Endpoint Specifications

### 1. Authentication Endpoints

#### POST `/api/v1/auth/login`
Authenticates a user/maid and returns a JWT token.

* **Authorization**: Anonymous (No token required)
* **Request Body**:
  ```json
  {
    "email": "yuna@nekobite.com",
    "password": "1111"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "email": "yuna@nekobite.com",
      "displayName": "Maid Yuna #01",
      "role": "MAID"
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

---

### 2. Product Catalog Endpoints

#### GET `/api/v1/products`
Retrieves a paginated and filtered list of products in the database.

* **Authorization**: Anonymous (No token required)
* **Query Parameters**:
  * `page` (optional, integer, default: `0`): Page index.
  * `size` (optional, integer, default: `10`): Number of records per page.
  * `name` (optional, string): Case-insensitive search on the product name.
  * `category` (optional, string): Filter by category (`mains`, `drinks`, `desserts`, `merch`).
  * `minPrice` (optional, decimal): Minimum product price filter.
  * `maxPrice` (optional, decimal): Maximum product price filter.
  * `minStock` (optional, integer): Minimum stock quantity filter.
  * `maxStock` (optional, integer): Maximum stock quantity filter.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Products retrieved successfully",
    "data": {
      "content": [
        {
          "id": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
          "name": "Neko Curry 🍛",
          "emoji": "🍛",
          "category": "mains",
          "price": 14.50,
          "description": "Cute sleeping cat-shaped rice swimming in our delicious house vegetable curry.",
          "color": "from-pink-500/20 to-purple-500/20 hover:border-pink-500",
          "accentColor": "#ec4899",
          "stockQuantity": 12
        }
      ],
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 16,
      "totalPages": 2,
      "last": false
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### GET `/api/v1/products/{id}`
Retrieves a specific product by its UUID.

* **Authorization**: Anonymous (No token required)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Product retrieved successfully",
    "data": {
      "id": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
      "name": "Neko Curry 🍛",
      "emoji": "🍛",
      "category": "mains",
      "price": 14.50,
      "description": "Cute sleeping cat-shaped rice...",
      "color": "from-pink-500/20 to-purple-500/20 hover:border-pink-500",
      "accentColor": "#ec4899",
      "stockQuantity": 12
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### POST `/api/v1/products`
Creates a new menu product in the database.

* **Authorization**: Secured (`Authorization: Bearer <token>`, Role must be `ADMIN`)
* **Request Body**:
  ```json
  {
    "name": "Super Strawberry Soda 🥤",
    "emoji": "🥤",
    "category": "drinks",
    "price": 6.50,
    "description": "Bubbly goodness.",
    "color": "from-pink-400/20 to-red-400/20 hover:border-pink-400",
    "accentColor": "#f472b6",
    "stockQuantity": 50
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "id": "e22ea112-9c1c-43f1-b99d-19446d3e3870",
      "name": "Super Strawberry Soda 🥤",
      "emoji": "🥤",
      "category": "drinks",
      "price": 6.50,
      "description": "Bubbly goodness.",
      "color": "from-pink-400/20 to-red-400/20 hover:border-pink-400",
      "accentColor": "#f472b6",
      "stockQuantity": 50
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### PUT `/api/v1/products/{id}`
Updates an existing product's fields.

* **Authorization**: Secured (`Authorization: Bearer <token>`, Role must be `ADMIN`)
* **Request Body**: Same schema as `POST /api/v1/products`
* **Success Response (200 OK)**: Same schema as creation response showing modified values.

#### PUT `/api/v1/products/{id}/stock`
Updates only the stock level of a specific product (used when restocking or correcting counts).

* **Authorization**: Anonymous or Secured (Accessible by `MAID` / `ADMIN` maids)
* **Request Body**:
  ```json
  {
    "stockQuantity": 35
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Stock updated successfully",
    "data": {
      "id": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
      "name": "Neko Curry 🍛",
      ...
      "stockQuantity": 35
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### PUT `/api/v1/products/stock`
Updates the stock levels of multiple products in a single bulk request.

* **Authorization**: Secured (Accessible by `MAID` / `ADMIN` maids)
* **Request Body**:
  ```json
  {
    "updates": [
      {
        "productId": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
        "stockQuantity": 40
      },
      {
        "productId": "aaf2f899-9237-3705-9ac8-44c0a2a1d45f",
        "stockQuantity": 15
      }
    ]
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Stock list updated successfully",
    "data": [
      {
        "id": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
        "name": "Neko Curry 🍛",
        "emoji": "🍛",
        "category": "mains",
        "price": 14.50,
        "description": "Cute sleeping cat-shaped rice...",
        "color": "from-pink-500/20 to-purple-500/20 hover:border-pink-500",
        "accentColor": "#ec4899",
        "stockQuantity": 40
      },
      {
        "id": "aaf2f899-9237-3705-9ac8-44c0a2a1d45f",
        "name": "Cyber Soy Ramen 🍜",
        "emoji": "🍜",
        "category": "mains",
        "price": 16.00,
        "description": "Traditional ramen...",
        "color": "from-cyan-500/20 to-blue-500/20 hover:border-cyan-500",
        "accentColor": "#06b6d4",
        "stockQuantity": 15
      }
    ],
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### DELETE `/api/v1/products/{id}`
Deletes a product from the system.

* **Authorization**: Secured (`Authorization: Bearer <token>`, Role must be `ADMIN`)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully",
    "data": null,
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

---

### 3. Order & Checkout Endpoints

#### POST `/api/v1/orders`
Submits a point-of-sale cart checkout. The backend automatically deducts the quantity of items purchased from the corresponding products' stock level.

* **Authorization**: Anonymous or Secured (Usually requested with JWT to log maid names)
* **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
        "quantity": 2,
        "note": "Extra curry sauce please!"
      }
    ],
    "subtotal": 29.00,
    "tax": 2.03,
    "serviceCharge": 2.90,
    "discount": 0.00,
    "total": 33.93,
    "paymentMethod": "cash",
    "status": "completed",
    "maidEmail": "yuna@nekobite.com",
    "serviceType": "dine-in",
    "tableNumber": "04",
    "ticketNumber": null
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Order processed successfully",
    "data": {
      "id": "01900000-8800-4b5c-b17e-9086cdff6801",
      "receiptNumber": "NKB-30-05-2026-0001",
      "items": [
        {
          "id": "01900000-8800-4b5c-b17e-9086cdff6802",
          "productId": "ae7be26c-daa7-32ca-9480-68d5ac90eaca",
          "productName": "Neko Curry 🍛",
          "quantity": 2,
          "price": 14.50,
          "note": "Extra curry sauce please!"
        }
      ],
      "subtotal": 29.00,
      "tax": 2.03,
      "serviceCharge": 2.90,
      "discount": 0.00,
      "total": 33.93,
      "date": "2026-05-30",
      "time": "17:45:00",
      "paymentMethod": "cash",
      "status": "completed",
      "maidName": "Maid Yuna #01",
      "serviceType": "dine-in",
      "tableNumber": "04",
      "ticketNumber": null
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### GET `/api/v1/orders`
Retrieves the global order history logs.

* **Authorization**: Anonymous or Secured
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Order history retrieved successfully",
    "data": [
      {
        "id": "01900000-8800-4b5c-b17e-9086cdff6801",
        "receiptNumber": "NKB-30-05-2026-0001",
        "items": [...],
        "total": 33.93,
        "date": "2026-05-30",
        "time": "17:45:00",
        "paymentMethod": "cash",
        "status": "completed",
        "maidName": "Maid Yuna #01",
        "serviceType": "dine-in",
        "tableNumber": "04"
      }
    ],
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### GET `/api/v1/orders/table/{tableNumber}`
Fetches active orders mapped to a specific dine-in table that are marked with `"status": "pending"`. Used in the table bill dispatcher screen.

* **Authorization**: Anonymous or Secured
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Pending orders retrieved for table 04",
    "data": [
      {
        "id": "01900000-8800-4b5c-b17e-9086cdff6801",
        "receiptNumber": "NKB-30-05-2026-0001",
        "items": [...],
        "total": 33.93,
        "date": "2026-05-30",
        "time": "17:45:00",
        "paymentMethod": "cash",
        "status": "pending",
        "maidName": "Maid Yuna #01",
        "serviceType": "dine-in",
        "tableNumber": "04"
      }
    ],
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### POST `/api/v1/orders/table/{tableNumber}/pay`
Settles the combined bill for all `"pending"` orders assigned to a specific table. This updates all of those order records' status fields to `"completed"`.

* **Authorization**: Anonymous or Secured
* **Success Response (200 OK)**: Returns the list of orders that were settled.
  ```json
  {
    "success": true,
    "message": "Table 04 bill settled successfully",
    "data": [
      {
        "id": "01900000-8800-4b5c-b17e-9086cdff6801",
        "receiptNumber": "NKB-30-05-2026-0001",
        "items": [...],
        "total": 33.93,
        "date": "2026-05-30",
        "time": "17:45:00",
        "paymentMethod": "cash",
        "status": "completed",
        "maidName": "Maid Yuna #01",
        "serviceType": "dine-in",
        "tableNumber": "04"
      }
    ],
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

---

### 4. Table Management Endpoints

#### GET `/api/v1/tables`
Retrieves a list of all dining tables and lists any active pending orders mapped to them.

* **Authorization**: Secured (`Authorization: Bearer <token>`, Accessible by `MAID` / `ADMIN`)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Tables retrieved successfully",
    "data": [
      {
        "id": "e44d32a9-c0c1-4b13-81b3-f09c62c93911",
        "tableNumber": "04",
        "seatSize": 4,
        "occupied": true,
        "activeOrders": [
          {
            "id": "01900000-8800-4b5c-b17e-9086cdff6801",
            "items": [...],
            "total": 33.93,
            "status": "pending",
            "tableNumber": "04"
          }
        ]
      }
    ],
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### GET `/api/v1/tables/{tableNumber}`
Retrieves details of a specific dining table, including its active pending orders.

* **Authorization**: Secured (`Authorization: Bearer <token>`, Accessible by `MAID` / `ADMIN`)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Table retrieved successfully",
    "data": {
      "id": "e44d32a9-c0c1-4b13-81b3-f09c62c93911",
      "tableNumber": "04",
      "seatSize": 4,
      "occupied": true,
      "activeOrders": [...]
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### POST `/api/v1/tables`
Adds a new dining table to the cafe floor configuration.

* **Authorization**: Secured (`Authorization: Bearer <token>`, Role must be `ADMIN`)
* **Request Body**:
  ```json
  {
    "tableNumber": "09",
    "seatSize": 2
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Table created successfully",
    "data": {
      "id": "01900000-9900-4b5c-b17e-9086cdff6901",
      "tableNumber": "09",
      "seatSize": 2,
      "occupied": false,
      "activeOrders": []
    },
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```

#### DELETE `/api/v1/tables/{id}`
Deletes a table configuration from the system. (Can only be deleted if there are no pending active orders mapped to it).

* **Authorization**: Secured (`Authorization: Bearer <token>`, Role must be `ADMIN`)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Table deleted successfully",
    "data": null,
    "timestamp": "2026-05-30T17:45:00.123456"
  }
  ```
