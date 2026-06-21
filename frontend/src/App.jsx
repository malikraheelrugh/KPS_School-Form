import React, { useState } from "react";

const API_URL = "https://kps-school-form-backend.com/" ;

// Field definitions drive both the rendered inputs and the validation,
// so adding/removing a field only requires editing this one array.
const FIELDS = [
  {
    name: "student_name",
    label: "Student's Name",
    type: "text",
    placeholder: "e.g. Ahmed Khan",
  },
  {
    name: "father_name",
    label: "Father's Name",
    type: "text",
    placeholder: "e.g. Tariq Khan",
  },
  {
    name: "registration_number",
    label: "Registration Number",
    type: "text",
    placeholder: "e.g. REG-2026-0451",
  },
  {
    name: "class",
    label: "Class",
    type: "text",
    placeholder: "e.g. 10th Grade",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "tel",
    placeholder: "e.g. 03001234567",
  },
];

const EMPTY_FORM = FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

export default function App() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  // Validate every field is filled in (compulsory check)
  function validate(data) {
    const newErrors = {};
    FIELDS.forEach(({ name, label }) => {
      if (!data[name] || data[name].trim() === "") {
        newErrors[name] = `${label} is required`;
      }
    });

    if (
      data.phone_number &&
      data.phone_number.trim() !== "" &&
      !/^[0-9+\-\s]{7,15}$/.test(data.phone_number.trim())
    ) {
      newErrors.phone_number = "Enter a valid phone number";
    }

    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the field's error as soon as the user starts correcting it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage("");
    setServerError("");

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      setSuccessMessage("Student registered successfully.");
      setFormData(EMPTY_FORM);
    } catch (err) {
      setServerError(
        "Could not reach the server. Make sure the backend is running on port 5000."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Student Registration
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          All fields below are required.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          {FIELDS.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                className={`w-full rounded-lg border px-3 py-2 text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 ${
                  errors[name]
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-300 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
              {errors[name] && (
                <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}

          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 text-white font-medium py-2.5 transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
