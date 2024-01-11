const express = require("express");
const User = require("./mongo");
const cors = require("cors");

const mongoose = require("mongoose");

const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const FormEntry = mongoose.model("FormEntry", {
  name: String,
  mobileNumber: String,
  position: String,
  message: String,
});

// Handle form submissions
app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body;

    const formEntry = new FormEntry(formData);
    await formEntry.save();

    res.status(200).send("Form submitted successfully");
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).send("Internal Server Error");
  }
});

// user find
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: `${userId}` });

    if (user) {
      res.json(user);
      console.log("User data retrieved");
    } else {
      res.json("User not found");
      console.log(user);
    }
  } catch (e) {
    res.status(500).json("An error occurred");
  }
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json("exist");
    } else {
      res.json("not exist");
    }
  } catch (error) {
    res.status(500).json("An error occurred");
  }
});

// signup
app.post("/signup", async (req, res) => {
  const { email, password, name, pic, department } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.json("exist");
    } else {
      await User.create({
        email,
        password,
        name,
      });

      res.json("not exist");
    }
  } catch (e) {
    res.status(500).json(`Error creating user: ${e.message}`);
  }
});

// Define a route for fetching all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    if (users.length > 0) {
      res.json(users);
    } else {
      res.json("No users found");
    }
  } catch (e) {
    res.status(500).json("An error occurred");
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, password, confirmPassword, otp } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.json("user not found");
    }

    if (!user.resetPasswordOTP) {
      return res.json("stored OTP is undefined");
    }

    if (password !== confirmPassword) {
      return res.json("passwords do not match");
    }

    if (user.resetPasswordOTP.trim() !== otp.trim()) {
      return res.json("invalid OTP");
    }

    user.password = password;
    user.resetPasswordOTP = null;
    await user.save();

    res.json("success");
  } catch (e) {
    res.status(500).json("An error occurred");
  }
});

app.post("/generate-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();

    const user = await User.findOne({ email });

    if (!user) {
      return res.json("user not found");
    }

    const userEmail = user.email;
    const username = user.name;

    await User.findOneAndUpdate(
      { email },
      { $set: { resetPasswordOTP: otp, department: "defaultDepartment" } },
      { new: true, upsert: true }
    );

    await sendOTPEmail(email, otp, userEmail, username);

    res.json("OTP sent successfully");
  } catch (e) {
    res.status(500).json("An error occurred");
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gitamapptech@gmail.com",
    pass: "ajza yvpi ptur jinv",
  },
});

const sendOTPEmail = async (to, otp, userEmail, username) => {
  try {
    const mailOptions = {
      from: "gitamapptech@gmail.com",
      to,
      subject: "Password Reset OTP",
      text: `Dear ${username},


      
      OTP: ${otp}
      
    
    `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Generated OTP:", otp);
  return otp;
};

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
