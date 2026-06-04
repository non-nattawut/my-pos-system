# NekoBite Cafe: Anime-Style Point-of-Sale (POS) System 🐾

Welcome to **NekoBite Cafe POS**, a high-fidelity, game-inspired Point-of-Sale and Kitchen Queue Management System designed with a vibrant anime aesthetic. This project is a full-stack application built to practice and showcase Next.js (Frontend) and Java Spring Boot (Backend) integration.

---

## 🏗️ System Architecture & Stack

The application is structured as a decoupled monorepo containing two main component projects:

```
my-pos-system/
├── pos-backend/       # Java Spring Boot API (Business Logic & Database)
├── pos-frontend/      # Next.js Client App (UI & Interactive cash register)
└── README.md
```

### 🎨 Frontend (`pos-frontend`)
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** CSS & Tailwind CSS
* **Animations:** Framer Motion (for satisfying micro-animations & transitions)

### ☕ Backend (`pos-backend`)
* **Framework:** Spring Boot (Java 25+)
* **Database:** Spring Data JPA / Hibernate (H2 Database for dev/demo)
* **Architecture:** strict MVC Layered Architecture (Controller ➔ Service ➔ Repository)

---

## 🌟 Key Features

1. **Vibrant Anime Cashier Dashboard:**
   * Interactive table grids (Dine-in tracking, unbilled orders indicator).
   * Real-time cart system featuring a virtual cash drawer, change calculator, and responsive layouts.
   * Dynamic voucher applicator with auto-calculated discounts.
2. **Kitchen Queue Board:**
   * Dynamic order queue tracker split into culinary status lanes (Pending, Preparing, Completed).
   * Instant status progression controls.
3. **Moe Efficiency Metrics (Leaderboard):**
   * Maid/Staff performance ranking with sales volume and order counts.
   * Image avatar support with automated fallback options.
4. **Stock & Inventory Console:**
   * Full product catalogs with valuation dashboards (Total cost vs. Total retail valuation).
   * Transaction-safe quantity alerts.

---

## 🚀 How to Run the Demo

Follow these instructions to spin up the full-stack demo environment locally.

### Prerequisites
* **Java SDK 25** installed.
* **Node.js (v18+) & npm** installed.
* **Maven** installed (or use the provided Maven wrapper `mvnw`).

---

### Step 1: Spin Up the Backend API

1. Navigate to the backend directory:
   ```bash
   cd pos-backend
   ```
2. Build and run the Spring Boot application:
   * **Windows (PowerShell):**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   * **macOS / Linux:**
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
3. The API will start and be available at: **`http://localhost:8080`**
4. *Note: Database seeding is automated on startup. Default user authentication credentials will be active in the system.*

---

### Step 2: Spin Up the Frontend Interface

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd pos-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:3000`**

---

### 🔑 Demo Logins

Use the following default maid credentials to log in and start testing the POS flow:

* **Admin Access:**
  * **Email:** `admin@nekobite.com`
  * **Password:** `admin123`
* **Staff Access:**
  * **Email:** `yuna@nekobite.com`
  * **Password:** `1111`
* **Chef Access:**
  * **Email:** `chef@nekobite.com`
  * **Password:** `5555`
