# Project Index & File Structure

This file provides a map of the repository's directory layout and key file responsibilities. Read this file before performing operations to reduce search and grep overhead.

## Directory Map

### Next.js App Router (`app/`)
* **[app/layout.tsx](./app/layout.tsx)** - Root application layout, wraps children in `PosProvider` and `Shell`.
* **[app/page.tsx](./app/page.tsx)** - Home / Welcome page segment, renders `WelcomeClient`.
* **[app/not-found.tsx](./app/not-found.tsx)** - Global anime-themed 404 page segment.
* **[app/globals.css](./app/globals.css)** - Global CSS styles and Tailwind styles.

#### Analytics Route Segments (`app/analytics/`)
Refactored using Next.js Parallel Routes as components.
* **[app/analytics/layout.tsx](./app/analytics/layout.tsx)** - Renders layout combining the default children and parallel route slots.
* **[app/analytics/page.tsx](./app/analytics/page.tsx)** - Default children slot. Renders the main analytics header.
* **[app/analytics/default.tsx](./app/analytics/default.tsx)** - Fallback for root page segment.
* **[app/analytics/loading.tsx](./app/analytics/loading.tsx)** - Loading skeleton for the core page template.
* **[app/analytics/error.tsx](./app/analytics/error.tsx)** - Error boundary fallback UI for the core page template.
* **`@metrics` Slot:**
  * **[app/analytics/@metrics/MetricsComponent.tsx](./app/analytics/@metrics/MetricsComponent.tsx)** - Metric cards UI.
  * **[app/analytics/@metrics/page.tsx](./app/analytics/@metrics/page.tsx)** - Slot entrypoint.
  * **[app/analytics/@metrics/default.tsx](./app/analytics/@metrics/default.tsx)** - Slot fallback.
  * **[app/analytics/@metrics/loading.tsx](./app/analytics/@metrics/loading.tsx)** - Skeleton loading slot placeholder (delegates to `components/ui/LoadingSkeleton`).
  * **[app/analytics/@metrics/error.tsx](./app/analytics/@metrics/error.tsx)** - Error boundary card fallback (delegates to `components/ui/ErrorCard`).
* **`@categoryShare` Slot:**
  * **[app/analytics/@categoryShare/CategoryShareComponent.tsx](./app/analytics/@categoryShare/CategoryShareComponent.tsx)** - Motion-animated category share progress bars.
  * **[app/analytics/@categoryShare/page.tsx](./app/analytics/@categoryShare/page.tsx)** - Slot entrypoint.
  * **[app/analytics/@categoryShare/default.tsx](./app/analytics/@categoryShare/default.tsx)** - Slot fallback.
  * **[app/analytics/@categoryShare/loading.tsx](./app/analytics/@categoryShare/loading.tsx)** - Skeleton loading slot placeholder (delegates to `components/ui/LoadingSkeleton`).
  * **[app/analytics/@categoryShare/error.tsx](./app/analytics/@categoryShare/error.tsx)** - Error boundary card fallback (delegates to `components/ui/ErrorCard`).
* **`@leaderboard` Slot:**
  * **[app/analytics/@leaderboard/LeaderboardComponent.tsx](./app/analytics/@leaderboard/LeaderboardComponent.tsx)** - Maid performance statistics dashboard.
  * **[app/analytics/@leaderboard/page.tsx](./app/analytics/@leaderboard/page.tsx)** - Slot entrypoint.
  * **[app/analytics/@leaderboard/default.tsx](./app/analytics/@leaderboard/default.tsx)** - Slot fallback.
  * **[app/analytics/@leaderboard/loading.tsx](./app/analytics/@leaderboard/loading.tsx)** - Skeleton loading slot placeholder (delegates to `components/ui/LoadingSkeleton`).
  * **[app/analytics/@leaderboard/error.tsx](./app/analytics/@leaderboard/error.tsx)** - Error boundary card fallback (delegates to `components/ui/ErrorCard`).

