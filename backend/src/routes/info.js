import { Router } from "express";

const router = Router();

// GET /api/info/about
router.get("/about", (req, res) => {
  res.json({
    name: "Kenya Pro Aging Organization",
    description: "Digitizing coordination of elderly care services in Kenya. A centralized platform for beneficiaries, volunteers, donors, staff, and care programs.",
    mission: "Single source of truth for efficiency, accountability, and real-time tracking.",
  });
});

// GET /api/info/contact
router.get("/contact", (req, res) => {
  res.json({
    organization: "Kenya Pro Aging Organization (KPAO)",
    email: "contact@kpao.org",
    phone: "+254 XXX XXX XXX",
    address: "Nairobi, Kenya",
  });
});

export default router;
