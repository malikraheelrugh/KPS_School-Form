const express = require("express");
const cors = require("cors");
const {
  createStudent,
  getAllStudents,
  deleteStudent,
} = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow frontend requests during development.
app.use(
  cors({
    origin: process.env.Frontend_Url || "*",
  })
);
app.use(express.json());

// Required fields for the registration form.
const REQUIRED_FIELDS = [
  "student_name",
  "father_name",
  "registration_number",
  "class",
  "phone_number",
];

function validateStudent(data) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    const value = data[field];
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      errors[field] = "This field is required";
    }
  });

  if (
    data.phone_number &&
    !/^[0-9+\-\s]{7,15}$/.test(data.phone_number.trim())
  ) {
    errors.phone_number = "Enter a valid phone number";
  }

  return errors;
}

app.post("/api/students", (req, res) => {
  const data = req.body || {};
  const errors = validateStudent(data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const student = createStudent({
      student_name: data.student_name.trim(),
      father_name: data.father_name.trim(),
      registration_number: data.registration_number.trim(),
      class: data.class.trim(),
      phone_number: data.phone_number.trim(),
    });

    return res.status(201).json({ success: true, student });
  } catch (err) {
    if (err.code === "DUPLICATE") {
      return res.status(400).json({
        success: false,
        errors: {
          registration_number: "This registration number already exists",
        },
      });
    }

    console.error("Error creating student:", err.message);
    const message = err.message && (err.message.includes("EACCES") || err.message.includes("read-only"))
      ? "Database is read-only. Using a persistent database is required for production deployments."
      : "Server error";
    return res.status(500).json({ success: false, message });
  }
});

app.get("/api/students", (req, res) => {
  try {
    const students = getAllStudents();
    return res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/students/:id", (req, res) => {
  try {
    const removed = deleteStudent(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Student registration API is running" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;