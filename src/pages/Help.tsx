import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I register as a beneficiary?", a: "Click 'Register' on the login page, select 'Beneficiary' as your role, and fill in the required information including your ID number, location, and a photo for verification." },
  { q: "How long does approval take?", a: "Admin typically reviews and approves accounts within 24-48 hours. You'll receive a notification once approved." },
  { q: "How can I donate?", a: "Register as a donor, then use the 'Make Donation' button on your dashboard. We accept both monetary and in-kind donations." },
  { q: "What is Inua Jamii?", a: "Inua Jamii is a Kenyan government social protection program that provides cash transfers to elderly citizens. KPAO helps beneficiaries access and navigate this program." },
  { q: "How do I volunteer?", a: "Register as a volunteer, browse available opportunities on your dashboard, and sign up for activities that match your skills and availability." },
  { q: "Who can I contact for support?", a: "Visit the Contact Us page or email info@kpao.or.ke for any questions or assistance." },
];

export default function Help() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Help Center</h1>
        <p className="page-subtitle">Frequently asked questions</p>
      </div>
      <div className="max-w-2xl">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="stat-card border px-4">
              <AccordionTrigger className="text-sm font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
