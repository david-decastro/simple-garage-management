# 🚗 Simple Garage Management

A full-stack application to manage the maintenance of your personal vehicles — whether you perform repairs at home or take your car to an external mechanic. Keep track of services, replacement parts, expenses, and invoices in one place.

> **Note:** This project has been used as a learning tool to learn and improve my ReactJS skills, as well as to serve a personal purpose at home. Any feedback aimed at improving the code quality is very welcome!

## 🛠 Features

- Register multiple vehicles.
- Log maintenance records: date, mileage, services performed.
- Add parts used during each maintenance session.
- Upload and store invoices from external workshops.
- Track costs and service history over time.
- Personal or professional (workshop) usage.

## ⚙️ Tech Stack

- **Frontend**: ReactJS (with Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Dockerized**: Docker & docker-compose

---

## 🚀 Getting Started

You can run the app locally using either **npm** or **Docker**.

### 🔧 Option 1: Local development (Node + Vite)

Make sure you have Node.js and MongoDB installed.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/david-decastro/simple-garage-management.git
   cd simple-garage-management


## How to run?

```bash
npm install
npm run dev
```

2. **Install dependencies for client and server:**

```bash
cd client
npm install

cd ../server
npm install
```

3. **Start MongoDB** (locally or using Docker if preferred)

4. **Run the app in development mode:**

In two terminals:

```bash
# Terminal 1: start the backend
cd server
npm run dev

# Terminal 2: start the frontend
cd client
npm run dev
```

### 🐳 Option 2: Run with Docker

If you prefer using Docker, make sure Docker and Docker Compose are installed.

1. **Clone the repository and run:**

```bash
docker-compose up --build
```

2. The frontend will be available at http://localhost:8080
   The backend API will run at http://localhost:5000

## 📁 Project structure

```bash
simple-garage-maintanance/
│
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
├── deployment/      # Docker files to deploy the app
└── README.md
```

## 📜 License

This project is licensed for personal, non-commercial use only.
See the LICENSE.md file for details.

## 📫 Contact

For questions or commercial inquiries, contact: [email](david.devcastro@gmail.com)