#### POS Route Segment (`app/pos/`)
* **[app/pos/page.tsx](./app/pos/page.tsx)** - POS workspace page.

#### Tables Route Segment (`app/tables/`)
* **[app/tables/page.tsx](./app/tables/page.tsx)** - Tables status and billing overview page.

#### History Route Segment (`app/history/`)
* **[app/history/page.tsx](./app/history/page.tsx)** - Order History list.

#### Stock Route Segment (`app/stock/`)
* **[app/stock/page.tsx](./app/stock/page.tsx)** - Stock management page.
* **[app/stock/[id]/page.tsx](./app/stock/[id]/page.tsx)** - Product details view/edit and create page.

---

### Components (`components/`)
* **`components/ui/`** - Reusable design system tokens and skeleton indicators.
  * **[components/ui/DatePicker.tsx](./components/ui/DatePicker.tsx)** - Custom themed anime-style calendar/date picker.
  * **[components/ui/ConfirmModal.tsx](components/ui/modal/ConfirmModal.tsx)** - Reusable themed cyber-anime confirm/alert dialog modal.
  * **[components/ui/ErrorCard.tsx](components/ui/error/ErrorCard.tsx)** - Reusable anime/cyber style card error boundary layout.
  * **[components/ui/LoadingSkeleton.tsx](./components/ui/LoadingSkeleton.tsx)** - Standardized loading skeleton types.
  * **[components/ui/ReceiptModal.tsx](components/ui/modal/ReceiptModal.tsx)** - Shared printer-friendly thermal receipt drawer modal.
  * **[components/ui/ScrollArea.tsx](./components/ui/ScrollArea.tsx)** - Reusable themed anime-style custom scroll container.
  * **[components/ui/CategoryBar.tsx](./components/ui/CategoryBar.tsx)** - Shared category selection pill list.
  * **[components/ui/ProductImageOrEmoji.tsx](./components/ui/ProductImageOrEmoji.tsx)** - Reusable helper component to render product image or fallback to emoji.
  * **[components/ui/DeleteProductConfirmModal.tsx](components/ui/modal/DeleteProductConfirmModal.tsx)** - Reusable product deletion confirmation dialog wrapping ConfirmModal.
* **`components/layout/`** - Shell layout and Navigation/Sidebar.
  * **[components/layout/Shell.tsx](./components/layout/Shell.tsx)** - Main application wrapper.
  * **[components/layout/Sidebar.tsx](./components/layout/Sidebar.tsx)** - Sidebar layout container.
  * **[components/layout/LoginPage.tsx](./components/layout/LoginPage.tsx)** - Cashier login and authorization page.
  * **[components/layout/ThemeProvider.tsx](./components/layout/ThemeProvider.tsx)** - Themed client-side provider wrapper utilizing next-themes.
  * **`components/layout/sidebar/`**
    * **[components/layout/sidebar/SidebarNav.tsx](./components/layout/sidebar/SidebarNav.tsx)** - Links for main routes.
    * **[components/layout/sidebar/SidebarThemeSelector.tsx](./components/layout/sidebar/SidebarThemeSelector.tsx)** - Cyber/Maid theme changer.
    * **[components/layout/sidebar/SidebarFooter.tsx](./components/layout/sidebar/SidebarFooter.tsx)** - Dynamic sound and cashier logs manager.
* **`components/pos/`** - Point of Sale workspace views.
  * **[components/pos/PosClient.tsx](app/pos/PosClient.tsx)** - Grid of menu items and category filters.
  * **[components/pos/CartPanel.tsx](./components/pos/CartPanel.tsx)** - Sidebar shopping cart logic.
  * **`components/pos/cart/`**
    * **[components/pos/cart/CartItemCard.tsx](./components/pos/cart/CartItemCard.tsx)** - Item row.
    * **[components/pos/cart/CheckoutModal.tsx](./components/pos/cart/CheckoutModal.tsx)** - Modal for checkout and processing.
