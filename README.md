# Student Registration Form

Full-stack student registration app: React + Tailwind CSS frontend, Node.js + Express backend, SQLite database. No TypeScript — plain JavaScript only.

## Fields

Each field is required and has its own label:

1. Student's Name
2. Father's Name
3. Registration Number (must be unique)
4. Class
5. Phone Number

Validation happens both in the browser (instant feedback, blocks submission if any field is empty) and on the server (rejects incomplete or invalid data even if someone bypasses the frontend).

## Project structure

```
student-form-app/
├── backend/
│   ├── server.js       # Express app + API routes
│   ├── db.js            # SQLite connection + table setup
│   ├── package.json
│   └── students.db      # created automatically on first run
└── frontend/
    ├── src/
    │   ├── App.jsx       # the form
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

## 1. Run the backend

```bash
cd backend
npm install
npm start
```

The API starts on **http://localhost:5000**. A `students.db` SQLite file is created automatically in the `backend` folder the first time you run it — no separate database installation needed.

API endpoints:
- `POST /api/students` — create a student (validates all 5 fields)
- `GET /api/students` — list all registered students
- `DELETE /api/students/:id` — remove a student

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. Submitting the form sends the data to the backend, which validates it and stores it in SQLite.

## Notes

- If you'd rather use MySQL/PostgreSQL/MongoDB instead of SQLite, only `backend/db.js` needs to change — the rest of the code (routes, validation, frontend) stays the same.
- CORS is enabled on the backend so the Vite dev server (port 5173) can call the API (port 5000) during development.
