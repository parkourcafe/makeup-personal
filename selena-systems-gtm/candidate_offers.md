# Candidate Offers — Selena Systems

Twelve candidate productized offers generated from the pain research (`pain_signals.csv`), market landscape (`market_research.md`), and competitor gaps. Prices are fixed-scope implementation fees; client pays their own SaaS/API costs (assumption A4). Scoring and tournament results are in `idea_tournament.md`.

---

## O1. Villa Ops OS — AI Guest & Lead Response System for Villa Management Companies

- **Target customer:** Bali villa/property management companies managing 15–500+ villas (also boutique villa collectives).
- **Core pain:** 24/7 international inquiries hit WhatsApp/OTA/email around the clock; response SLAs are enforced by hiring humans (documented reservation-agent job posts with "respond within 6 working hours" SLAs); slow replies lose bookings in an oversupplied market (occupancy ~53%, ADR −14%).
- **Promise:** In 14 days: no inquiry waits more than 2 minutes for a useful first response, ever — and every conversation lands in one pipeline.
- **Deliverables:** WhatsApp Business API AI first responder (multilingual EN/ID + guest languages), availability/pricing FAQ answering from a synced sheet/PMS, lead capture into a simple CRM pipeline, escalation rules to human staff, guest pre-arrival/upsell message flows, owner-facing weekly report automation, 90-min team training, handover docs.
- **Price:** $6,500–$8,500 depending on portfolio size.
- **Why they pay:** One reservation agent salary ≈ $250–400/month plus churn; missed after-hours bookings are direct revenue loss; oversupply makes conversion rate existential.
- **Lead sourcing:** Google Maps + villa PM directories (65 Bali leads already in `lead_list.csv`); in-person visits; expat founder networks.
- **Sales angle:** "Your guests message at 2am from Sydney and 11pm from Berlin. Who answers?"
- **Risks:** Smaller PMs can't pay; WhatsApp API onboarding friction; legal gate for Indonesian entities (see red team R1).
- **Proof needed:** One live demo bot on a sample villa + response-time before/after from first client.
- **Complexity:** Medium (WhatsApp API + sheet/PMS sync + CRM). ROI logic: 2 saved bookings/month at $150+/night × multi-night stays ≈ system pays back in <90 days (client-side numbers gathered on call).

## O2. Speed-to-Lead OS — AI Lead Response & Follow-Up for Dubai Brokerages

- **Target customer:** Dubai real estate brokerages, 5–50 agents, buying portal leads (Bayut/Property Finder).
- **Core pain:** Leads cost AED 300–600 each; the same lead hits 3–4 agencies; 1am inquiries sit until morning; follow-up lives on agents' personal WhatsApp with zero CRM visibility; 48% of inquiries industry-wide never get answered (WAV Group).
- **Promise:** In 14 days: every portal/WhatsApp lead gets an intelligent response in under 60 seconds, gets qualified, and is logged + followed up automatically for 90 days.
- **Deliverables:** AI WhatsApp responder + qualifier (budget/area/timeline), portal-lead ingestion, CRM logging (Bitrix24/HubSpot/whatever they run), 90-day nurture sequences, hot-lead alerts to agents, management dashboard (response times, lead outcomes), training + docs.
- **Price:** $8,000–$10,000.
- **Why they pay:** One median-deal commission ≈ AED 40,000 (~$10,900) — one saved lead pays for everything; they already burn AED 15–40k/month on marketing feeding a leaky bucket.
- **Lead sourcing:** RERA/portal agency directories, Trustpilot complaint mining, LinkedIn; 16 leads already listed.
- **Sales angle:** "You pay AED 500 per lead and answer them 9 hours later. Your competitor answered in 60 seconds."
- **Risks:** Cold remote trust with zero case studies; brokers distrust bots with hot leads; existing WhatsApp-CRM SaaS competition (implementation gap is the wedge).
- **Proof needed:** Recorded demo of a lead being qualified end-to-end; ideally one Bali real-estate case study first.
- **Complexity:** Medium-high (portal ingestion + CRM integration). ROI logic: leads/month × current no-response rate × close rate × AED 40k commission — computed live with their numbers.

