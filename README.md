# MUC Database Dashboard

A modern web application for managing suppliers, orders, and parts with budget forecasting and data visualization capabilities.

## Features

- **Dashboard**: Overview of orders, suppliers, and parts with key metrics
- **Data Viewer**: Searchable tables for orders, parts, and suppliers
- **Budget Projection**: Monthly and annual budget forecasting
- **Annual Expenses**: Historical expense tracking and analysis
- **Add Supplier**: Form-based supplier management with validation
- **Charts & Visualizations**: AG Charts for data visualization
- **Real-time Search**: Fast search across large datasets using Fuse.js

## Tech Stack

- **Framework**: Next.js 16.2 with TypeScript
- **UI Library**: Mantine 9.0
- **Database**: MySQL 2.0
- **Data Grid**: AG Grid Community
- **Charts**: AG Charts Community
- **Icons**: Phosphor Icons
- **Form Validation**: Zod
- **Styling**: PostCSS with Mantine theme

## Getting Started

### Prerequisites

- Bun
- MySQL database

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd csci-3461-project
```

2. Install dependencies

```bash
bun install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Start the development server

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun format` - Format code with Prettier
- `bun typecheck` - Check TypeScript types

## Project Structure

```
app/
├── page.tsx                     # Main dashboard
├── layout.tsx                   # Root layout
├── add-supplier/               # Supplier management
├── annual-expenses/            # Expense analysis
├── budget-projection/          # Budget forecasting
└── data-viewer/               # Data table views
components/
├── AgGridClientProvider        # Grid setup
├── SearchableTable            # Searchable data tables
├── StatCard                   # Statistics display
└── ChartWithTableLayout       # Chart layouts
data/
├── db.ts                      # Database queries
└── types.ts                   # TypeScript types
```

## Database Setup

Run the provided SQL scripts to initialize the database:

```bash
mysql -u root -p < scripts/make_tables.sql
bash scripts/j2sql_supp+order.sh > data.sql
mysql -u root -p < data.sql
```

## Development

### Type Checking

```bash
bun typecheck
```

### Code Formatting

```bash
bun format
```

### Documentation

- [Mantine Documentation](https://mantine.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [AG Grid Documentation](https://www.ag-grid.com/documentation)

## License

This project is part of CSCI 3461 coursework.
