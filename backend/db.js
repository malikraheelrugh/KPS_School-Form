const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "students.json");

function readStudents() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(dbPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeStudents(students) {
  fs.writeFileSync(dbPath, JSON.stringify(students, null, 2), "utf8");
}

function getNextId(students) {
  if (students.length === 0) return 1;
  return Math.max(...students.map((student) => student.id)) + 1;
}

function getAllStudents() {
  return readStudents();
}

function createStudent(studentData) {
  const students = readStudents();

  const duplicate = students.find(
    (student) => student.registration_number === studentData.registration_number
  );

  if (duplicate) {
    const error = new Error("UNIQUE");
    error.code = "DUPLICATE";
    throw error;
  }

  const newStudent = {
    id: getNextId(students),
    student_name: studentData.student_name,
    father_name: studentData.father_name,
    registration_number: studentData.registration_number,
    class: studentData.class,
    phone_number: studentData.phone_number,
    created_at: new Date().toISOString(),
  };

  students.unshift(newStudent);
  writeStudents(students);
  return newStudent;
}

function deleteStudent(id) {
  const students = readStudents();
  const filtered = students.filter((student) => student.id !== Number(id));

  if (filtered.length === students.length) {
    return false;
  }

  writeStudents(filtered);
  return true;
}

module.exports = {
  getAllStudents,
  createStudent,
  deleteStudent,
};