## O3. Patient Inquiry & Booking Recovery System — Clinics (Bali + Australia)

- **Target customer:** Aesthetic/dental/wellness clinics serving international patients (Bali medical tourism) and AU multi-location clinics.
- **Core pain:** Documented WhatsApp "radio silence" losing paying patients (Rejuvie review; Sunset Dental case); >1-day response cuts booking probability 42%; AU franchise phone lines ring out (Laser Clinics complaints); no-shows cost physio clinics up to A$114k/year.
- **Promise:** In 14 days: every inquiry (WhatsApp/IG/web/phone-overflow) answered instantly in the patient's language, triaged, booked, reminded, and followed up.
- **Deliverables:** Multilingual AI intake agent on WhatsApp/IG DM, treatment-FAQ knowledge base, booking-system integration or booking-request pipeline, no-show reminder sequences, post-treatment follow-up flows, lead-source dashboard, staff training, docs. Medical-safety guardrails: agent never gives clinical advice, only logistics + approved FAQ.
- **Price:** $7,000–$9,000.
- **Why they pay:** High-ticket treatments (veneers, packages worth $2–15k for dental tourists); one recovered patient can cover half the fee; coordinators cost a recurring salary.
- **Lead sourcing:** 31 clinic leads listed (16 Bali, 15 AU); medical-tourism directories; review mining.
- **Sales angle:** "A patient with a confirmed appointment messaged you in pain and got silence. That's a $5,000 patient walking to the clinic next door."
- **Risks:** Health-communication compliance (AHPRA advertising rules in AU; avoid clinical claims); clinic owners are time-poor; booking-software fragmentation.
- **Proof needed:** Demo agent trained on a real clinic's public FAQ; before/after response times.
- **Complexity:** Medium. ROI logic: recovered inquiries × avg treatment value + no-show reduction × slot value.

## O4. Bali Buyer Concierge — AI Lead Qualification & Follow-Up for Bali Real Estate

- **Target customer:** Bali real estate agencies/developers selling villas & land to foreign buyers.
- **Core pain:** Documented slow peak-season responses and ignored emails (Propertia review; TripAdvisor threads); 1,500+ listing portfolios with small teams; leads arrive 24/7 from every timezone; hiring posts show manual inquiry-conversion roles.
- **Promise:** In 14 days: every buyer inquiry qualified (budget, timeline, leasehold/freehold intent) within 2 minutes and nurtured until viewing — with full pipeline visibility for the owner.
- **Deliverables:** AI responder on WhatsApp + website forms, buyer qualification flows, listing-matching answers from inventory sheet, viewing scheduler, 6-month nurture sequences (foreign buyers have long cycles), CRM pipeline setup, listing-description content automation, training + docs.
- **Price:** $7,000–$9,000.
- **Why they pay:** Median foreign transaction ~$299k; commissions typically ~5% (assumption — verify per agency): one extra closed deal ≈ $15k. Buyers are foreign; agency revenue is USD-linked.
- **Lead sourcing:** 16 leads listed; in-person visits; agency directories.
- **Sales angle:** "Your next buyer messaged three agencies from London last night. The one that answered gets the viewing."
- **Risks:** Same legal gate as O1 for Indonesian entities; some agencies are tiny; long sales cycles delay provable ROI.
- **Proof needed:** Demo on their own listing inventory.
- **Complexity:** Medium. ROI logic: inquiries/month × qualification lift × close rate × commission.

## O5. Agency Autopilot — Client Onboarding + Reporting OS for Marketing Agencies

