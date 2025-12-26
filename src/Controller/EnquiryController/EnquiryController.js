import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Enquiry } from "../../Model/Global/Enquiry/Enquiry.js";

dotenv.config();

// ============================
// 1. Create New Enquiry
// ============================
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, enquirie } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !enquirie) {
      return res.status(400).json({ error: "Please fill all fields, including phone number." });
    }

    // 2. Save to Database
    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      enquirie, 
    });

    await newEnquiry.save();

    // 3. Email Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Send Email Notification
    const mailOptions = {
      from: email, 
      to: "realstate694@gmail.com", // Target email
      subject: `New Product Enquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h3 style="color: #333;">New Customer Enquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr style="border-top: 1px solid #eee;" />
          <h4 style="color: #555;">Message:</h4>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${enquirie}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: newEnquiry,
    });

  } catch (err) {
    console.error("Enquiry Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ============================
// 2. Get All Enquiries (Admin)
// ============================
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }); // Newest first
    
    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Get Enquiries Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};