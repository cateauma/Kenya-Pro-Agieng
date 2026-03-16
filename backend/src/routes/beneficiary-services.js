import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";
import {
  useJsonStore,
  getServiceCatalog,
  createServiceRequest,
  getServiceRequestsByBeneficiary,
  getServiceById,
} from "../store/json-store.js";

const router = Router();

// GET /api/beneficiary/services — available service catalog (JSON store)
router.get("/services", requireAuth, requireRole("beneficiary"), (req, res) => {
  if (!useJsonStore()) {
    return res.json({ services: [], message: "Service catalog uses database." });
  }
  const services = getServiceCatalog();
  res.json({ services });
});

// GET /api/beneficiary/service-requests — my requests (pending + approved)
router.get("/service-requests", requireAuth, requireRole("beneficiary"), (req, res) => {
  if (!useJsonStore()) {
    return res.json({ requests: [] });
  }
  const requests = getServiceRequestsByBeneficiary(req.user.id).map((r) => ({
    ...r,
    service: getServiceById(r.service_id),
  }));
  res.json({ requests });
});

// POST /api/beneficiary/service-requests — request a service
router.post(
  "/service-requests",
  requireAuth,
  requireRole("beneficiary"),
  body("service_id").trim().notEmpty().withMessage("service_id required"),
  handleValidation,
  (req, res) => {
    if (!useJsonStore()) {
      return res.status(501).json({ error: "Service requests only available with JSON store." });
    }
    const { service_id } = req.body;
    const service = getServiceById(service_id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    const request = createServiceRequest(req.user.id, service_id);
    res.status(201).json(request);
  }
);

export default router;
