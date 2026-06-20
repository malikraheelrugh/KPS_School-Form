const express = require("express");
const cors = require("cors");
const { createStudent, getAllStudents, deleteStudent } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

  if (data.phone_number && !/^[0-9+\-\s]{7,15}$/.test(data.phone_number.trim())) {
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
    const trimmedData = {
      student_name: data.student_name.trim(),
      father_name: data.father_name.trim(),
      registration_number: data.registration_number.trim(),
      class: data.class.trim(),
      phone_number: data.phone_number.trim(),
    };

    const newStudent = createStudent(trimmedData);
    return res.status(201).json({ success: true, student: newStudent });
  } catch (err) {
    if (err.message && err.message.includes("UNIQUE")) {
      return res.status(400).json({
        success: false,
        errors: { registration_number: "This registration number already exists" },
      });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/students", (req, res) => {
  const students = getAllStudents();
  res.json({ success: true, students });
});

app.delete("/api/students/:id", (req, res) => {
  const deleted = deleteStudent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
