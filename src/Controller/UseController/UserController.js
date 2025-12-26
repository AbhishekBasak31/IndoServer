import bcrypt from "bcrypt";
import { User } from "../../Model/User/User.js";
import { Brand } from "../../Model/Global/Brand/Brand.js";
import { Contact } from "../../Model/Global/Contact/Contact.js";
import { Tyre } from "../../Model/Global/Tyres/Tyres.js";
import { populate } from "dotenv";
import { Enquiry } from "../../Model/Global/Enquiry/Enquiry.js";
import { Blog } from "../../Model/Global/Blog/Blog.js";
import { BlogCategory } from "../../Model/Global/BlogCatagory/BlogCatagory.js";
import { ContactDetails } from "../../Model/ContactDetails/ContactDetails.js";
import { Faq } from "../../Model/Global/Faq/Faq.js";
import { Footer } from "../../Model/Global/Footer/Footer.js";
import QuickLink from "../../Model/Global/QuickLink/QuickLink.js";
import { Growth } from "../../Model/Growth/Growth.js";
import Social from "../../Model/Global/Social/Social.js";
import { VehicleType } from "../../Model/Global/VehicleType/VehicleType.js";
import StoreLocator from "../../Model/Global/StoreLocator/StoreLocator.js";
import { Director } from "../../Model/Global/Directors/Directors.js";
import { Addon } from "../../Model/Homepage/Addons/Addons.js";
import { Catagory } from "../../Model/Homepage/Catagory/Catagory.js";
import { DirectorSec } from "../../Model/Homepage/DirectorsSec/DirectorsSec.js";
import { ExpertTalks } from "../../Model/Homepage/ExpertTalks/ExpertTalks.js";
import { HeroSection } from "../../Model/Homepage/Hero/Hero.js";
import { Journey } from "../../Model/Homepage/Journey/Journey.js";
import { Ourjourney } from "../../Model/Homepage/OurJourney/OurJouney.js";
import ReviewSection from "../../Model/Homepage/ReviewSec/ReviewSec.js";
import { StoreLocatorSec } from "../../Model/Homepage/StoreLocatorSec/StoreLocatorSec.js";
import { Whychooseus } from "../../Model/Homepage/WCU/WCU.js";
import { Newsletter } from "../../Model/NewsLetter/NewsLetter.js";
import { TyreGuide } from "../../Model/TyreguidePage/Tyreguide.js";

// ============================
// Register a new user
// ============================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Validate role (since it's enum in schema)

    const user = new User({
      username,
      email,
      password,
 
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username:user.username
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Login user
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = user.generateAccessToken();

    user.lastLoginAt = new Date();
    await user.save();

    // ✅ FIX: Added 'path: "/"' explicitly
    res.cookie("AccessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Better to use env check
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // 'None' is needed for cross-site (if frontend/backend are on different ports/domains)
      path: "/", // CRITICAL: Defines scope of cookie
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Logout user
// ============================
export const logoutUser = (req, res) => {
  try {
    // ✅ FIX: Options must match login exactly (except maxAge)
    res.clearCookie("AccessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/", // CRITICAL: Must match the path used in login
    });
    
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Get current authenticated user
// ============================
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Get all users (Admin only)
// ============================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Get user by ID
// ============================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Delete user
// ============================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Update self (user profile)
// ============================
export const updateSelf = async (req, res) => {
  try {
    const allowedFields = ["username","email",];
    const updates = {};

    allowedFields.forEach((key) => {
      if (req.body[key]) updates[key] = req.body[key];
    });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check new password not same as old
    if (updates.password) {
      const isSame = await user.comparePassword(updates.password);
      if (isSame) {
        return res.status(400).json({
          error: "New password cannot be the same as the old password",
        });
      }
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const DashboardData = async (req, res) => {
  try {
    // Fetch all data in parallel
    const [
    brand,
    contact,
    tyre,
    enquiry,
    blog,
    blogsection,
    contacdetails,
    faq,
    footer,
    quickLinks,
    social,
    growth,
    vehicleType,
    storeLocator,
    director,
    addon,
    catagory,
    directorSec,
    expertTalks,
    heroSection,
    journey,
    ourjourney,
    storeLocatorSec,
    whychooseus,
    newsletter,
    tyreguide,
    ] = await Promise.all([
      Brand.find().populate("Tyres"),
      Contact.find(),
      Tyre.find().populate("brand").populate("vehicleTypes").populate("dealer"),
      Enquiry.find(),
      Blog.find().populate("Category"),
      BlogCategory.find(),
      ContactDetails.find(),
      Faq.find(),
      Footer.find().populate("socials").populate("quickLinks"),
      QuickLink.find(),
      Social.find(),
      Growth.find(),
      VehicleType.find().populate("Tyres"),
      StoreLocator.find(),
      Director.find(),
      Addon.find(),
      Catagory.find().populate("Types"),
      DirectorSec.find().populate("Directors"),
      ExpertTalks.find(),
      HeroSection.find(),
      Journey.find(),
      Ourjourney.find(),
      ReviewSection.find().populate("Reviews"),
      StoreLocatorSec.find().populate("StoreLocators"),
      Whychooseus.find(),
      Newsletter.find(),
      TyreGuide.find()

    ]);

    // Send the combined response
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        brand,
        contact,
        tyre,
        enquiry,
        blog,
        blogsection,
        contacdetails,
        faq,
        footer,
        quickLinks,
        social,
        growth,
        vehicleType,
        storeLocator,
        director,
        addon,
        catagory,
        directorSec,
        expertTalks,
        heroSection,
        journey,
        ourjourney,
        storeLocatorSec,
        whychooseus,
        newsletter,
        tyreguide,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};