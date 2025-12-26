import express from "express";
import {
  createQuickLink,
  getAllQuickLinks,
  updateQuickLink,
  deleteQuickLink,
} from "../../Controller/QuiclLinkController/QuicKLinkController.js"; // Adjust path

const Qlinkrouter = express.Router();

Qlinkrouter.post("/", createQuickLink);
Qlinkrouter.get("/", getAllQuickLinks);
Qlinkrouter.patch("/:id", updateQuickLink);
Qlinkrouter.delete("/:id", deleteQuickLink);

export default Qlinkrouter;