import { Router } from "express";
import { useJsonStore, getOpportunities, getOpportunityById, getSignupsForOpportunity, signupVolunteer, cancelVolunteerSignup } from "../store/json-store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/opportunities — list (optional ?type=event|opportunity)
router.get("/", (req, res) => {
  if (!useJsonStore()) {
    return res.json({ opportunities: [], message: "Opportunities use database; not configured for this demo." });
  }
  const type = req.query.type; // "event" | "opportunity"
  const filter = type ? { type } : {};
  const opportunities = getOpportunities(filter).map((opp) => ({
    ...opp,
    signed_up_count: getSignupsForOpportunity(opp.id).length,
  }));
  res.json({ opportunities });
});

// GET /api/opportunities/:id
router.get("/:id", (req, res) => {
  if (!useJsonStore()) {
    return res.status(404).json({ error: "Not found" });
  }
  const opp = getOpportunityById(req.params.id);
  if (!opp) return res.status(404).json({ error: "Opportunity not found" });
  res.json(opp);
});

// POST /api/opportunities/:id/signup — volunteer signs up
router.post("/:id/signup", requireAuth, requireRole("volunteer"), (req, res) => {
  if (!useJsonStore()) {
    return res.status(501).json({ error: "Sign-up is only available when using JSON store." });
  }
  const opportunityId = req.params.id;
  const opp = getOpportunityById(opportunityId);
  if (!opp) return res.status(404).json({ error: "Opportunity not found" });
  const signup = signupVolunteer(opportunityId, req.user.id);
  res.status(201).json(signup);
});

// DELETE /api/opportunities/:id/signup — volunteer cancels signup
router.delete("/:id/signup", requireAuth, requireRole("volunteer"), (req, res) => {
  if (!useJsonStore()) {
    return res.status(501).json({ error: "Cancel sign-up is only available when using JSON store." });
  }
  const opportunityId = req.params.id;
  cancelVolunteerSignup(opportunityId, req.user.id);
  res.status(204).send();
});

export default router;
