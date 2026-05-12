# SmartOD – Digital On-Duty Management System

![SmartOD Status](https://img.shields.io/badge/Status-Active-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-purple)

## 📌 Problem Statement
The traditional on-duty (OD) approval process in colleges is mostly manual and paper-based. Students need to locate faculty members, collect multiple signatures, and submit forms physically to different departments. This often leads to delays, lost forms, and lack of transparency regarding approval status. The absence of a centralized system makes it difficult to track requests and manage records efficiently.

## 💡 Proposed Solution
**SmartOD (formerly SmartDuty)** introduces a comprehensive digital OD management system where students can submit OD requests through a modern web portal. The system automatically routes the request to the respective Faculty Advisor and Head of Department (HOD) for approval. 

### ✨ Key Features
- **Role-Based Dashboards**: Distinct, data-rich interfaces for Students, Faculty, and HODs.
- **Real-Time Tracking**: Visual pipeline showing the exact approval status of any OD request.
- **Automated Workflow**: Request routing happens seamlessly without manual intervention.
- **Secure Verification**: Approved requests generate a digital OD pass that is securely verifiable.
- **Modern Professional UI**: A premium, clean, glassmorphic Light Mode interface ensuring maximum professionalism, readability, and accessibility.

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT-based secure login

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or via MongoDB Atlas

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DeekshithaMariyappan/SmartOD.git
   cd SmartOD
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT and MONGO_URI
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📝 License
This project is licensed under the MIT License.
