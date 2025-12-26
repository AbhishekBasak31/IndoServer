import helmet from "helmet";
import compression from "compression";
import os from "os";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import DB_Connection from "./src/Db/Db.js";
import UserRouter from "./src/Routes/UserRoutes/UserRoutes.js";
import FooterRouter from "./src/Routes/FooterRoutes/FooterRoutes.js";

import TestimonialRouter from "./src/Routes/TestimonialRoutes/TestimonialRoutes.js";
import StoryRouter from "./src/Routes/StoryRoutes/StoryRoutes.js";
import NewsletterRouter from "./src/Routes/NewsLetterRoutes/NewsLetterRoutes.js";
import GrowthRouter from "./src/Routes/GrowthRoutes/GrowthRoutes.js";
import FaqRouter from "./src/Routes/FaqRoutes/FaqRoutes.js";
import EnquiryRouter from "./src/Routes/EnquiryRoutes/EnquiryRoutes.js";
import AboutRouter from "./src/Routes/AboutRoutes/AboutRoutes.js";
import ShopbyVehiclerouter from "./src/Routes/ShopbyVehicle/ShopbyVehicle.js";
import ContactRouter from "./src/Routes/Contact/Contact.js";
import SocialRouter from "./src/Routes/SocialRouters/SocailRouter.js";
import Qlinkrouter from "./src/Routes/QuickLinkRoutes/QuickLinkRoutes.js";
import ContactDetailRouter from "./src/Routes/ContactDetail/ContactDetailRouter.js";
import HomeHerorouter from "./src/Routes/HeroPage/Hero/Hero.js";
import WCUrouter from "./src/Routes/HeroPage/WCU/WCU.js";
import HomeCatagoryrouter from "./src/Routes/HeroPage/Catagory/Catagory.js";
import VehicleTyperouter from "./src/Routes/Global/VehicleType/VehicleType.js";
import Reviewsecrouter from "./src/Routes/HeroPage/Reviewsec/Reviewsec.js";
import Reviewrouter from "./src/Routes/Global/ReviewRoutes/ReviewRoutes.js";
import ExpertTalksrouter from "./src/Routes/HeroPage/ExpertTalks/ExpertTalks.js";
import Haddonrouter from "./src/Routes/HeroPage/Addon/Addon.js";
import StoreLocatorsecrouter from "./src/Routes/HeroPage/StoreLoactorSec/StoreLocatorSec.js";
import StoreLocatorrouter from "./src/Routes/Global/StoreLocator/StoreLocator.js";
import Journeyrouter from "./src/Routes/HeroPage/JourneyRoutes/JourneyRoutes.js";
import DirectorSecrouter from "./src/Routes/HeroPage/DirectorSec/DirectorSec.js";
import Directorrouter from "./src/Routes/Global/Directors/Directors.js";
import TrustedStoryrouter from "./src/Routes/HeroPage/Ourjourney/Ourjourney.js";
import OurJouneyrouter from "./src/Routes/HeroPage/Ourjourney/Ourjourney.js";
import Brandrouter from "./src/Routes/Global/Brand/Brand.js";
import Tyresrouter from "./src/Routes/Global/Tyres/Tyres.js";
import TyreGuideRouter from "./src/Routes/Tyreguidepage/Tyreguide.js";
import BlogCategoryRouter from "./src/Routes/Global/BlogCatagory/BlogCatagory.js";
import BlogRouter from "./src/Routes/Global/Blog/Blog.js";



// Env Set up
dotenv.config();

// Initialize the express and port declaration
const app = express();
const PORT = process.env.PORT || 7000;

/* -------------------------------------------------------
   GET LOCAL NETWORK IP (for dev logging only)
------------------------------------------------------- */
function getLocalIP() {
  try {
    const nets = os.networkInterfaces();
    for (const name in nets) {
      for (const iface of nets[name]) {
        if ((iface.family === "IPv4" || iface.family === 4) && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (err) {
    console.warn("Local IP error:", err);
  }
  return "127.0.0.1";
}

const localIP = getLocalIP();

/* -------------------------------------------------------
   SECURITY & PERFORMANCE MIDDLEWARE
------------------------------------------------------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cookieParser());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* -------------------------------------------------------
   CORS CONFIG (FINAL & CORRECT)
------------------------------------------------------- */

// IMPORTANT:
// Frontend runs on https://fingertip.co.in/cdautomation
// Browser Origin = https://fingertip.co.in (NO PATH)

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://localhost:8086",
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  `http://${localIP}:8080`,
  `http://${localIP}:8086`,
  "https://fingertip.co.in", // ✅ PRODUCTION ORIGIN
]);

// Optional env-based origin (safe)
if (process.env.FRONTEND_URL) {
  try {
    const url = new URL(process.env.FRONTEND_URL);
    allowedOrigins.add(url.origin);
  } catch {
    allowedOrigins.add(process.env.FRONTEND_URL);
  }
}

console.log("🌐 Allowed Origins:", [...allowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / curl / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked CORS Origin:", origin);
      return callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true,
  })
);

/* -------------------------------------------------------
   REQUEST DEBUG (SAFE)
------------------------------------------------------- */
app.use((req, res, next) => {
  console.log("→", req.method, req.originalUrl);
  console.log("  Origin:", req.headers.origin || "(none)");
  next();
});

/* -------------------------------------------------------
   HEALTH CHECK
------------------------------------------------------- */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "production",
  });
});

// Api End points
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/tyre", Tyresrouter);
app.use("/api/v1/newsletter",NewsletterRouter);


app.use("/api/v1/review",Reviewrouter);
app.use("/api/v1/storelocator",StoreLocatorrouter);
app.use("/api/v1/director",Directorrouter);
app.use("/api/v1/brand",Brandrouter);
app.use("/api/v1/blogcatagory",BlogCategoryRouter);
app.use("/api/v1/blog",BlogRouter);




// Home page
app.use("/api/v1/home/hero",HomeHerorouter);
app.use("/api/v1/home/wcu",WCUrouter);
app.use("/api/v1/home/cat",HomeCatagoryrouter);
app.use("/api/v1/home/vehicletype",VehicleTyperouter);
app.use("/api/v1/home/reviewsec",Reviewsecrouter);
app.use("/api/v1/home/experttalks",ExpertTalksrouter);
app.use("/api/v1/home/addon",Haddonrouter);
app.use("/api/v1/home/storelocatorsec",StoreLocatorsecrouter);
app.use("/api/v1/home/journey",Journeyrouter);
app.use("/api/v1/home/directorsec",DirectorSecrouter);
app.use("/api/v1/home/ourjourney",OurJouneyrouter);
app.use("/api/v1/tyreguide",TyreGuideRouter);
app.use("/api/v1/growth",GrowthRouter);
app.use("/api/v1/footer",FooterRouter);
app.use("/api/v1/faq",FaqRouter);
app.use("/api/v1/enquiry",EnquiryRouter);
app.use('/api/v1/contact', ContactRouter);
app.use('/api/v1/footer/social', SocialRouter);
app.use('/api/v1/footer/qlink', Qlinkrouter);
app.use('/api/v1/contactdetail', ContactDetailRouter);



console.log(process.env.DB_URI, process.env.DB_NAME);
// Deb connection setup 
DB_Connection(process.env.DB_URI, process.env.DB_NAME)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(` Local:    http://localhost:${PORT}`);
      console.log(` Network:  http://${localIP}:${PORT}`);
    });
  })
  .catch((err) => console.error(" Database Connection Failed:", err));
