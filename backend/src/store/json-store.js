import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, "..", "..", "data", "store.json");

const defaultData = () => ({
  users: [],
  beneficiaries: [],
  notifications: [],
  donations: [],
  opportunities: [],
  volunteer_signups: [],
  service_requests: [],
  programs: [],
  tasks: [],
});

function read() {
  if (!existsSync(STORE_PATH)) return defaultData();
  try {
    const raw = readFileSync(STORE_PATH, "utf8");
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

function write(data) {
  const dir = path.dirname(STORE_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function useJsonStore() {
  if (process.env.USE_JSON_STORE === "0" || process.env.USE_JSON_STORE === "false") return false;
  if (process.env.USE_JSON_STORE === "1" || process.env.USE_JSON_STORE === "true") return true;
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("PROJECT_REF") || process.env.DATABASE_URL.includes("YOUR_PASSWORD")) return true;
  return false;
}

// --- Users ---
export function getUsers(filters = {}) {
  const data = read();
  let list = [...data.users];
  if (filters.role) list = list.filter((u) => u.role === filters.role);
  if (filters.approval_status) list = list.filter((u) => u.approval_status === filters.approval_status);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
}

export function getPendingUsers() {
  return getUsers({ approval_status: "pending" });
}

export function getUserByEmail(email) {
  return read().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserById(id) {
  return read().users.find((u) => u.id === id) ?? null;
}

export function createUser({ email, password_hash, full_name, phone_number, role }) {
  const data = read();
  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    email,
    password_hash,
    full_name,
    phone_number: phone_number || "",
    role,
    approval_status: "pending",
    created_at: now,
    updated_at: now,
  };
  data.users.push(user);
  write(data);
  return user;
}

export function updateUserApprovalStatus(id, approval_status) {
  const data = read();
  const u = data.users.find((x) => x.id === id);
  if (!u) return null;
  u.approval_status = approval_status;
  u.updated_at = new Date().toISOString();
  write(data);
  return u;
}

// --- Beneficiaries ---
export function createBeneficiary({ id, id_number, location, date_of_birth, photo_url }) {
  const data = read();
  data.beneficiaries.push({ id, id_number, location, date_of_birth, photo_url: photo_url || "pending" });
  write(data);
}

// --- Notifications ---
export function addNotification(user_id, message, type = "approval") {
  const data = read();
  data.notifications.push({
    id: randomUUID(),
    user_id,
    message,
    type,
    is_read: false,
    created_at: new Date().toISOString(),
  });
  write(data);
}

// --- Donations (for consistency) ---
export function getDonations() {
  const data = read();
  return [...(data.donations || [])].sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
}

export function addDonation(donation) {
  const data = read();
  const now = new Date().toISOString();
  data.donations = data.donations || [];
  data.donations.push({
    id: randomUUID(),
    ...donation,
    date: donation.date || now,
    created_at: now,
  });
  write(data);
  return data.donations[data.donations.length - 1];
}

// --- Opportunities & Events ---
const DEFAULT_OPPORTUNITIES = [
  { id: "1", title: "Meal Distribution — Nairobi", date: "2026-03-15", location: "Karen", slots: 5, duration_hours: 3, category: "Meals", type: "opportunity", description: "Help distribute meals to elderly beneficiaries.", created_at: new Date().toISOString() },
  { id: "2", title: "Home Visit Companion", date: "2026-03-16", location: "Westlands", slots: 2, duration_hours: 4, category: "Visits", type: "opportunity", description: "Accompany staff on home visits.", created_at: new Date().toISOString() },
  { id: "3", title: "Youth-Elder Story Circle", date: "2026-03-18", location: "City Center", slots: 10, duration_hours: 2, category: "Events", type: "event", description: "Intergenerational storytelling event.", created_at: new Date().toISOString() },
  { id: "4", title: "Health Screening Support", date: "2026-03-20", location: "Kibera", slots: 3, duration_hours: 5, category: "Health", type: "opportunity", description: "Support health screening at the clinic.", created_at: new Date().toISOString() },
  { id: "5", title: "Community Meal Distribution", date: "2026-03-15", location: "Karen Community Center", slots: 25, duration_hours: 3, category: "Meals", type: "event", description: "Community meal distribution event.", created_at: new Date().toISOString() },
  { id: "6", title: "Home Visit Training Session", date: "2026-03-22", location: "KPAO Office", slots: 15, duration_hours: 2, category: "Training", type: "event", description: "Training for new home visit volunteers.", created_at: new Date().toISOString() },
];

function ensureOpportunities(data) {
  if (!data.opportunities || data.opportunities.length === 0) {
    data.opportunities = DEFAULT_OPPORTUNITIES.map((o) => ({ ...o, id: randomUUID(), created_at: new Date().toISOString() }));
    write(data);
  }
}

export function getOpportunities(filter = {}) {
  const data = read();
  ensureOpportunities(data);
  let list = [...(data.opportunities || [])];
  if (filter.type) list = list.filter((o) => o.type === filter.type);
  list.sort((a, b) => new Date(a.date) - new Date(b.date));
  return list;
}

export function getOpportunityById(id) {
  const data = read();
  ensureOpportunities(data);
  return data.opportunities.find((o) => o.id === id) ?? null;
}

export function getVolunteerSignups(volunteerId) {
  const data = read();
  return (data.volunteer_signups || []).filter((s) => s.volunteer_id === volunteerId);
}

export function getSignupsForOpportunity(opportunityId) {
  const data = read();
  return (data.volunteer_signups || []).filter((s) => s.opportunity_id === opportunityId);
}

export function signupVolunteer(opportunityId, volunteerId) {
  const data = read();
  const opp = (data.opportunities || []).find((o) => o.id === opportunityId);
  if (!opp) return null;
  const existing = (data.volunteer_signups || []).find((s) => s.opportunity_id === opportunityId && s.volunteer_id === volunteerId);
  if (existing) return existing;
  data.volunteer_signups = data.volunteer_signups || [];
  const signup = {
    id: randomUUID(),
    opportunity_id: opportunityId,
    volunteer_id: volunteerId,
    created_at: new Date().toISOString(),
  };
  data.volunteer_signups.push(signup);
  write(data);
  return signup;
}

export function cancelVolunteerSignup(opportunityId, volunteerId) {
  const data = read();
  data.volunteer_signups = (data.volunteer_signups || []).filter(
    (s) => !(s.opportunity_id === opportunityId && s.volunteer_id === volunteerId)
  );
  write(data);
  return true;
}

/** All signups for admin (order: newest first). */
export function getAllSignups() {
  const data = read();
  return [...(data.volunteer_signups || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
}

// --- Service catalog & beneficiary service requests ---
const DEFAULT_SERVICE_CATALOG = [
  { id: "meal_delivery", name: "Meal Delivery", description: "Nutritious meals delivered to your home twice a week", active: true },
  { id: "health_monitoring", name: "Health Monitoring", description: "Regular check-ups and vital sign tracking", active: true },
  { id: "home_visits", name: "Home Visits", description: "Social worker and caregiver home visits", active: true },
  { id: "counseling", name: "Counseling", description: "Emotional support and group therapy sessions", active: true },
  { id: "community_activities", name: "Community Activities", description: "Intergenerational events and social gatherings", active: false },
  { id: "financial_support", name: "Financial Support", description: "Linkage to saccos, chamas, and financial advice", active: false },
];

export function getServiceCatalog() {
  const data = read();
  if (!data.service_catalog || data.service_catalog.length === 0) {
    data.service_catalog = [...DEFAULT_SERVICE_CATALOG];
    write(data);
  }
  return [...(data.service_catalog || DEFAULT_SERVICE_CATALOG)];
}

export function getServiceById(serviceId) {
  return getServiceCatalog().find((s) => s.id === serviceId) ?? null;
}

export function createServiceRequest(beneficiaryId, serviceId) {
  const data = read();
  const service = getServiceById(serviceId);
  if (!service) return null;
  const existing = (data.service_requests || []).find(
    (r) => r.beneficiary_id === beneficiaryId && r.service_id === serviceId && r.status === "pending"
  );
  if (existing) return existing;
  data.service_requests = data.service_requests || [];
  const now = new Date().toISOString();
  const req = {
    id: randomUUID(),
    beneficiary_id: beneficiaryId,
    service_id: serviceId,
    status: "pending",
    created_at: now,
    reviewed_at: null,
    reviewed_by: null,
  };
  data.service_requests.push(req);
  write(data);
  return req;
}

export function getServiceRequestsByBeneficiary(beneficiaryId) {
  const data = read();
  return [...(data.service_requests || [])]
    .filter((r) => r.beneficiary_id === beneficiaryId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function getAllServiceRequests(filter = {}) {
  const data = read();
  let list = [...(data.service_requests || [])];
  if (filter.status) list = list.filter((r) => r.status === filter.status);
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
}

export function getServiceRequestById(id) {
  const data = read();
  return (data.service_requests || []).find((r) => r.id === id) ?? null;
}

export function updateServiceRequestStatus(id, status, reviewedBy) {
  const data = read();
  const r = (data.service_requests || []).find((x) => x.id === id);
  if (!r) return null;
  r.status = status;
  r.reviewed_at = new Date().toISOString();
  r.reviewed_by = reviewedBy;
  write(data);
  return r;
}

// --- Programs & Tasks (Program Manager) ---

export function getPrograms() {
  const data = read();
  const list = [...(data.programs || [])];
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return list;
}

export function getProgramById(id) {
  const data = read();
  return (data.programs || []).find((p) => p.id === id) ?? null;
}

export function createProgram(input) {
  const data = read();
  const now = new Date().toISOString();
  const program = {
    id: randomUUID(),
    name: input.name,
    description: input.description || "",
    region: input.region || "Nairobi",
    status: input.status || "Active",
    start_date: input.start_date || now.slice(0, 10),
    end_date: input.end_date || null,
    budget: typeof input.budget === "number" ? input.budget : null,
    goals: input.goals || "",
    beneficiaries_count: input.beneficiaries_count || 0,
    progress: input.progress ?? 0,
    manager_id: input.manager_id || null,
    created_at: now,
    updated_at: now,
  };
  data.programs = data.programs || [];
  data.programs.push(program);
  write(data);
  return program;
}

export function getTasksForProgram(programId) {
  const data = read();
  return [...(data.tasks || [])]
    .filter((t) => t.program_id === programId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function createTask(input) {
  const data = read();
  const now = new Date().toISOString();
  const task = {
    id: randomUUID(),
    program_id: input.program_id,
    title: input.title,
    description: input.description || "",
    assignee_id: input.assignee_id || null,
    priority: input.priority || "Medium",
    status: input.status || "Pending",
    due_date: input.due_date || null,
    created_at: now,
    updated_at: now,
  };
  data.tasks = data.tasks || [];
  data.tasks.push(task);
  write(data);
  return task;
}
