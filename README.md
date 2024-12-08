
# Daily Diet 🍽️

Welcome to the **Daily Diet** application! This project enables users to track their meals, categorize them as inside or outside the diet, and retrieve insightful metrics for better dietary planning.

---

## 🚀 Features

- **CRUD Operations for Meals**  
  Easily create, view, update, and delete meals.

- **Diet Classification**  
  Tag meals as:
  - Inside diet (`yes`)
  - Outside diet (`no`)

- **Metrics Dashboard**  
  - Total meals count.
  - Meals categorized by diet type.
  - Longest streak of meals within the diet.

- **Date and Time Validation**  
  - ISO 8601 compliant date handling.
  - Time format validation (`HH:mm:ss`).

---

## 🛠️ Technologies

- **Node.js**  
  Backend built with modern JavaScript standards.
  
- **Fastify**  
  Fast and low overhead web framework, for Node.js.
  
- **Knex.js**  
  SQL query builder used for database interaction.

- **Zod**  
  Schema validation for robust request handling.

---

## 📂 Project Structure

```
📂 /src
├── 📂 middlewares
│      └── check-user-id-exists.ts    # Middleware to validate if the user ID exists in requests
├── 📂 routes
│      └── 📄 meals.ts                # Route definitions for meal-related endpoints
├── 📂 env
│      └── 📄 index.ts                # Environment variable configuration and management
├── 📂 @types
│      └── 📄 knex.d.ts               # Custom TypeScript definitions for Knex.js
├── 📄 server.ts                      # Entry point to start the server
├── 📄 database.ts                    # Database configuration and connection setup
└── 📄 app.ts                         # Main application file; sets up middlewares and routes

```

---

## 📖 API Documentation

### Base URL
`http://localhost:3334`

### Endpoints

#### 1. **Create a Meal**  
`POST /meals`  
**Request Body:**
```json
{
  "name": "Grilled Chicken",
  "description": "Healthy and delicious",
  "date": "2024-12-02",
  "hour": "12:30:00",
  "diet": "yes"
}
```
**Response:**
- `201 Created`

#### 2. **Get Metrics**  
`GET /metrics`  
**Response:**
```json
{
  "totalMeals": 15,
  "insideMeals": 10,
  "outsideMeals": 5,
  "bestDietSequence": 5
}
```

---

## 🧪 Running Tests

We use **Vitest** for unit and integration tests. To run the tests, execute:
```bash
npm test
```

---

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or newer)
- PostgreSQL

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/DevAnseSenior/daily-diet.git
   cd daily-diet
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the database:
   - Create a `.env` file and add your database credentials:
     ```
     DATABASE_URL=your-database-url
     ```
   - Run migrations:
     ```bash
     npm run migrate
     ```
4. Start the server:
   ```bash
   npm start
   ```

---

## 🗺️ Roadmap

- [ ] Add user authentication.
- [ ] Implement meal sharing between users.
- [ ] Enhance metrics with visualizations.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [DevAnseSenior](https://github.com/DevAnseSenior)
- **Linked**: [Anderson Coelho](https://www.linkedin.com/in/devanse)

---