- **Target customer:** 5–30-person marketing/SEO/paid-media agencies (US/UK/EU/AU).
- **Core pain:** Reporting averages 8.2h/client/month; onboarding eats 10–15h/week and churn decisions form in the first two weeks; proposals take 6–8h each; agencies hire coordinators to absorb it (documented hiring posts).
- **Promise:** In 14 days: new-client onboarding runs itself (intake → access collection → kickoff), and monthly reports draft themselves with AI commentary for account-manager review.
- **Deliverables:** Automated onboarding workflow (forms, access checklist, project setup, welcome sequences), report automation pulling from ad/SEO platforms with AI-written insight drafts, proposal template automation, internal SOP assistant, training + docs.
- **Price:** $7,500–$10,000.
- **Why they pay:** At 25 clients, reporting alone ≈ a full-time employee; agencies think in billable hours and buy productized services naturally; repeat-purchase/white-label potential.
- **Lead sourcing:** 13 leads listed; Clutch directories; agencies hiring coordinators/AMs (the hiring post is the trigger).
- **Sales angle:** "You're hiring a coordinator to do what a $7.5k system does without churn or management."
- **Risks:** Agencies are sophisticated buyers (may DIY); US timezone friction; platform API variety.
- **Proof needed:** Sample auto-generated report from public/demo data.
- **Complexity:** Medium-high (many integrations). ROI logic: hours saved × loaded AM cost, plus faster onboarding = retained clients.

## O6. Support Agent Rebuild — AI Customer Support for Ecommerce Brands

