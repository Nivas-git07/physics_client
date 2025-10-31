const express = require("express");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require('google-auth-library');
const e = require("express");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
const JWT_SECRET = "supersecret";

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const checkingemail = await pool.query("SELECT * FROM login WHERE email=$1", [
    email,
  ]);

  if (checkingemail.rows.length > 0) {
    res.status(400).json({ message: "email already exists" });
    return;
    console.log("email already exists");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const now = new Date(); 
  const formatted = now.toISOString();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingOtp = await pool.query(
      "SELECT * FROM userotp WHERE email=$1",
      [email]
    );

    await pool.query(
      "INSERT INTO login (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    if (existingOtp.rows.length > 0) {
     
      await pool.query(
        "UPDATE userotp SET otp=$1, created_at=$2 WHERE email=$3",
        [otp, now, email]
      );
      console.log("OTP updated successfully");
    } else {
    
      await pool.query(
        "INSERT INTO userotp (email, otp, created_at) VALUES ($1, $2, $3)",
        [email, otp, now]
      );
      console.log("OTP inserted successfully");

    }
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
    const { email, checkotp } = req.body;

    try {
      
      const result = await pool.query(
        "SELECT otp, created_at FROM userotp WHERE email=$1",
        [email]
      );

      if (result.rows.length === 0) {
        return res
          .status(400)
          .json({ message: "OTP not found or already expired" });
      }

      const userOtp = result.rows[0];

      
      const now = new Date();
      const createdAt = new Date(userOtp.created_at);
      const timeDiff = now - createdAt; 

      if (timeDiff > 300000) {
       
        await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
        return res.status(400).json({ message: "OTP expired" });
      }

      
      if (userOtp.otp != checkotp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      
    
      const registerUser = await pool.query(
       "UPDATE login SET status='ACTIVE' WHERE email=$1",[email]
      );

      
      await pool.query("DELETE FROM userotp WHERE email=$1", [email]);

      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  const checkingemail = await pool.query("SELECT * FROM login WHERE email=$1", [
    email,
  ]);
  if (checkingemail.rows.length === 0) {
    res.status(400).json({ message: "Email does not exisit" });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const formatted = now.toISOString();

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

  try {
    const existingOtp = await pool.query(
      "SELECT * FROM userotp WHERE email=$1",
      [email]
    );
    if (existingOtp.rows.length > 0) {
      await pool.query(
        "UPDATE userotp SET otp=$1 , created_at=$2 WHERE email=$3",
        [otp, now, email]
      );
    } else {
      await pool.query(
        "INSERT INTO userotp (email, otp, created_at) VALUES ($1, $2, $3)",
        [email, otp, now]
      );
    }
  } catch (err) {
    console.error("Error inserting OTP:", err.message);
    res.status(500).json({ error: "forgot otp error" });
    return;
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, resetotp } = req.body;
  try {
    const result = await pool.query(
      "SELECT otp, created_at FROM userotp WHERE email=$1",
      [email]
    );
    const userotp = result.rows[0];
    const now = new Date();
    const createdAt = new Date(userotp.created_at);
    const timeDiff = now - createdAt;

    if (timeDiff > 300000) {
      await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
      return res.status(400).json({ message: "OTP expired" });
    }
    if (resetotp != result.rows[0].otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    res.json({ message: "OTP verified successfully" });
    await pool.query("DELETE FROM userotp WHERE email=$1", [email]);
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ message: "reset otp error" });
  }
});

app.post("/confrom-password", async (req, res) => {
  const { email, newpassword } = req.body;
  const newhashedpassword = await bcrypt.hash(newpassword, 10);
  try {
    await pool.query("UPDATE login SET password=$1 WHERE email=$2", [
      newhashedpassword,
      email,
    ]);
    res.json({ message: "Password reset successfully" });
    console.log("Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ message: "password error" });
  }
});

app.post("/api/google", async(req,res)=>{
  const{token}=req.body;
  try{
    const ticket=await client.verifyIdToken({
      idToken:token,
      audience:process.env.GOOGLE_CLIENT_ID,
    });
    const payload=ticket.getPayload();
    console.log("Google user payload:",payload);
    const email=payload.email;
    const picture=payload.picture;
    const name=payload.name;
    const id=payload.sub;
    await pool.query(
      "INSERT INTO google_login (email,name,picture,id) VALUES ($1,$2,$3,$4)",
      [email,name,picture,id]
    );
    console.log("Google user saved to database");
  }
  catch(error){
    console.error("Error during Google login:",error.message);
    res.status(500).json({message:"Internal server error"});
  }
})


//login///
app.post("/login", async(req,res)=>{
  const{email,password}=req.body;
  try{
    const result=await pool.query("SELECT * FROM login WHERE email=$1",[email]);
    if(result.rows.length===0){
      return res.status(400).json({message:"Invalid email"});
    }
    const user=result.rows[0];
    const ispasswordvalid=await bcrypt.compare(password,user.password);
    if(!ispasswordvalid){
      return res.status(400).json({message:"Invalid password"});
    }
    const token=jwt.sign({id:user.id,email:user.email},JWT_SECRET,{expiresIn:"1h"}); 

    if(result.rows[0].status!=="ACTIVE"){
      return res.status(403).json({message:"Please register your account first by verifying OTP" });
      console.log("Please register your account first by verifying OTP");
    }

    res.status(200).json({message:"successful",token})
  }catch(error){
    console.error("Error during login:",error.message);
    res.status(500).json({message:"Internal server error"});
  }
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} `);
});
