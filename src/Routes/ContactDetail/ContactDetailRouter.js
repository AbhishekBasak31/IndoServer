import express from "express";
import {
  createContactDetails,
  getContactDetails,
  updateContactDetails,
  deleteContactDetails,
} from "../../Controller/ContactDetail/ContactDetail.js"; // Adjust path
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const ContactDetailRouter = express.Router();

ContactDetailRouter.post("/",authenticate, createContactDetails);
ContactDetailRouter.get("/", getContactDetails);
ContactDetailRouter.patch("/:id",authenticate, updateContactDetails);
ContactDetailRouter.delete("/:id",authenticate, deleteContactDetails);

export default ContactDetailRouter;