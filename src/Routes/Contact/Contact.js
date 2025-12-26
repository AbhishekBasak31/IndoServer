import express from "express";
import { createContact, getContacts } from "../../Controller/Contact/Contact.js";

const ContactRouter = express.Router();

// Endpoint: /api/v1/contact
ContactRouter.post("/", createContact);
ContactRouter.get("/", getContacts);

export default ContactRouter;