- **Target:** Shopify/DTC brands with documented slow-reply complaints. **Pain:** WISMO floods, "avalanche of calls" post-sale (Blenders' own BBB admission), bad AI already deployed (Vessi "99% AI generated" complaints). **Promise:** 14 days to a support agent that resolves 40–60% of tickets correctly and hands the rest to humans with full context. **Deliverables:** AI agent on their helpdesk, order-status/returns integration, knowledge-base build, escalation design, QA dashboard, training. **Price:** $6,000–$8,000. **Why pay:** Gorgias per-ticket AI fees (~$1/resolution) and support-team cost. **Leads:** 13 listed; Trustpilot mining. **Angle:** "Your customers call your chatbot 'a joke.' Keep the bot, fix the experience." **Risks:** crowded SaaS space; brands may just buy Gorgias AI; remote trust. **Proof:** demo on their public FAQ. **Complexity:** medium. **ROI:** tickets deflected × cost/ticket.

## O7. Reservation Rescue — Direct Booking & Guest Comms for Boutique Hotels

- **Target:** Bali/SEA boutique hotels & retreats with documented reservation complaints (e.g., The Udaya "WORST RESERVATION PROCESS" review). **Pain:** direct-booking inquiries lost to slow email/forms; OTA commission dependence. **Promise:** 14 days to instant, accurate direct-booking responses on WhatsApp/web + review-response automation. **Deliverables:** AI reservation responder, rate/availability FAQ, direct-booking push flows, review response drafting, training. **Price:** $5,500–$7,500. **Why pay:** shifting 5 bookings/month from OTA (15–25% commission) to direct pays it back. **Leads:** 14 listed. **Angle:** "Every direct booking you miss goes to Booking.com — minus 20%." **Risks:** hotels with PMSs may prefer SaaS (HiJiffy ~€4/room); GM turnover. **Proof:** demo bot on their public rates. **Complexity:** medium. **ROI:** OTA commission avoided + saved reservations.

## O8. Owner Reporting & Transparency Pack — Property Managers

- **Target:** Bali villa PMs with absentee foreign owners. **Pain:** documented owner complaints about vague reports, hours-long silences, "channel hijacking" distrust. **Promise:** 7 days to automated monthly owner statements + a self-serve owner portal/chat that answers "how did my villa do?" instantly. **Deliverables:** automated owner reports (occupancy, revenue, expenses), owner Q&A assistant, escalation flows, docs. **Price:** $5,000–$6,500. **Why pay:** owner churn = losing 15–25% of a villa's revenue stream; transparency is a sales weapon for winning new owners. **Leads:** same 19 villa PM leads. **Angle:** "Win more owners by showing them what nobody else will." **Risks:** narrower pain than guest comms; data lives in messy sheets. **Proof:** sample owner report. **Complexity:** low-medium. **ROI:** one retained/new owner ≈ $5–15k/year in fees.

## O9. AI Content + CRM System — Restaurants & Beach Clubs

- **Target:** Bali restaurant groups/beach clubs. **Pain:** inconsistent social content, WhatsApp reservation chaos (Savaya's form "worse than WhatsApp"). **Promise:** 14 days to automated content pipeline + reservation capture. **Deliverables:** content system (menu/event posts drafted weekly), reservation AI on WhatsApp/IG, guest database + rebooking campaigns. **Price:** $5,000–$6,000. **Why pay:** VIP tables worth IDR 10M+; repeat-guest revenue. **Leads:** hospitality list. **Angle:** "Your VIP guests can't book a table without a fight." **Risks:** weakest ability-to-pay segment (86% single-owner; local pricing anchors at $300–600/month); seasonal cashflow. **Proof:** demo content calendar. **Complexity:** low-medium. **ROI:** weak vs. price — flagged.

## O10. Never-Miss-A-Call — AI Receptionist for AU Trades & Home Services

- **Target:** AU solar/renovation/trades companies with high lead values. **Pain:** 1-in-3 calls unanswered; ~$3,800/month lost to missed calls (industry claims, cited); owners on tools all day then quoting all night. **Promise:** 14 days to AI voice+SMS receptionist that answers, qualifies, books estimates. **Deliverables:** AI receptionist (voice + SMS fallback), calendar booking, quote-request intake, CRM logging, training. **Price:** $6,000–$7,500. **Why pay:** one solar/reno job worth $5–50k. **Leads:** 3 in AU list + directories. **Angle:** "Every missed call is a $15k job calling your competitor." **Risks:** crowded AI-receptionist SaaS market ($95–300/month alternatives — must justify DFY premium); voice AI quality bar. **Proof:** live call demo. **Complexity:** medium-high (voice). **ROI:** missed calls × close rate × job value.

## O11. Creator Ops OS — Support + Content Engine for Course Businesses

- **Target:** Course creators/coaching businesses (incl. Bali's creator scene). **Pain:** community/support overload (Mindvalley 26-email refund saga), content treadmill. **Promise:** 14 days to AI student-support agent + content repurposing pipeline. **Deliverables:** support agent on email/community, refund/FAQ handling, long-form → clips/posts/newsletter pipeline, dashboards. **Price:** $5,000–$7,000. **Why pay:** support VA replacement + churn reduction. **Leads:** creator list; Bali coworking scene. **Angle:** "Scale support without killing your DMs." **Risks:** barbell income (most can't pay); high-touch expectations. **Proof:** demo on their public course FAQ. **Complexity:** low-medium. **ROI:** VA cost + retained students.

## O12. Founder Knowledge OS — Internal AI Assistant for SMB Operations

- **Target:** 10–50-person service SMBs with founder bottleneck. **Pain:** documented founder overload (UK electrician: 4–5h/night paperwork); scattered SOPs; every question routes through the owner. **Promise:** 14 days to an internal assistant answering from the company's own docs + automated document generation (quotes, invoices, certificates). **Deliverables:** knowledge-base build from existing docs, internal Q&A assistant, 2–3 document-automation workflows, training. **Price:** $5,000–$7,000. **Why pay:** founder time is the scarcest asset. **Leads:** hardest to identify externally (pain is invisible from outside). **Angle:** "Stop being your company's search engine." **Risks:** diffuse pain, hard to find buyers showing it publicly, ROI fuzzy. **Proof:** demo on public docs. **Complexity:** medium. **ROI:** founder hours reclaimed.
