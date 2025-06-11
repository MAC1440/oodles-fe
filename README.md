# 💻 IT Device Onboarding Dashboard

A [Next.js](https://nextjs.org) web application that helps IT teams manage employee onboarding and assign devices intelligently based on job roles and locations.

## Deployed on Vercel

[https://oodles-fe.vercel.app/](https://oodles-fe.vercel.app/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MAC1440/oodles-fe.git
cd oodles-fe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to use the app.

---

## 📁 Project Structure

```
/app                    # App Router (Next.js 15.3.3)
/components             # Reusable UI components (Tables, Charts, Modals)
/redux                  # RTK Query services and state slices
/pages/api              # API routes (for testing on local machines)
/types                  # Separate TypeScript types
```

---

## 🧠 Device Recommendation Logic

1. Checking the Availability of the device First. If employee is onboarded, the device is assigned to the new employee and the assigned device would have its status changed.
2. After Availability check, we move on to selected role and filter the available devices according to ram or screen sizes.

---

## 📊 Dashboard Overview

The dashboard displays:
- **Device Overview:** Pie chart showing available vs. assigned devices.
- **Employee Growth:** Bar chart (daily, weekly, monthly) showing newly joined employees.
- **Quick Access CTA:** Button to onboard employees (navigates to `/employees`).

---

## ✅ Features

- 🔄 Real-time device and employee statistics
- 🧠 Smart device assignment logic
- 🧾 Employee onboarding modal with form validation
- 🔍 Device listing with search/filter and availability status
- 📊 Responsive charts via Recharts
- 🧩 Modular components (Table, Modal, Tooltip)

---

## 📌 Assumptions Made

- All devices have unique models (Selection is based on device models).
- Locations are fixed and cannot be changed
- Device assignment status is reliable from the backend.
- All Details of devices that are assigned to be linked to the assignee.
- Assigned devices would hold the assignee data
- Create module for adding new devices.
- `createdAt` is a reliable timestamp for employee onboarding.

---

## 🔧 What I'd Improve With More Time

Example:
- Implement role-based authentication (admin vs. IT user).
- Add grouping of devices with same models and differentiate them based on unique id / serial number
- Add a dashboard for admin to manage devices and employees
- Add backend and frontend for device unassignment and re-assignment when employee leaves the company
- Create complete cruds for devices and employees
- Add Images for devices
- Add dual view support for devices (table + cards)
- Add pagination and sorting to tables.

---

## 📦 Tech Stack

- **Next.js 15+ (App Router)**
- **React 18**
- **Tailwind CSS**
- **Redux Toolkit + RTK Query**
- **Recharts** for charting
- **TypeScript**

---
