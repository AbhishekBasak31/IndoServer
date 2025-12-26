import { ContactDetails } from "../../Model/ContactDetails/ContactDetails.js"; // Adjust path to your model

// ==========================================
// @desc    Create Contact Details
// @route   POST /api/v1/contact-details
// @access  Private/Admin
// ==========================================
export const createContactDetails = async (req, res) => {
  try {
    const { call, email, address, hours } = req.body;

    // 1. Validation
    if (!call || !email || !address || !hours) {
      return res.status(400).json({
        success: false,
        error: "All fields (call, email, address, hours) are required.",
      });
    }

    // Optional: Check if one already exists to enforce a "Single Instance" rule
    // const existing = await ContactDetails.findOne();
    // if (existing) {
    //   return res.status(400).json({ success: false, error: "Contact details already exist. Please update instead." });
    // }

    // 2. Create
    const newContact = new ContactDetails({
      call,
      email,
      address,
      hours,
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Contact details created successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error("❌ Error creating contact details:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Get Contact Details
// @route   GET /api/v1/contact-details
// @access  Public
// ==========================================
export const getContactDetails = async (req, res) => {
  try {
    const contacts = await ContactDetails.find();

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Error fetching contact details:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Update Contact Details
// @route   PATCH /api/v1/contact-details/:id
// @access  Private/Admin
// ==========================================
export const updateContactDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { call, email, address, hours } = req.body;

    const existingContact = await ContactDetails.findById(id);

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        error: "Contact details not found",
      });
    }

    // Update fields if provided
    if (call) existingContact.call = call;
    if (email) existingContact.email = email;
    if (address) existingContact.address = address;
    if (hours) existingContact.hours = hours;

    const updatedContact = await existingContact.save();

    res.status(200).json({
      success: true,
      message: "Contact details updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("❌ Error updating contact details:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Delete Contact Details
// @route   DELETE /api/v1/contact-details/:id
// @access  Private/Admin
// ==========================================
export const deleteContactDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await ContactDetails.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        error: "Contact details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact details deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting contact details:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};