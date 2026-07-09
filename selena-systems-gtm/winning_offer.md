# Winning Offer — The Villa Ops OS™

**A 14-day AI implementation sprint that ends slow, scattered guest-inquiry handling.**

Selected unanimously by all 3 tournament judges (see `idea_tournament.md`), rebuilt with their mandated modifications (entity screening, honest v1 scope, trust-laddered payment), then revised again after the red team (`red_team_report.md`) — revision notes marked ⚑.

---

## 1. Offer name

**Villa Ops OS — AI Guest & Lead Response System** (working name; "Never Miss a Booking" is the plain-English campaign line).

## 2. Positioning

Selena Systems builds AI-powered operating systems for growing businesses. This offer is the hospitality edition: a **done-for-you implementation** — not consulting, not a chatbot subscription — built directly on the stack villa companies actually run (WhatsApp + spreadsheets + OTA dashboards), which is exactly the stack global guest-messaging SaaS can't connect to (they all assume a PMS like Guesty/Hostaway — competitor analysis in `research/raw/competitors-vertical.json`). Fixed price, fixed scope, live in 14 days, published openly — which almost no credible implementation shop does (`research/raw/competitors-global.json`).

**The standard SLA claim (use this wording everywhere ⚑R9):** *"95% of inquiries get a useful first response within 2 minutes — median under 60 seconds — and anything the AI can't handle reaches your team within the same window."* Never say "every inquiry, ever" in writing.

## 3. Target customer

Villa management / property management companies in Bali managing **15–150 villas**, plus boutique villa collectives. Decision maker: owner or general manager.

**Lead reality (⚑R3):** `lead_list.csv` contains **19 villa-PM leads** that are this offer's exact ICP, plus 46 adjacent Bali-regional leads (16 real estate → Backup 1's circuit, 14 hospitality → secondary ICP, 16 clinics → **referral routing only**, since offer O3 was dropped). Before launch, run the §18 refill motion to bring villa-PM leads to **≥50** — at 19 leads the funnel math is a coin flip; at 50+ it's a plan.

## 4. The painful problem

