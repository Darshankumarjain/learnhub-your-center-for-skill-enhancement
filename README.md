# 🎓 LearnHub — Your Center for Skill Enhancement

A full-stack web platform where students can enroll in courses, track progress, and earn certificates — and teachers can create and manage their own courses.

---

## 🚀 Live Demo

🔗 [https://learnhub-backend-extr.onrender.com](https://learnhub-backend-extr.onrender.com)

---

## 🖼️ Screenshots

**Home Page**
![Home Page 1](https://github.com/user-attachments/assets/45978365-fddc-4420-b144-5a39dea5b66b)

![Home Page 2](https://github.com/user-attachments/assets/9eaa82d6-f96b-4a65-922a-4e23bc122646)

**Register Page**
![Register](https://github.com/user-attachments/assets/8e086848-925e-48f7-a82d-e726905167f9)

**Login Page**
![Login](https://github.com/user-attachments/assets/35dff586-81e6-45dd-af67-c8941da4b199)

**Teacher Home / UI**
![Teacher Home](https://github.com/user-attachments/assets/9ea2904c-5bdf-40ed-9d03-571980f68353)

**Teacher Dashboard — Create Course**
![Teacher Dashboard](https://github.com/user-attachments/assets/17cb15a2-0e22-4c0d-8c33-3d12ce8f1292)

**Student Dashboard**
![Student Dashboard](https://github.com/user-attachments/assets/f3f08eb9-faee-45b5-b89a-853c8194b341)

**Payment Page**
![Payment](https://github.com/user-attachments/assets/1045adf3-95aa-41ee-98fb-12f3455b0b05)

**Student Enrolled Courses**
![Enrolled Courses](https://github.com/user-attachments/assets/18b9fb0d-e930-412c-9601-a6a23987cf78)

**Student Course Progress**
![Course Progress](https://github.com/user-attachments/assets/70b9186d-c831-4a73-a26e-797a25ff88ac)

**Student Certificate**
![Certificate](https://github.com/user-attachments/assets/761ab73a-8bfb-4f30-9eb6-11c2f4d27410)

---

## 📌 Features

- Browse and search courses by category
- Separate roles for Students and Teachers
- Teachers can create and manage their own courses
- Students can enroll, track progress, and earn certificates
- Payment integration for course purchases
- Fully responsive UI

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React (Vite), CSS                  |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB                            |
| Deployment | Render (Backend + Static Frontend) |

---

## 📁 Project Structure

```
learnhub/
├── Project Files/
│   ├── frontend/        # React app (Vite)
│   └── backend/         # Node.js + Express server
├── Document/            # Project documentation
├── Video/               # Demo walkthrough
├── render.yaml          # Render deployment config
└── README.md
```

---

## ⚙️ Getting Started Locally

### Prerequisites

- Node.js (v18+)
- MongoDB connection (local or Atlas)

### Backend

```bash
git clone https://github.com/Darshankumarjain/learnhub-your-center-for-skill-enhancement.git
cd learnhub-your-center-for-skill-enhancement/Project\ Files/backend

npm install
npm start        # runs: node server.js
```

Server starts at `http://localhost:5000`

### Frontend

```bash
cd ../frontend

npm install
npm run build    # runs: vite build → outputs to /dist
```

Open `dist/index.html` in a browser, or serve it with any static file server.

---

## ☁️ Deployment (Render)

| Service  | Type        | Config                                                    |
|----------|-------------|-----------------------------------------------------------|
| Backend  | Web Service | Build: `npm install` · Start: `npm start`                 |
| Frontend | Static Site | Build: `npm install && npm run build` · Publish: `dist`   |

