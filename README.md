# 📄 ContractFlow

ContractFlow is a sleek, modern, and efficient web application designed to help you manage your contracts, subscriptions, and recurring expenses. Keep track of costs, upcoming renewals, and documents all in one place.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)

## ✨ Features

- **📊 Dashboard Analytics**: Overview of monthly/yearly costs and upcoming renewals.
- **📝 Contract Management**: Full CRUD operations for all your contracts and subscriptions.
- **🔔 Renewal Alerts**: Status indicators for active, cancelled, or expiring contracts.
- **📁 Document Management**: Keep track of contract documents and notes.
- **🌓 Dark Mode**: Built-in dark and light mode support using Shadcn UI.
- **🐳 Dockerized**: Easy deployment using multi-stage Docker builds.
- **🔐 Secure**: JWT-based authentication and secure password hashing.

## 🚀 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Database**: [MySQL](https://www.mysql.com/) with `mysql2` (Raw SQL for performance)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth**: `jose` (JWT) & `bcryptjs`

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or Docker
- MySQL Database

### Environment Setup

Create a `.env` file in the root directory:

```dotenv
DATABASE_URL=mysql://user:password@host:port/database
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_secret_key
NEXT_PUBLIC_APP_NAME=ContractFlow
```

### Option 1: Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
docker-compose up -d
```

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   Run the schema provided in `setup.sql` on your MySQL instance.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `/app`: Next.js App Router (Pages & API Routes)
- `/components`: Reusable UI components (Shadcn UI)
- `/lib`: Utility functions and database configuration
- `/prisma`: (Legacy) Database schema references
- `/public`: Static assets

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Your Name/Github Handle]
