import { StoreLocator } from "../../../Model/Global/StoreLocator/StoreLocator.js"; // Adjust path
import { StoreLocatorSec } from "../../../Model/Homepage/StoreLocatorSec/StoreLocatorSec.js"; // Adjust path to Parent Section

// ==========================================
// @desc    Create Store & Link to Section
// @route   POST /api/v1/storelocator
// @access  Private/Admin
// ==========================================
export const createStoreLocator = async (req, res) => {
  try {
    const { 
      StoreAddress, 
      Workhour, 
      State, 
      MapLink, 
      PIncode, 
      Phone1, 
      Phone2 
    } = req.body;

    // 1. Validation
    if (!StoreAddress || !Workhour || !State || !MapLink || !PIncode || !Phone1) {
      return res.status(400).json({ success: false, error: "All required fields must be filled." });
    }

    // 2. Create the Store Document
    const newStore = new StoreLocator({
      StoreAddress,
      Workhour,
      State,
      MapLink,
      PIncode,
      Phone1,
      Phone2,
      Active: true // Default
    });

    const savedStore = await newStore.save();

    // 3. AUTOMATICALLY LINK TO PARENT SECTION (StoreLocatorSec)
    const section = await StoreLocatorSec.findOne();
    if (section) {
      section.StoreLocators.push(savedStore._id);
      await section.save();
    } else {
      console.warn("⚠️ No StoreLocatorSec found. Store saved but not linked to home section.");
    }

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: savedStore,
    });
  } catch (error) {
    console.error("❌ Error creating store:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Get All Stores
// @route   GET /api/v1/storelocator
// @access  Public
// ==========================================
export const getAllStoreLocators = async (req, res) => {
  try {
    const stores = await StoreLocator.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    console.error("❌ Error fetching stores:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Update Store
// @route   PATCH /api/v1/storelocator/:id
// @access  Private/Admin
// ==========================================
export const updateStoreLocator = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStore = await StoreLocator.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }

    res.status(200).json({
      success: true,
      message: "Store updated successfully",
      data: updatedStore,
    });
  } catch (error) {
    console.error("❌ Error updating store:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Delete Store & Remove from Section
// @route   DELETE /api/v1/storelocator/:id
// @access  Private/Admin
// ==========================================
export const deleteStoreLocator = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Delete the Store Document
    const deletedStore = await StoreLocator.findByIdAndDelete(id);

    if (!deletedStore) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }

    // 2. Remove Reference from StoreLocatorSec
    await StoreLocatorSec.updateMany(
      {}, 
      { $pull: { StoreLocators: id } }
    );

    res.status(200).json({
      success: true,
      message: "Store deleted and removed from section successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting store:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// @desc    Toggle Active Status
// @route   PATCH /api/v1/storelocator/:id/status
// @access  Private/Admin
// ==========================================
export const toggleStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await StoreLocator.findById(id);
    
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }

    store.Active = !store.Active;
    await store.save();

    res.status(200).json({
      success: true,
      message: `Store is now ${store.Active ? "Active" : "Inactive"}`,
      data: store,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};