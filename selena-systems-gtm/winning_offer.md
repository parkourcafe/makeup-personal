# Winning Offer — The Villa Ops OS™

**A 14-day AI implementation sprint that makes sure no guest inquiry, booking request, or owner question ever waits again.**

Selected unanimously by all 3 tournament judges (see `idea_tournament.md`), rebuilt with their mandated modifications: entity screening as Task Zero, honest v1 scope, and a trust-laddered payment structure.

---

## 1. Offer name

**Villa Ops OS — AI Guest & Lead Response System** (working name; "Never Miss a Booking" is the plain-English campaign line).

## 2. Positioning

Selena Systems builds AI-powered operating systems for growing businesses. This offer is the hospitality edition: a **done-for-you implementation** — not consulting, not a chatbot subscription — built directly on the stack Bali villa companies actually run (WhatsApp + spreadsheets + OTA dashboards), which is exactly the stack global guest-messaging SaaS can't connect to (they all assume a PMS like Guesty/Hostaway — competitor analysis in `research/raw/competitors-vertical.json`). Fixed price, fixed scope, live in 14 days, published openly — which almost no credible implementation shop does (`research/raw/competitors-global.json`).

## 3. Target customer

Villa management / property management companies in Bali managing **15–150 villas**, plus boutique villa collectives — prioritizing **foreign-owned operations that bill through a non-Indonesian entity** (see Task Zero below). Decision maker: owner or general manager. 65 Bali-regional candidates already in `lead_list.csv`.

## 4. The painful problem

