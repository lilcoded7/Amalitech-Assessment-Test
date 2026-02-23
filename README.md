
---

# SecureVault-Dashboard

🚀 **Live Demo**
[https://amalitech-assessment-test-secur-vau.vercel.app/accounts/login](https://amalitech-assessment-test-secur-vau.vercel.app/accounts/login)

login: admin@gmail.com
password: thethethe

🔗 **Backend Repository**
[https://github.com/lilcoded7/amalithech-sure-cure-vault-test](https://github.com/lilcoded7/amalithech-sure-cure-vault-test)

---

## 📌 Project Overview

**SecureVault-Dashboard** was built for *SecureVault Inc. (Enterprise Cloud Security)* as part of the Amalitech Assessment Test.

The objective was to design and implement a modern, high-performance **File Explorer Dashboard** capable of handling deeply nested folder structures while maintaining performance, usability, and accessibility.

Although this was primarily a frontend challenge, I implemented a microservices-style architecture:

* **Frontend:** Next.js + TypeScript
* **Backend API:** Django (REST API)
* **Deployment:** Vercel

The frontend communicates with the Django backend via secure API endpoints.

---

### Design System Includes:

* Typography scale
* Color palette (Dark Mode)
* Spacing grid
* Component states (hover, active, focus, selected)

### 🔗 Design File

(Add your Figma link here)

### 🖼️ Design Preview

![Figma Export 1](https://raw.githubusercontent.com/lilcoded7/Amalitech-Assessment-Test/dbb90d2615a56b2de82575c5438d6459d9a927d9/IMG_4379.jpeg)
![Figma Export 2](https://raw.githubusercontent.com/lilcoded7/Amalitech-Assessment-Test/dbb90d2615a56b2de82575c5438d6459d9a927d9/IMG_4380.png)
![Figma Export 3](https://raw.githubusercontent.com/lilcoded7/Amalitech-Assessment-Test/dbb90d2615a56b2de82575c5438d6459d9a927d9/IMG_4381.png)
![Figma Export 4](https://raw.githubusercontent.com/lilcoded7/Amalitech-Assessment-Test/dbb90d2615a56b2de82575c5438d6459d9a927d9/IMG_6827.jpeg)
![Figma Export 5](https://raw.githubusercontent.com/lilcoded7/Amalitech-Assessment-Test/dbb90d2615a56b2de82575c5438d6459d9a927d9/IMG_6828.jpeg)


---

## 🏗️ Phase 2 – Implementation

### 1️⃣ Recursive File Explorer

* Renders folder structure dynamically from JSON/API data
* Fully recursive component architecture
* Supports unlimited nesting depth
* Expand/Collapse without page reload

### 2️⃣ File Details Panel

* Click to select file
* Displays metadata (Name, Type, Size)
* Distinct visual selection state

### 3️⃣ Keyboard Accessibility

* ↑ / ↓ → Navigate visible items
* → Expand folder
* ← Collapse folder
* Enter → Select file

---

## ⭐ Wildcard Feature – Innovation Clause

**Feature Implemented:**
(Add your custom feature here)

**Business Value:**
Briefly explain how it improves user experience, scalability, or enterprise workflow efficiency.

---

## 🧠 Recursive Strategy

The file explorer is built using a recursive component pattern.

Each folder component:

* Receives its own children
* Calls itself for nested folders
* Maintains local expansion state
* Propagates selection state upward when required

This ensures:

* Clean abstraction
* Infinite depth handling
* Efficient rendering
* Maintainable component structure

---

## 📦 Getting Started

### Clone the Repository

```bash
git clone https://github.com/lilcoded7/Amalitech-Assessment-Test.git
cd Amalitech-Assessment-Test
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

⚠️ Ensure the Django backend server is running for full functionality.

---

## 🛠 Tech Stack

* Next.js
* TypeScript
* Custom CSS (No UI Component Libraries)
* Django REST API

---

## 👨‍💻 Author

Developed as part of the Amalitech Assessment Test – SecureVault Challenge.

---

