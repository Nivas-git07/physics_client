const express = require("express");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
const JWT_SECRET = "supersecret";

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
   const checkingemail=await pool.query(
        "SELECT * FROM login WHERE email=$1",
        [email]);
        if(checkingemail.rows.length>0){
            res.status(400).json({message:"email already exists"});
            return;
        }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const now = new Date(); // this creates a Date object for the current moment :contentReference[oaicite:0]{index=0}
  const formatted = now.toISOString();

  try {
    const otpresult = await pool.query(
      "INSERT into userotp (email,otp,created_at) VALUES ($1,$2,$3) ",
      [email, otp, formatted]
    );

    try {
      await axios.post(
        "https://obito123.app.n8n.cloud/webhook/e9d4048a-a920-4f04-acb8-2211971f6859",
        {
          email: email,
          otp: otp,
        }
      );
      res.json({ message: "OTP sent to n8n successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send OTP to n8n" });
    }
  } catch (err) {
    console.error("Error inserting OTP:", err.message);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
  app.post("/verify-otp", async (req, res) => {
    const { email, checkotp, password } = req.body;
    const exisit = await pool.query("SELECT otp FROM userotp WHERE email=$1", 
      [email]
    );
    const user = exisit.rows[0];

    if (user.otp == checkotp) {
        try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const registerUser = await pool.query(
            "INSERT INTO login (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hashedPassword]);
            console.log("User registered successfully:");
            res.json({ message: "User registered successfully" });
        }
         catch (err){
            console.error("Error registering user:", err.message);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        
    } else {
        console.log("Invalid OTP");
        res.status(400).json({ message: "Invalid OTP" });
    }
    });
});
app.listen(PORT, () => {
  console.log(` http://localhost:${PORT} `);
});