* **`components/history/`**
  * **[components/history/HistoryClient.tsx](app/history/HistoryClient.tsx)** - Order history log viewer.
* **`components/welcome/`**
  * **[components/welcome/WelcomeClient.tsx](app/WelcomeClient.tsx)** - Animated home dashboard welcome widget.
* **`components/tables/`**
  * **[components/tables/TablesClient.tsx](./components/tables/TablesClient.tsx)** - Tables status and billing workflow container.
  * **[components/tables/TableCard.tsx](./components/tables/TableCard.tsx)** - Single table status card.
  * **[components/tables/TableDetailsDrawer.tsx](./components/tables/TableDetailsDrawer.tsx)** - Drawer component showing sub-orders and bill total for a selected table.
* **`components/stock/`**
  * **[components/stock/StockClient.tsx](./components/stock/StockClient.tsx)** - State orchestrator; renders StockHeader, StockFilter, and StockTable.
  * **[components/stock/StockTable.tsx](components/stock/table/StockTable.tsx)** - Main scrollable products table layout.
  * **`components/stock/detail/`** - Product details view and edit/create form.
    * **[components/stock/detail/ProductDetailClient.tsx](./components/stock/detail/ProductDetailClient.tsx)** - Form orchestrator for editing or creating a product catalog entry.
  * **`components/stock/header/`** - Title bar, stats, changes bar, and confirm modal.
    * **[components/stock/header/StockHeader.tsx](./components/stock/header/StockHeader.tsx)** - Accumulator: title bar, stats cards, changes bar, confirm modal.
    * **[components/stock/header/StockStats.tsx](./components/stock/header/StockStats.tsx)** - Summary metric cards (total, low stock, out of stock).
    * **[components/stock/header/StockChangesBar.tsx](./components/stock/header/StockChangesBar.tsx)** - Floating save/discard bar for unsaved modifications.
  * **`components/stock/filter/`** - Filter inputs and category selector.
    * **[components/stock/filter/StockFilter.tsx](./components/stock/filter/StockFilter.tsx)** - Accumulator: composes StockFilters and the shared CategoryBar.
    * **[components/stock/filter/StockFilters.tsx](./components/stock/filter/StockFilters.tsx)** - Search and range input controls with Apply/Reset buttons.
  * **`components/stock/table/`** - Table sub-components.
    * **[components/stock/table/StockTableHeader.tsx](./components/stock/table/StockTableHeader.tsx)** - Sticky column headers.
    * **[components/stock/table/StockTableRow.tsx](./components/stock/table/StockTableRow.tsx)** - Interactive product row with stock controls and presets.
    * **[components/stock/table/StockTablePagination.tsx](./components/stock/table/StockTablePagination.tsx)** - Page navigation and page-size selector.




---

### Shared Configuration, Core Types & API Services
* **[constants/index.ts](./constants/index.ts)** - Theme variables, initial menu items list.
* **[types/index.ts](./types/index.ts)** - TypeScript interfaces for Product, CartItem, and Order.
* **[types/api.ts](./types/api.ts)** - TypeScript interfaces for API requests, responses, and DTO structures.
* **[services/api.ts](./services/api.ts)** - Base Axios client configuration with request interceptor for JWT authentication.
* **[services/api-auth.ts](./services/api-auth.ts)** - Cashier authentication and login endpoint API.
* **[services/auth.ts](utils/auth.ts)** - Server-only authentication verification helper for server components.
* **[services/api-products.ts](./services/api-products.ts)** - Menu products fetching and stock updates API.
* **[services/api-orders.ts](./services/api-orders.ts)** - Order placement, historical orders list, and table settlement API.
* **[services/api-tables.ts](./services/api-tables.ts)** - Cafe table configuration, fetch active table status, and add/delete tables API.
* **[.env.local](./.env.local)** - Frontend environment configuration containing backend endpoint URL.