- Inquiries arrive 24/7 from every timezone — Berlin and London guests inquire at 10pm–2am Bali time, Australians at 5–7am — across WhatsApp, Instagram, email, and web forms, and sit unanswered for hours. (⚑R19 timezone math corrected.) Documented: Bali reservation-agent job posts specify managing inquiries across all these channels with "respond within 6 working hours" SLAs ([HHRMA](https://hhrmahotelbali.com/tag/reservation-agent), [Glassdoor Canggu listings](https://www.glassdoor.sg/Job/canggu-villa-manager-jobs-SRCH_IL.0,6_IC4374635_KO7,20.htm)).
- Slow first response loses the booking: replying within minutes makes a lead dramatically more likely to convert than replying after 30+ minutes ([speed-to-lead research](https://www.chilipiper.com/article/speed-to-lead-statistics); note ⚑R14 — the famous "21x" figure is a 2007-era US phone-lead *qualification* study: use it internally, hedge it in copy). A documented Bali case shows a 50-minute reply delay costing a customer and earning a 1-star review ([TripAdvisor](https://www.tripadvisor.com/Attraction_Review-g1025508-d11773456-Reviews-Fastboat_Bali_Gili-Mengwi_Bali.html) — a tour operator, cited as an adjacent-vertical illustration ⚑R14; replace with the villa-specific examples your first secret shops will produce).
- **OTA messages are handled separately (⚑R5):** Airbnb/Booking.com messaging APIs are restricted to approved PMS partners, and this offer deliberately targets no-PMS operators. The system covers WhatsApp, website, Instagram, and email; OTA inquiry *email notifications* can be parsed into the pipeline where the OTA sends them; native OTA chat stays in the OTA apps (which already auto-acknowledge). Say this proactively in every sales conversation — volunteering the boundary is a credibility win.
- It's existential now: Bali has ~45–46k rental listings, occupancy ~53%, ADR −14%, revenue −16% in 2025 — while well-run villas still hit 70–80% occupancy ([market data](https://investlandbali.com/bali-real-estate-market)).
- The current fix is hiring more humans — a recurring salary plus training and churn for coverage that still sleeps at night.

## 5. Why now

Oversupply is squeezing every operator's revenue *this season*; guests book whoever answers first; and the tooling to fix it (WhatsApp Business API + modern AI) became reliable and cheap only in the last ~2 years. Competitors' SaaS can't serve the no-PMS majority, and no local implementer publishes fixed prices or credible proof — the window to be first with referenceable delivery in a tight, word-of-mouth expat market is open now. (⚑R16 caveat: this wedge is a snapshot, not a law — SaaS vendors are adding AI and lighter onboarding. The durable moat is speed, accountability, and the cross-client playbook; see §13a.)

## 6. What gets built (deliverables)

**Core 14-day sprint (the promise):**
1. **AI first responder on WhatsApp Business API** — meets the §2 SLA, 24/7, in English + Bahasa Indonesia (+ 1 more guest language), answering about villas, rates, availability windows, policies, transfers, and area questions — from an approved knowledge base built with you.
2. **Availability & pricing sync** — the agent reads from your existing availability source (sheet, channel-manager export, or calendar) so it never quotes blind. If data is too messy to sync safely, the agent collects the request and routes it — it never invents rates. (Anti-hallucination guardrail, in writing.)
3. **One pipeline for covered channels** — every conversation from WhatsApp, web forms, Instagram, and email (incl. parsed OTA notification emails where available ⚑R5) captured into a simple CRM pipeline with status, source, and value; nothing lives only in a staff member's personal phone.
4. **Human escalation rules** — anything the AI shouldn't handle (complaints, negotiations, VIPs) is handed to your team instantly with full context; you define the lines, we implement them.
5. **Response-time dashboard** — before/after proof: median first-response time, inquiries handled out-of-hours, leads captured — plus WhatsApp quality-rating monitoring (⚑R4).

**Included fast-follow (delivered days 15–30, inside the support window ⚑R7):**
6. Guest journey messages — pre-arrival info, in-stay check-in, checkout + review request flows. **Policy note (⚑R4):** proactive WhatsApp messages require guest opt-in and Meta-approved templates; opt-in capture is built into the booking flow, templates are submitted for approval during the sprint, and email is the fallback channel where opt-in is absent.
7. Owner reporting automation — monthly owner statement drafts from your booking data.

**Handover:** 90-minute team training (recorded), full written documentation, and 30 days of post-launch support.

## 7. Timeline — the 14-day sprint

**Day 0 is defined as: starter paid AND WhatsApp Business API approved AND access checklist complete (⚑R8).** The API application is filed at contract signing, so Meta's verification queue never eats sprint days. Default architecture: a **new dedicated API number**, with the existing number auto-replying/forwarding to it; migrating a live primary number is opt-in only, with a written risk paragraph.

| Days | Milestone |
|---|---|
| Signing → day 0 | API application, entity/verification docs, access checklist (client-side, off the clock) |
| 0 | Kickoff: knowledge-base workshop (2h) |
| 1–3 | Agent build, knowledge base v1, CRM pipeline, opt-in/template submissions |
| 4–7 | AI live in shadow mode (drafts answers, humans approve) |
| 8–10 | Supervised go-live on real inquiries; escalation tuning |
| 11–13 | Availability/pricing sync hardening, dashboard, edge cases |
| 14 | Live handover: training, docs, before/after numbers |

## 8. Pricing

- **Villa Ops OS:** **$7,500** fixed (portfolios up to ~50 villas); **$9,500** for 50–150 villas / multi-brand.
- **Founding-client terms (first 2 clients):** **$5,000**, in exchange for a written case study + two referral introductions. **Client #3 pays $6,500** — the deliberate step that tests the price ladder before the $7,500 list price must hold (⚑R12).
- **Payment structure:** **$2,000 to start** (⚑R13 — priced to cover the real cost of days 0–7) → balance at go-live → nothing held hostage: documentation and data are the client's regardless.
- **Go-live is objectively defined (⚑R13):** day 10, or when the shadow-mode acceptance gate is passed, whichever is later — but no later than day 17 absent a written defect list. Balance is due then.
- Client pays own tool costs (WhatsApp API/BSP fees, AI API usage, CRM if any — typically $50–150/month; stated upfront).

## 9. Guarantee / risk reversal

**The Shadow-Mode Guarantee:** if by day 7 the AI's draft answers aren't good enough that you'd let them send, you can stop and pay only the starter — no balance due. **The day-7 gate is measured, not vibes (⚑R18):** the scripted 40-inquiry intent suite per language (pass/fail per intent) plus whatever real inquiries arrived, with a target of ≥80% of drafts approved unedited. **On a stop, you keep your knowledge-base content and your data (they're yours); the configured agent and prompt system are not handed over (⚑R13).** No revenue promises: the guarantee covers what Selena controls (the system working), not market outcomes.

## 10. Onboarding process

1. 15-min qualification call (incl. **billing-entity check — Task Zero**, see §17)
2. Signing + starter payment + **API application filed same day** + onboarding form
3. Access checklist completed by client (pre-day-0)
4. 2-hour knowledge-base workshop (their expertise → the agent's brain)
5. Sprint per timeline; daily 15-min WhatsApp check-in

## 11. Required access from client

- WhatsApp: dedicated API number provisioned (default), or written opt-in to migrate an existing number
- Business registration/verification documents for Meta Business verification (⚑R8 — request at signing, it's the long pole)
- Availability/pricing source (sheet, channel manager login, or export)
- Website form destination / Instagram business account (if in scope)
- FAQ material, house rules, rate cards, transfer policies
- One decision-maker reachable ~15 min/day during the sprint

## 12. Tools likely used

WhatsApp Business API via a BSP (e.g., 360dialog/Twilio), Claude/OpenAI API for the agent, Make/n8n for orchestration, Google Sheets/Airtable as data layer, a lightweight CRM (Airtable/HubSpot free/Pipedrive — whatever fits), simple dashboard (Looker Studio/Airtable). Client's own accounts, client's own data — Selena holds no hostage infrastructure. Data-processing terms, subprocessor list, liability cap, and IP ownership are in the proposal's legal annex (⚑R10).

## 13. What's included / not included

**Included:** everything in §6; 30 days post-launch fixes; training + docs; up to 2 languages beyond English.
**Not included:** native OTA chat integration (Airbnb/Booking APIs are PMS-gated — email-notification parsing only ⚑R5); PMS/channel-manager migration; OTA account management; paid ads; content marketing; voice/phone AI; ongoing maintenance after 30 days (Care Plan, $400–600/month — see §13a); custom mobile apps.

### 13a. Competitive response & the real moat (⚑R16)

Cheap local devs can copy a delivered system; SaaS will keep adding AI. The moat is not the tech: it's (1) speed — live in 14 days while alternatives are evaluated; (2) accountability — one throat to choke on a fixed scope; (3) the compounding cross-client playbook (every install makes the next one better and faster); and (4) the relationship — **target ≥60% Care Plan attach at handover** ($400–600/month: monitoring, tuning, quality-rating watch, monthly metrics report) so revenue compounds before the implementation gap narrows.

## 14. Expected ROI logic (honest math, filled with client numbers on the call)

- Their inputs: inquiries/month (I), % arriving out-of-hours or answered >1h late (L), booking conversion (C), average booking value (V).
- Recovered revenue ≈ I × L × C × U × V where U is an uplift **the client chooses** (suggest a conservative 10–25%, citing that fast responses convert dramatically better — sources in `market_research.md` §1, vintage stated).
- Cost comparison: a reservation agent ≈ $250–400/month salary (documented Bali range) but covers ~8h/day, churns, and needs management; the system covers 24/7 and the fee is one-time.
- We commit only to operational metrics we control: the §2 SLA, 100% of covered-channel leads in one pipeline, out-of-hours coverage. Revenue effects are modeled, never promised.

## 15. Objections & responses (full handling in `sales_call_script.md`)

| Objection | Response (short form) |
|---|---|
| "No case studies?" | Correct — that's why founding-client pricing and the shadow-mode guarantee exist: you judge the quality on your own inquiries before the balance is due. |
| "AI will say something wrong to my guests." | It answers only from your approved knowledge base; if unsure, it hands off. You watch it draft for 7 days before it sends anything. That guardrail is in the contract. |
| "We have staff for this." | Keep them — the AI takes the 1am Berlin inquiry and the 40 repeat questions a day; your staff take the judgment calls. |
| "Too expensive for Bali." | It's priced against the revenue of missed bookings, not against local salaries: what do 3 lost bookings a month cost across your portfolio? |
| "Why not just buy a SaaS bot?" | The SaaS bots need a PMS you don't run and a team to configure them — self-configured bots plateau (30–50% automation, industry data). This is done-for-you on your actual stack. |
| "What about our Airbnb messages?" | Volunteered before they ask (⚑R5): native OTA chat is API-locked to PMS vendors; we cover everything else and parse OTA email notifications into your pipeline where available. |
| "How do I know you'll finish?" | Fixed scope in writing, $2,000 starts, balance only at objectively-defined go-live, and everything is built in your accounts, not mine. |

## 16. Proof strategy (zero → credible in 30 days)

1. **Day 0 asset:** demo agent built on a public villa listing + a 3-minute Loom "secret shop" audit per prospect (ethics rules in `outreach_scripts.md` §10 ⚑R14).
2. **Founding client #1:** case study clause in contract; before/after response-time dashboard is the proof artifact (operational metrics, publishable without revenue disclosure).
3. **Weeks 3–4:** written case study + referral intros (contractual) + reviews on Google/LinkedIn.
4. This case study is the explicit unlock for Backup Offer O2 (Dubai) — same speed-to-lead story, richer market.

## 17. Task Zero — the legal gate (⚑R1/R11 — rewritten; this gates EVERYTHING)

**This is a founder-activity question, not a lead-screening question.** A foreigner on an E33G remote-worker KITAS or tourist visa may not work or conduct business activity in Indonesia — and **the selling activity itself (walk-ins, discovery meetings, paid on-site implementation) can be the violation, regardless of which entity is invoiced or where the money lands**. Also: a PT PMA is *still an Indonesian entity* — "foreign-owned" ≠ "non-Indonesian client" — and Bank Indonesia's mandatory-rupiah rule applies to genuinely domestic transactions. Immigration enforcement in Bali is real (raids, deportation, bans).

**Task Zero, in order, with a decision date of day 2:**
0. **Billing entity (gates Dubai too ⚑R11):** confirm Selena can invoice international clients through a real legal entity (existing company, or fast options: US LLC / UK Ltd / Estonia e-residency / UAE freelance permit — the last also strengthens the Dubai motion). Fill the proposal's ⟨entity⟩ blank before any outreach.
1. **Founder-activity consult:** 1 hour with an Indonesian business/immigration lawyer (~$100–500). The question is *"On my exact visa, may I conduct in-person sales meetings and perform paid implementation work while physically in Indonesia — and under what structure would it be legal?"* (Compliant paths to price out: Investor KITAS + PT PMA; a local partner entity that contracts clients and subcontracts Selena's offshore entity; or serving only clients whose *contracting* entity is genuinely foreign — rare, verify per client, never assume.)
2. **Plan for "no."** Default assumption until the consult says otherwise: **no walk-in selling, no local pitching.** In that case Backup Offer O2 (Dubai) is primary from day 1, and Bali becomes relationship-building only — coworking, coffees, referrals, no pitching, no paper. The in-person advantage was the tournament's deciding argument for O1 over O2 (they tied 96–96 on market scores), so **if in-person selling is off the table, the decision flips to O2 with no further debate** (`idea_tournament.md` sensitivity note).

## 18. First 100 leads strategy — with honest funnel math (⚑R3/R6/R12)

**Inventory now:** 19 villa-PM leads (the ICP) + 14 Bali hospitality (secondary) + 16 Bali real estate (Backup 1 circuit) + 16 Bali clinics (referral routing only) + 57 remote (16 Dubai = Backup 2, 41 others).

**Refill to ≥50 villa-PM leads before/while launching:** Google Maps by area ("villa management Seminyak/Canggu/Ubud/Uluwatu"), HHRMA job board (anyone hiring reservation staff = live pain + open budget), OTA multi-listing operators, BHA/BVA association lists, expat business groups (public).

**Funnel targets & pivot triggers (weekly operating dashboard):**
- Weekly: 25 first touches · 8 audit videos delivered · 3 discovery calls · 1 proposal out
- Expected conversion (assumptions, to be replaced by real data): touches→audit accepted ~30% · audit→discovery ~35% · discovery→proposal ~60% · proposal→close ~35%. At those rates, ~50 touches ≈ 1 close — hence the ≥50-lead requirement.
- **Pivot triggers:** <2 discovery calls by day 14 → promote Backup 1 (same circuit) to co-primary. No signed founding client by day 30 → Dubai (O2) becomes primary. Task Zero returns "no" → Dubai primary immediately (§17).

**Sales capacity rules (solo founder — mirrors delivery §10 ⚑R6):**
- Pre-launch week: demo agent + first 5 audits. Steady state: **3–4 in-person visits OR 3 video audits per day** (not 10+10), plus ~10 light-touch follow-ups.
- Dubai async track: capped at 3 audits/week until the Bali question resolves (or uncapped if Dubai is primary).
- During a delivery sprint: outreach drops to follow-ups only. Max 2 overlapping sprints, kickoffs ≥1 week apart.
