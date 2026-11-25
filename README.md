# Restaurant-Admin

A modern, responsive, frontend-only Restaurant Administration and Operations dashboard built with React 18, Vite, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, Path Aliases `@/*`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Navigation**: [React Router DOM v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📁 Project Architecture & Folder Structure

```
Restaurant-Admin/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── assets/              # Static assets, SVG icons, and graphics
│   ├── components/
│   │   ├── common/          # Shared components (LoadingSpinner, EmptyState)
│   │   ├── layout/          # Layout-level components (Header, Sidebar)
│   │   └── ui/              # Reusable UI primitives (Button, Card, Badge, StatsCard)
│   ├── constants/           # Global application constants, status maps, navigation items
│   ├── data/                # Static JSON data files (dashboardData.json)
│   ├── hooks/               # Custom hooks (useDashboardData)
│   ├── layouts/             # Layout templates (AdminLayout)
│   ├── pages/               # Application views (DashboardPage, NotFoundPage)
│   ├── routes/              # Routing configuration (AppRoutes)
│   ├── types/               # TypeScript interfaces & types
│   ├── utils/               # Helper utilities (cn, formatters)
│   ├── App.tsx              # Root component with Toast and Router providers
│   ├── main.tsx             # DOM mounting entry point
│   └── index.css            # Tailwind directives and global typography
```

---

## 📌 Architectural Guidelines & Principles

1. **Frontend-Only**: All current and future application state & data is loaded from static JSON files in `src/data/`.
2. **No Backend / External APIs**: No server, API clients, or database drivers are configured.
3. **Strict Typing**: All data structures, props, and status variants are strictly typed with TypeScript.
4. **Modularity**: Components follow clean separation between UI primitives, layout structures, and business views.

---

## 🛠️ Getting Started

### 1. Installation

Navigate into the project directory and install all dependencies:

```bash
cd Restaurant-Admin
npm install
```

### 2. Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at: `http://localhost:3000`

### 3. Production Build

Verify TypeScript compilation and generate the optimized production bundle:

```bash
npm run build
```

The build artifacts will be created in the `dist/` directory.

### 4. Preview Production Build

Preview the generated production build locally:

```bash
npm run preview
```

---

## 📊 Static Data Management

All data for the dashboard is located in:
- `src/data/dashboardData.json`

To customize metrics, orders, or menu items, update the corresponding JSON properties. The `useDashboardData` hook (`src/hooks/useDashboardData.ts`) provides typed access to this static data.
