# Galaxy ERP - Phase 03.3C Completion Report

## Enterprise Dashboard, Workspace, Navigation, Command Center & Personalized User Experience Platform (EDWNCPUXP)

This document provides a detailed overview of the core architectural features, layout engines, role-based maps, and system integrations implemented in Phase 03.3C.

---

## 1. Core Architecture

The layout and workspace configuration is managed entirely in a modular, decoupled, and reusable architecture under `/src/pages/dashboard/` and `/src/components/dashboard/`.

### Layout Architecture Flow
```
[StoreContext] ──► [DashboardHome] ──► [WorkspaceLayout]
                           │
                           ├──► [SearchBar]
                           ├──► [WidgetContainer] (Customizer Controls)
                           └──► [DashboardGrid]
                                      │
                                      └──► [DashboardCard] (Widget Frame)
                                                │
                                                └──► Reusable Widgets
                                                     (StatCard, ChartWidget, etc.)
```

---

## 2. Dynamic Dashboard Widgets

We have created **10+ highly reusable widget cards** that dynamically adapt styles and data profiles:

1. **KPI Statistics Widget (`KPIWidget`)**: Dynamically loads role-custom stats.
2. **Dynamic Chart Widget (`ChartWidget`)**: Interactive Area, Bar, and Pie charts supporting Dark/Light/High-Contrast mode color schemas.
3. **Quick Action Shortcuts (`QuickActionCard`)**: Action buttons tailored to the specific workflows of each user role.
4. **Schedules & Timetable (`CalendarWidget`)**: Displays daily period slots, student classes, and critical deadlines.
5. **Real-time Notifications (`NotificationWidget`)**: Pulls alerts directly from global state and enables mark-read actions.
6. **Recent Activities Audit (`ActivityTimeline`)**: An ongoing timeline showing system logs, AI actions, and ERP logins.
7. **AI platform Insights (`AIInsightCard`)**: Smart recommendation presets and real-time prompt queries linked directly to `/api/ai/chat`.
8. **Universal Search Bar (`SearchBar`)**: Instant prefix search through students, teachers, books, and receipts.
9. **Localized Climate Advisory (`WeatherWidget`)**: Pulls coordinates and displays AQI guidelines for transit routes.
10. **Bookmarked Modules (`FavoriteCard`)**: Pins active modules to the top dashboard row for custom user experience.

---

## 3. Role-Based Mapping Matrix

The workspace automatically loads customized default dashboards depending on the authenticated role:

| Authenticated Role | Default Active Widgets | Priority KPI | Core Action Shortcut |
| :--- | :--- | :--- | :--- |
| **Super Admin / Owner** | KPI, Revenue, Distribution, AI Insights, Audits, Weather, Pinned Favorites | Total Registrations | Launch AI Campus Suite |
| **Principal / Director** | KPI, Attendance, Distribution, AI Insights, Audits, Alerts, Schedules | Overall Attendance Today | Scan Face ID Attendance |
| **Faculty / Teacher** | KPI, Attendance, performance, AI Insights, Alerts, Schedules | Periodic Timetable Classes | Start QR Attendance Scan |
| **Student** | KPI, performance, AI Insights, Schedules, Favorites, Weather | My Attendance Rate & GPA | Check Exam OMR Sheets |
| **Parent** | KPI, performance, AI Insights, Schedules, Favorites, Weather | Child Ingress & Pending Fees | UPI QR Fee Payment |
| **Librarian** | KPI, Audits, Alerts, Favorites | Catalog Book Inventory | Scan ISBN Book Issue |
| **Accountant** | KPI, Revenue, AI Insights, Alerts, Favorites | monthly Fee Collection | Generate UPI invoices |

---

## 4. User Personalization & Customizer Settings

By clicking **"Customize View"**, users can interactively configure:
* **Theming Mode**: Toggle Light Mode, Dark Mode, and High-Contrast Mode (fully synced with body selectors and charts).
* **Brand Accent**: Switch brand accents (Indigo, Emerald, Violet, Rose, Amber).
* **Viewport Density**: Swap spacing from **Comfortable** to **Compact** for data-dense office environments.
* **Font Sizing**: Scale text size parameter bounds (Small, Medium, Large).
* **Toggle Visibility**: Individually hide or show dashboard widget grids.
* **Layout Resetting**: Revert all preferences back to default configurations.

---

## 5. Performance, Accessibility & Verification

### Performance Optimization
* **Component Modularization**: No monoliths; code is split cleanly into lightweight files to prevent token overflows and slow re-renders.
* **Responsive Fluidity**: Adaptive layouts built using mobile-first tailwind grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-12`) ensuring perfect viewport scaling from phones to ultrawide panels.
* **Recharts Optimization**: Responsive dimensions managed via container wrapper resize handlers.

### Accessibility (WCAG AA & ARIA)
* **High Contrast Support**: Clean outlines, color codes, and high-contrast parameters prevent legibility strain.
* **Keyboard navigation**: Full inputs support, Ctrl+K hotkey, and focus outline rings on active customizer triggers.
* **ARIA labels**: Custom descriptors assigned to interactive widgets, edit toggles, and remove prompts.

---

## 6. Route Configurations

Routes are integrated virtually inside the core React router in `/src/App.tsx`:
* `/dashboard` or `/workspace`: Loads the personalized, role-specific, high-fidelity ERP homepage.
* `/command-center`: Automatically sets focus to the main dashboard and launches the universal command palette directly.
