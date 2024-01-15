import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "tailwindcss/tailwind.css";

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modelOutput, setModelOutput] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: uuidv4(),
    name: "",
    mobileNumber: "",
    email: "",
    position: "",
    message: "",
    image: null,
  });

  // Define handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Update the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataWithFile = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithFile.append(key, value);
      });

      if (selectedFile) {
        formDataWithFile.append("file", selectedFile);
      }

      const response = await axios.post(
        "http://localhost:5000/submit-form",
        formDataWithFile
      );

      if (response.status !== 200) {
        console.error(
          `Form submission failed with status ${response.status}: ${response.data}`
        );
        throw new Error(
          `Form submission failed with status ${response.status}`
        );
      }

      console.log("Form submitted successfully");
      alert("Form submitted");

      // Clear the form data and selected file
      setFormData({
        id: uuidv4(),
        name: "",
        mobileNumber: "",
        email: "",
        position: "",
        message: "",
        file: null,
      });

      setSelectedFile(null);
      setSelectedImage(null); // Add this line to clear the selected image

      setModelOutput(null);
      setError(null);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setError("Error submitting form. Please try again.");
    }
  };

  const isLoggedIn = !!localStorage.getItem("userEmail");

  if (!isLoggedIn) {
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
            <option value="Online">Online</option>
            <option value="Harassment">Harassment</option>
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

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image
          </label>
          <input
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            type="file"
            name="image"
            onChange={handleFileChange}
          />
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
    </div>
  );
};

export default Form;
