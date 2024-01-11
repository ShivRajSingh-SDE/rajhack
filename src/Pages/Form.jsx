import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const Form = () => {
  const [modelOutput, setModelOutput] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    position: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send any necessary authorization token
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(
          `Form submission failed with status ${response.status}: ${errorMessage}`
        );
        throw new Error(
          `Form submission failed with status ${response.status}`
        );
      }

      console.log("Form submitted successfully");
      alert("Form submitted");

      // Reset the form data
      setFormData({
        name: "",
        mobileNumber: "",
        email: "",
        position: "",
        message: "",
      });

      setModelOutput(null);
      setError(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting form. Please try again.");
    }
  };

  const isLoggedIn = !!localStorage.getItem("userEmail");

  if (!isLoggedIn) {
    // If the user is not logged in, render a login button or redirect to the login page
    return (
      <div className="container mx-auto mt-8 my-5">
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 my-5">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-[#ffffffc0] border drop-shadow-2xl shadow-2xl p-8 shadow-md rounded-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="mobileNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="position"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Crime Type
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Position</option>
            <option value="sde">Online</option>
            <option value="fullStack">Harassment </option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Report
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full border rounded-md py-6 px-3 focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>

        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          >
            Submit
          </button>
        </div>
      </form>

      {modelOutput !== null && (
        <div className="model mt-8">
          <h2 className="text-xl font-bold mb-4">Sentiment:</h2>
          <p className={`bg-gray-100 p-4 rounded-md ${modelOutput}`}>
            {modelOutput}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
