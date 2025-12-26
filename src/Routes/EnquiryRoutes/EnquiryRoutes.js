import express from "express";
import { createEnquiry, getAllEnquiries } from "../../Controller/EnquiryController/EnquiryController.js";
const EnquiryRouter = express.Router();

EnquiryRouter.post("/", createEnquiry);
EnquiryRouter.get("/", getAllEnquiries);

export default EnquiryRouter;