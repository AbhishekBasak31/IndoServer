import { Contact } from "../../Model/Global/Contact/Contact.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ============================
// Create Contact (Save DB + Send Email)
// ============================
export const createContact = async (req, res) => {
  const { name, email, message, phone } = req.body;

  // 1. Validation
  if (!name || !email || !message || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // 2. Save to Database
    const newContact = new Contact({
      name,
      email,
      phone,
      message
    });
    await newContact.save();

    // // 3. Send Email (Non-blocking)
    // // We don't want to fail the request if the email server is down, just log the error.
    // try {
    //   const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     secure: false, 
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASS,
    //     },
    //   });

    //   await transporter.sendMail({
    //     from: `"${name}" <${email}>`, 
    //     to: process.env.SMTP_USER, 
    //     subject: 'New Customer General Inquiry',
    //     html: `
    //       <h3>New Inquiry Received</h3>
    //       <p><strong>Name:</strong> ${name}</p>
    //       <p><strong>Email:</strong> ${email}</p>
    //       <p><strong>Phone:</strong> ${phone}</p>
    //       <p><strong>Message:</strong><br/>${message}</p>
    //     `,
    //   });
    // } catch (emailErr) {
    //   console.error('❌ Email sending warning:', emailErr.message);
    // }

    // 4. Response
    return res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully.', 
      data: newContact 
    });

  } catch (err) {
    console.error('❌ Create Contact Error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};

// ============================
// Get All Contacts
// ============================
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error('❌ Get Contacts Error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};