- Inquiries arrive 24/7 from every timezone (Sydney at 2am Bali time, Berlin at 11pm) across WhatsApp, OTA messages, Instagram, email, and web forms — and sit unanswered for hours. Documented: Bali reservation-agent job posts specify managing inquiries across all these channels with "respond within 6 working hours" SLAs ([HHRMA](https://hhrmahotelbali.com/tag/reservation-agent), [Glassdoor Canggu listings](https://www.glassdoor.sg/Job/canggu-villa-manager-jobs-SRCH_IL.0,6_IC4374635_KO7,20.htm)).
- Slow first response loses the booking: replying within 5 minutes makes qualification ~21x more likely ([speed-to-lead research](https://www.chilipiper.com/article/speed-to-lead-statistics)); a documented Bali case shows a 50-minute reply delay costing a customer and earning a 1-star review ([TripAdvisor](https://www.tripadvisor.com/Attraction_Review-g1025508-d11773456-Reviews-Fastboat_Bali_Gili-Mengwi_Bali.html)).
- It's existential now: Bali has ~45–46k rental listings, occupancy ~53%, ADR −14%, revenue −16% in 2025 — while well-run villas still hit 70–80% occupancy ([market data](https://investlandbali.com/bali-real-estate-market)). Conversion speed is what separates the two groups.
- The current fix is hiring more humans — a recurring salary plus training and churn for coverage that still sleeps at night.

## 5. Why now

Oversupply is squeezing every operator's revenue *this season*; guests book whoever answers first; and the tooling to fix it (WhatsApp Business API + modern AI) became reliable and cheap only in the last ~2 years. Competitors' SaaS can't serve the no-PMS majority, and no local implementer publishes fixed prices or credible proof — the window to be first with referenceable delivery in a tight, word-of-mouth expat market is open now.

## 6. What gets built (deliverables)

**Core sprint (the promise):**
1. **AI first responder on WhatsApp Business API** — answers every inquiry within ~2 minutes, 24/7, in English + Bahasa Indonesia (+ 1 more guest language), with accurate answers about villas, rates, availability windows, policies, transfers, and area questions — from an approved knowledge base built with you.
2. **Availability & pricing sync** — the agent reads from your existing availability source (sheet, channel-manager export, or calendar) so it never quotes blind. If data is too messy to sync safely, the agent collects the request and routes it — it never invents rates. (Anti-hallucination guardrail, in writing.)
3. **One pipeline for every lead** — every conversation (WhatsApp, web form, IG) captured into a simple CRM pipeline with status, source, and value; nothing lives only in a staff member's personal phone.
4. **Human escalation rules** — anything the AI shouldn't handle (complaints, negotiations, VIPs) is handed to your team instantly with full context; you define the lines, we implement them.
5. **Response-time dashboard** — before/after proof: median first-response time, inquiries handled out-of-hours, leads captured.

**Fast-follow (included, weeks 2–4, post-launch):**
6. Guest journey messages — pre-arrival info, in-stay check-in, checkout + review request flows.
7. Owner reporting automation — monthly owner statement drafts from your booking data.

**Handover:** 90-minute team training (recorded), full written documentation, and 30 days of post-launch support.

## 7. Timeline — the 14-day sprint

| Days | Milestone |
|---|---|
| 0 | Kickoff: access checklist + knowledge-base workshop (2h) |
| 1–3 | WhatsApp Business API setup, knowledge base v1, CRM pipeline |
| 4–7 | AI responder live in shadow mode (drafts answers, humans approve) |
| 8–10 | Supervised go-live on real inquiries; escalation tuning |
| 11–13 | Availability/pricing sync hardening, dashboard, edge cases |
| 14 | Live handover: training, docs, before/after numbers |

(Shadow mode → supervised → autonomous is the safety ladder; WhatsApp API provisioning starts day 0 because it has external lead time.)

## 8. Pricing

- **Villa Ops OS:** **$7,500** fixed (portfolios up to ~50 villas); **$9,500** for 50–150 villas / multi-brand.
- **Founding-client terms (first 3 clients only):** **$5,000**, in exchange for a written case study + referral introductions. Say this openly — it's the honest trade for missing proof.
- **Payment structure:** $1,500 to start (covers days 0–7 through shadow mode) → balance at go-live (day 10) → nothing held hostage: documentation and access are the client's regardless. This is the judge-mandated trust ladder; see `sales_call_script.md` §9 for reasoning vs. 50/50.
- Client pays own tool costs (WhatsApp API/BSP fees, AI API usage, CRM if any — typically $50–150/month; stated upfront).

## 9. Guarantee / risk reversal

**The Shadow-Mode Guarantee:** if by day 7 the AI's draft answers aren't good enough that you'd let them send (as judged by you), you can stop and pay only the $1,500 starter — no balance due. No revenue promises, no fake certainty: the guarantee is about the system working, which Selena controls, not market outcomes, which it doesn't.

## 10. Onboarding process

1. 15-min qualification call (incl. **billing-entity check — Task Zero**, see §17)
2. Paid start ($1,500) + onboarding form (villas, channels, policies, FAQs, tone)
3. Access checklist (below) completed by client, day 0–1
4. 2-hour knowledge-base workshop (their expertise → the agent's brain)
5. Sprint per timeline; daily WhatsApp check-in from Selena

## 11. Required access from client

- WhatsApp Business number (or new number for the API — decided at kickoff)
- Availability/pricing source (sheet, channel manager login, or export)
- Website form destination / Instagram business account (if in scope)
- FAQ material, house rules, rate cards, transfer policies
- One decision-maker reachable daily during the sprint (15 min/day)

## 12. Tools likely used

WhatsApp Business API via a BSP (e.g., 360dialog/Twilio), Claude/OpenAI API for the agent, Make/n8n for orchestration, Google Sheets/Airtable as data layer, a lightweight CRM (Airtable/HubSpot free/Pipedrive — whatever fits), simple dashboard (Looker Studio/Airtable). Client's own accounts, client's own data — Selena holds no hostage infrastructure.

## 13. What's included / not included

**Included:** everything in §6; 30 days post-launch fixes; training + docs; up to 2 languages beyond English.
**Not included:** PMS/channel-manager migration; OTA account management; paid ads; content marketing; voice/phone AI; ongoing maintenance after 30 days (offered separately at $250–500/month — the upsell path); custom mobile apps.

## 14. Expected ROI logic (honest math, filled with client numbers on the call)

- Their inputs: inquiries/month (I), % arriving out-of-hours or answered >1h late (L), booking conversion (C), average booking value (V).
- Recovered revenue ≈ I × L × (conversion lift on fast response) × V. Even assuming a conservative lift fraction of the documented 21x/5-min effect, one mid-size operator's 2 extra bookings/month typically exceeds the monthly-equivalent cost of the system within a quarter.
- Cost comparison: a reservation agent ≈ $250–400/month salary (documented Bali range) but covers ~8h/day, churns, and needs management; the system covers 24/7 and the fee is one-time.
- We commit only to operational metrics we control: median first response <2 min, 100% of leads in one pipeline, out-of-hours coverage. Revenue effects are modeled, never promised.

## 15. Objections & responses (full handling in `sales_call_script.md`)

| Objection | Response (short form) |
|---|---|
| "No case studies?" | Correct — that's why founding-client pricing and the shadow-mode guarantee exist: you judge the quality on your own inquiries before the balance is due. |
| "AI will say something wrong to my guests." | It answers only from your approved knowledge base; if unsure, it hands off. You watch it draft for 7 days before it sends anything. That guardrail is in the contract. |
| "We have staff for this." | Keep them — the AI takes the 2am Sydney inquiry and the 40 repeat questions a day; your staff take the judgment calls. Ask your team what they'd do with those hours. |
| "Too expensive for Bali." | It's priced against the revenue of missed bookings, not against local salaries: what do 3 lost bookings a month cost across your portfolio? |
| "Why not just buy a SaaS bot?" | The SaaS bots need a PMS you don't run and a team to configure them — self-configured bots plateau (30–50% automation, industry data). This is done-for-you on your actual stack. |
| "How do I know you'll finish?" | Fixed scope in writing, $1,500 starts, balance only at go-live, and everything is built in your accounts, not mine. |

## 16. Proof strategy (zero → credible in 30 days)

1. **Day 0 asset:** demo agent built on a public villa listing + a 3-minute Loom "secret shop" audit per prospect (I inquired at 9pm; here's what happened; here's what the fixed version does — live).
2. **Founding client #1:** case study clause in contract; before/after response-time dashboard is the proof artifact (operational metrics, publishable without revenue disclosure).
3. **Weeks 3–4:** written case study + referral intros (contractual) + reviews on Google/LinkedIn.
4. This case study is the explicit unlock for Backup Offer O2 (Dubai) — same speed-to-lead story, richer market.

## 17. Task Zero — the legal gate (do this before selling)

A foreigner on an E33G remote-worker KITAS or tourist visa may not serve/invoice Indonesian clients ([source](https://www.balivisas.com/kitas/e33g-remote-worker-visa-digital-nomad/); full analysis in `market_research.md` §2 and `red_team_report.md` R1). Therefore, **before outreach**:
1. Get 1 hour of Indonesian legal advice (~$100–500) on the founder's exact visa/entity situation.
2. Screen the 65-lead list for operations that bill through non-Indonesian entities (common among foreign-owned villa brands — but verify per client; treat as ASSUMPTION until confirmed).
3. Go/no-go: if fewer than ~8–10 leads are compliantly billable, flip the sequence — lead with Backup Offer O2 (Dubai, legally clean) and treat Bali as relationship-building until an entity exists.

## 18. First 100 leads strategy

- **Now:** 65 Bali-regional leads in `lead_list.csv` (villa PMs, plus adjacent hospitality/real estate/clinics for referral routing) + 57 remote.
- **Refill sources:** Google Maps ("villa management Seminyak/Canggu/Ubud/Uluwatu" — work outward by area), OTA search (companies managing many listings), HHRMA job board (anyone hiring reservation staff = live pain), Bali expat/business Facebook groups (public), coworking notice boards, BHA/BVA association member lists.
- **Motion:** 10 in-person visits/day on a geographic circuit + 10 personalized WhatsApp/IG/email contacts/day from the list; every meeting ends with a referral ask (script in `outreach_scripts.md` §9). The circuit doubles for Backup Offer O4 (real estate agencies on the same streets).
