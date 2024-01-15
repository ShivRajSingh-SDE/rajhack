const express = require("express");
const User = require("./mongo");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage"); // Fix here
const Grid = require("gridfs-stream");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const connection = mongoose.createConnection(
  "mongodb+srv://amber:amber@cluster0.evciczt.mongodb.net/app?retryWrites=true&w=majority"
);
let gfs;

connection.once("open", () => {
  // Initialize GridFS stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridFsStorage({
  url: "mongodb+srv://amber:amber@cluster0.evciczt.mongodb.net/app?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: file.originalname,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

const formEntrySchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  position: String,
  message: String,
  status: {
    type: String,
    default: "Pending",
  },
  description: String,
  id: String,
  attachment: String,
});

const FormEntry = mongoose.model("FormEntry", formEntrySchema);

// form submit
app.post("/submit-form", upload.single("file"), async (req, res) => {
  const { id, name, mobileNumber, email, position, message } = req.body;

  try {
    await FormEntry.create({
      id,
      name,
      mobileNumber,
      email,
      position,
      message,
      attachment: req.file.filename, // Save the filename in the database
      // Remove 'image' field, as it is not needed with GridFS
    });

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update form entry status
app.put("/form-entries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    // Update the status and description in MongoDB
    const updatedEntry = await FormEntry.findByIdAndUpdate(
      id,
      { $set: { status, description } },
      { new: true }
    );

    if (updatedEntry) {
      res.status(200).json(updatedEntry);
    } else {
      res.status(404).json({ error: "Form entry not found" });
    }
  } catch (error) {
    console.error("Error updating status and description:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// user find
app.get("/users/:email", async (req, res) => {
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });

    if (user) {
      res.json({ roleadmin: user.roleadmin });
    } else {
      res.status(404).json({ error: "User not found" });
      console.log("User not found");
    }
  } catch (e) {
    res.status(500).json({ error: "An error occurred" });
    console.error("Error fetching user data:", e);
  }
});

// login
app.post("/login", async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (
        user.resetPasswordOTP &&
        user.resetPasswordOTP.trim() === otp.trim()
      ) {
        // Clear the OTP after successful verification
        user.resetPasswordOTP = null;
        await user.save();
        res.json("exist");
      } else {
        res.status(400).json("Invalid OTP");
      }
    } else {
      res.status(400).json("User not found or incorrect password");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("An error occurred");
  }
});

// signup
app.post("/signup", async (req, res) => {
  const { email, password, name, roleadmin } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.json("exist");
    } else {
      await User.create({
        email,
        password,
        name,
        roleadmin,
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

// reset pass
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

// generate otp
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

// admin verify otp
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json("user not found");
    }

    if (!user.resetPasswordOTP) {
      return res.json("stored OTP is undefined");
    }

    if (user.resetPasswordOTP.trim() !== otp.trim()) {
      return res.json("invalid OTP");
    }

    // Clear the OTP after successful verification
    user.resetPasswordOTP = null;
    await user.save();

    res.json("OTP verified");
  } catch (e) {
    res.status(500).json("An error occurred");
  }
});

app.get("/form-entries", async (req, res) => {
  try {
    const formEntries = await FormEntry.find();
    res.json(formEntries);
  } catch (error) {
    console.error("Error fetching form entries:", error);
    res.status(500).json("Internal Server Error");
  }
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
