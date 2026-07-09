# RED TEAM REPORT — Selena Systems GTM Package (draft)

**Date:** 2026-07-09 · **Scope:** full package attack across market choice, pricing, closeability, lead quality, outreach, delivery, trust/proof, legal/compliance, competition, founder fit, Bali-first hybrid strategy, and cross-document contradictions. No new web research performed; this audits the package against itself and against known platform/legal realities as of the analyst's knowledge.

**Overall verdict:** This is an unusually honest, well-constructed package whose sales machinery (trust ladder, shadow-mode guarantee, secret-shop audits) is genuinely strong — but it is built on a legal foundation it has already half-admitted is cracked, a lead list that doesn't actually match the winning offer, and a WhatsApp dependency whose platform-policy risks are never addressed. Fix the top five issues before day 1 of outreach; most fixes are edits, not rebuilds.

---

## Issues (ordered by severity, descending)

### R1 — The legal gate is deeper than Task Zero admits, and it undermines the tournament's deciding argument. **Severity: 9**

**Issue.** Task Zero (winning_offer.md §17) treats the Indonesia visa/entity problem as a *lead-screening* problem: find villa PMs that "bill through a non-Indonesian entity" and you're clean. Three holes:

1. **The offshore-billing pool is probably a mirage.** A company that manages villas, collects rent, and employs staff in Bali must operate through an Indonesian legal entity (local PT or PT PMA) to do so lawfully — and a PT PMA is *still an Indonesian entity*. "Foreign-owned" ≠ "non-Indonesian entity." The lead list's own size_hints show the villa batch skews local (e.g., Bali Familia is explicitly a "locally owned, licensed PT"; Nagisa, BMV, etc.). The assumption that "many villa PM brands bill through offshore companies" is flagged as an ASSUMPTION but the entire go/no-go (≥8–10 billable of only 19 villa PM leads — see R3) is stacked on it.
2. **The selling activity itself is the violation, not just the invoice.** Walking into 10 Bali offices a day, handing over audit one-pagers, running discovery meetings, and doing paid implementation work on-site is conducting business activity in Indonesia. On a tourist visa or E33G that is prohibited *regardless of which entity gets invoiced or where the money lands*. Bali immigration actively enforces against foreigners working on wrong visas (raids, deportation, bans). Routing the invoice through Singapore does not make the Canggu walk-in legal.
3. **Knock-on contradiction:** the tournament chose O1 over O2 (they tied 96–96 in market_scores.csv) almost entirely on the in-person, speed-to-first-check advantage (J1: 82 vs 61). If in-person selling is itself the prohibited activity, the keystone of the O1-over-O2 ranking dissolves and O2 Dubai should arguably already be primary. Also note: Bank Indonesia's mandatory-rupiah rule for domestic transactions conflicts with "price in USD" for any genuinely Indonesian counterparty.

**Fix.** (a) Reframe Task Zero from "screen leads" to "screen the founder": the 1-hour legal consult must answer *"may I, on my visa, conduct in-person sales meetings and perform paid work physically in Indonesia at all?"* — and make it a hard blocking gate with a named decision date (e.g., day 2). (b) Change the default assumption: plan for the legal consult to say "no walk-in selling," in which case Dubai (O2) is primary from day 1 and Bali becomes networking/referral/relationship-building only (coffee, coworking, no pitching, no paper). (c) Add the realistic compliant paths with costs/timelines: Investor KITAS + PT PMA, a local partner entity that contracts and subcontracts Selena offshore, or serving only clients whose *contracting* entity is genuinely foreign (rare — verify, don't assume). (d) Correct the "many bill offshore" claim to reflect that a PT PMA is an Indonesian client.
**Files:** winning_offer.md (§17, §18), market_research.md (§2, §6), idea_tournament.md (note on decision sensitivity), assumptions.md (add explicit founder-visa assumption), backup_offers.md (promote-O2 trigger).

---

### R2 — The package violates its own compliance rail: the landing page and outreach scripts publicly market to Indonesian businesses before the entity question is resolved. **Severity: 8**

**Issue.** market_research.md §6 states plainly: "do not publicly market services to Indonesian entities until the entity question is resolved." Yet landing_page_copy.md is exactly that artifact — "Selena Systems · Bali," hero and copy aimed squarely at "villa management companies" in Bali, founding-client pricing for them, a contact form sized in villas — and outreach_scripts.md §4/§8 are cold WhatsApp and walk-in scripts to local Bali businesses gated only by a note to finish Task Zero first. If Task Zero returns "Indonesian entities are off-limits" (likely per R1), the landing page as written is publishable evidence of soliciting work the founder cannot legally do, in a jurisdiction that enforces.

**Fix.** Gate publication explicitly: add a header to landing_page_copy.md ("DO NOT PUBLISH until Task Zero resolves; if unresolved, use variant B") and write variant-B positioning that is legally safe either way — e.g., "AI response systems for hospitality and real-estate operators" targeted at international/Dubai clients, with Bali as the founder's base rather than the served market. Move the villa-specific page behind the entity decision. Same gating banner on outreach_scripts.md §4/§8.
**Files:** landing_page_copy.md, outreach_scripts.md, winning_offer.md §16 (proof strategy references the audit-as-portfolio motion that also needs this gate).

---

### R3 — The lead list does not match the winning offer: 19 villa-PM leads, not "65," and the best documented-pain leads belong to dropped or backup offers. **Severity: 7**

**Issue.** candidate_offers.md O1 and winning_offer.md §3 both cite "65 Bali leads / 65 Bali-regional candidates" for the villa offer. The actual composition of the 65 bali_regional rows: **19 bali-villas, 16 bali-clinics, 16 bali-realestate, 14 bali-hospitality.** Only 19 leads are the winning offer's ICP. Consequences: (a) the Task-Zero go/no-go threshold of "≥8–10 compliantly billable leads" requires **~50% of the villa list** to pass an entity screen the package itself calls an assumption — improbable per R1; (b) the only two priority-10 leads (Rejuvie — clinics, *dropped offer O3*; Propertia — Backup 1) don't belong to the winning offer at all; (c) villa-PM pain evidence is mostly *inferred* (job posts, M2 assumption) rather than documented complaints — the vivid anecdotes in winning_offer.md §4 (Fastboat Bali Gili's 50-minute WhatsApp delay) are borrowed from adjacent verticals, and 16 of the 65 Bali leads belong to an offer the tournament ruled fatally flawed.

**Fix.** (a) Correct the "65 leads" claim to "19 villa-PM leads + 46 adjacent Bali leads (referral routing + Backup 1)" everywhere it appears. (b) Before launch, run the §18 refill motion (Google Maps by area, HHRMA hiring posts, OTA multi-listing operators) to get villa-PM leads to ≥50 so the funnel math survives screening losses. (c) Add honest funnel math to winning_offer.md §18: 19 leads → entity screen → reachable decision-makers → meetings → 1 close is a coin flip; 50+ leads makes it a plan. (d) Re-label the clinic leads as referral-only (consistent with the O3 drop).
**Files:** winning_offer.md (§3, §18), candidate_offers.md (O1 lead sourcing), lead_list.csv (tag villa-PM rows distinctly), backup_offers.md.

---

### R4 — WhatsApp platform policy is an unexamined single point of failure — for the outreach channel AND the product itself. **Severity: 7**

**Issue.** The entire package (outreach, delivery, ongoing product) runs on WhatsApp, and no document addresses Meta's rules:

1. **Cold outreach ban risk.** outreach_scripts.md §4 sends unsolicited commercial WhatsApp messages to businesses. WhatsApp's ToS prohibits unsolicited bulk/commercial messaging; a handful of "report/block" taps can get the founder's personal number banned — the same number that is her sales channel, delivery check-in channel, and identity ("my WhatsApp is on there").
2. **Product-side policy constraints, worse.** The WhatsApp Business API's 24-hour customer-service window means the AI can freely answer *inbound* inquiries (fine — that's the core), but everything proactive that the offers promise — **90-day nurture sequences (Backup 2's headline deliverable), 6-month buyer nurture (Backup 1), pre-arrival/checkout guest-journey flows, review requests, no-show reminders** — requires opt-in plus Meta-approved template messages, per-message template fees, and lives under Meta's most restricted and actively-tightened category (marketing templates have been throttled/paused in some regions; quality-rating drops can freeze the number). A portal lead who messaged once has not opted into 90 days of automated follow-up; that flow as described is a policy violation waiting for a ban — on the *client's* number, mid-engagement, after Selena promised "no inquiry ever waits again."
3. Secondary: UAE PDPL/telemarketing rules and Indonesian PDP Law both touch automated marketing messaging; neither is mentioned.

**Fix.** (a) Outreach: prefer email/LinkedIn/in-person(-if-legal)/warm referral for first touch; use WhatsApp only after any inbound reply or published-for-business-inquiries numbers, one message, immediate opt-out honored (partially present in §5 — make it explicit policy). (b) Product: add a "WhatsApp policy architecture" section to delivery_process.md — opt-in capture step in every flow, template pre-approval as a day-1–3 task, session-window logic, quality-rating monitoring in the dashboard, and a fallback channel (email/SMS) for nurture. (c) Rewrite Backup 2's "90-day follow-up" promise to "policy-compliant 90-day follow-up (WhatsApp templates where opted-in, email otherwise)." (d) Add the number-ban failure mode to the handover runbook (fail-safe already covers API-down; add banned/flagged).
**Files:** outreach_scripts.md, delivery_process.md (§3, §4, §6), backup_offers.md (Backup 2 deliverables/risks), winning_offer.md (§6 fast-follow flows), assumptions.md (new platform-risk assumption).

---

### R5 — The offer's pain framing promises OTA-message coverage the scope cannot deliver. **Severity: 7**

**Issue.** The painful problem (winning_offer.md §4, candidate_offers.md O1, landing page §2) is framed as inquiries across "WhatsApp, **OTA messages**, Instagram, email, and web forms," and the promise is "every conversation lands in one pipeline" / "no inquiry ever waits again." But the deliverables cover WhatsApp + web forms + IG only; Airbnb and Booking.com messaging APIs are restricted to approved partners/PMS integrations, the target customer is explicitly the *no-PMS* operator, and "PMS/channel-manager migration" is excluded. In an oversupplied market where the majority of bookings flow through OTAs, the biggest inquiry channel is silently out of scope — a sophisticated buyer will spot this in the discovery call, and an unsophisticated one will feel deceived at day 14.

**Fix.** Scope it honestly everywhere: either (a) add "OTA messages: via email-notification parsing where the OTA sends inquiry emails, otherwise out of scope — your OTA response tools already auto-acknowledge" as an explicit line, or (b) remove "OTA" from every pain/promise sentence and add it to "Not included" with a one-line reason. Update the discovery script to set this expectation proactively (it's a credibility *win* if volunteered).
**Files:** winning_offer.md (§4, §6, §13), landing_page_copy.md (§2, §5), candidate_offers.md (O1), proposal_template.md (§3, §8), sales_call_script.md (Part A).

---

### R6 — The Day-1–30 solo-founder workload is arithmetically impossible. **Severity: 6**

**Issue.** Simultaneously promised: 10 in-person visits/day on a geographic circuit + 10 personalized outreach contacts/day + secret-shopping every priority lead (each needs an off-hours inquiry plus waiting for the reply) + a recorded 3-minute video audit *per priority lead* (realistically 45–90 min each with demo prep) + building/maintaining the demo agent + running Dubai async outreach with its own video audits + qualification/discovery calls + (once anything closes) a 14-day delivery sprint with daily check-ins. That is 2–3 people of work. The delivery capacity rules (delivery_process.md §10) are realistic; the *sales* capacity rules don't exist. The hybrid strategy compounds it: two markets, two motions, day 1.

**Fix.** Add a sales-capacity section mirroring §10: e.g., pre-launch week builds the demo agent + 5 audits; steady state = 3–4 in-person visits OR 3 video audits/day, 10 light-touch contacts/day, Dubai async capped at 3 audits/week until Bali resolves; during a delivery sprint, outreach drops to follow-ups only. Sequence the hybrid: Bali sprint weeks 1–2, Dubai ramp weeks 2–4 (or inverted if Task Zero fails) rather than both at full volume from day 1.
**Files:** winning_offer.md (§18), outreach_scripts.md (cadence section), market_research.md (§6 sequencing), delivery_process.md (§10 cross-reference).

---

### R7 — Cross-document scope contradiction resurrects the exact overpromise the judges cut. **Severity: 6**

**Issue.** The tournament's judge-mandated modification was the v1 scope cut: guest-journey flows and owner reporting become "fast-follow, weeks 2–4, **post-launch**" (winning_offer.md §6) so the 14-day solo promise is honest. But: landing_page_copy.md §5 lists guest-journey flows and owner-report drafts as flat deliverables of the 14-day fixed-price build; proposal_template.md §3 lists them as deliverables 6–7 with §2 promising the outcome "within 14 days"; and delivery_process.md §3 schedules them on **days 11–12, inside the sprint**. Three documents thus re-commit to the pre-cut scope, and the proposal is the *contractual* one. A client reading the proposal will expect items 6–7 at day 14; the winning offer says weeks 2–4.

**Fix.** Pick one truth — recommend the judges': core sprint = responder + sync + pipeline + escalation + dashboard in 14 days; guest-journey + owner reporting = included fast-follow, delivered days 15–30 (inside the 30-day support window). Then align: proposal §3 splits the table into "14-day sprint" and "included fast-follow (days 15–30)"; landing §5 adds "(delivered in weeks 3–4)" to those two bullets; delivery_process moves day-11/12 work to the post-launch block and uses days 11–13 for hardening only (as winning_offer §7 already says).
**Files:** proposal_template.md (§2, §3, §4), landing_page_copy.md (§5), delivery_process.md (§3).

---

### R8 — The 14-day clock starts on the least controllable dependency: WhatsApp Business API provisioning and number migration. **Severity: 6**

**Issue.** Shadow mode is promised on day 4, but the WhatsApp Business API path requires BSP onboarding + Meta Business verification, which for a small Indonesian/foreign-owned hospitality company without tidy incorporation documents routinely takes longer than 3 days — and delivery_process.md itself calls it "the longest external lead time" while still scheduling channel plumbing on day 1. Worse, the migrate-existing-number option means the client's *primary operating number* leaves the WhatsApp app (API-only access, no app UI for staff, history not carried into new tooling) — an operational shock disclosed only as "brief downtime, plan it." A botched or slow migration on a live reservations number during high season is the single most plausible way this engagement blows up. The day-for-day slip clause also pushes the go-live balance payment out with every slip.

**Fix.** (a) Start the API application at *signing*, not kickoff, and define day 0 as "API approved + access checklist complete" (the proposal's gate becomes "starter paid AND API live"), so the 14-day promise never depends on Meta. (b) Default to a new dedicated API number with the existing number call-forward/auto-reply pointing to it; migration of the primary number becomes an explicit opt-in with a written risk paragraph. (c) Add "verification stuck >7 days" to the runbook with the fallback (dedicated number / alternate BSP).
**Files:** delivery_process.md (§0, §2, §3, §6), winning_offer.md (§7, §11), proposal_template.md (§4 gate), sales_call_script.md (§10 checklist).

---

### R9 — SLA language is internally inconsistent: "no inquiry waits more than 2 minutes, ever" vs. the contractual "median first response <2 min." **Severity: 5**

**Issue.** candidate_offers.md O1 promises "no inquiry waits more than 2 minutes for a useful first response, **ever**"; landing/outreach say "every inquiry answered within ~2 minutes, 24/7"; winning_offer.md §14 commits only to "**median** first response <2 min." "Ever/every" is unachievable (API outages, model downtime, WhatsApp quality throttling, the safe-routing fallback where the agent only *collects* the request) and directly contradicts the committed metric. The gap is exactly where a refund argument or reputation hit lives.

**Fix.** Standardize on a defensible SLA — e.g., "95% of inquiries get a useful first response within 2 minutes; median under 60 seconds; anything the AI can't handle reaches your team within the same window" — and use it verbatim across all customer-facing documents; keep "ever" out of writing.
**Files:** candidate_offers.md (O1), winning_offer.md (§2, §6), landing_page_copy.md (§1, §3), outreach_scripts.md (all scripts), proposal_template.md (§2).

---

### R10 — No contract armor: liability cap, data-processing terms, IP, and insurance are all absent while guest PII flows through third-party AI APIs. **Severity: 5**

**Issue.** The proposal template is a scope-and-price document with no limitation of liability, no indemnity position, no confidentiality, no IP/ownership clause (who owns the prompts/KB structure?), and no data-processing terms — while the system pipes guests' names, phone numbers, travel dates, and payment-adjacent details through OpenAI/Anthropic APIs, Make/n8n, and Airtable. Indonesia's PDP Law (UU 27/2022) applies; EU guests bring GDPR exposure to the villa company (controller) and to Selena (processor — a DPA is standard); the dropped AU clinic offer would add more. The landing FAQ's "your data stays in your accounts / not used for training" is good marketing but isn't a contract. One hallucinated rate honored at a loss, or one leaked guest list, and an uncapped solo founder is personally exposed.

**Fix.** Add to proposal_template.md: liability capped at fees paid; no liability for indirect/consequential loss; a short data-processing annex (categories of data, subprocessors named — BSP, AI API, automation tool — deletion on request, no training use); client owns all accounts/data, Selena retains reusable methods/templates; confidentiality both ways. Get a one-time template review from a lawyer alongside the Task Zero consult; price professional-indemnity insurance (cheap for this revenue level) and note it in delivery_process.
**Files:** proposal_template.md (new §6c/§11), delivery_process.md (§0), landing_page_copy.md (FAQ stays, now backed by contract), assumptions.md.

---

### R11 — Assumption A3 (the founder can invoice internationally) is a blocking dependency for EVERY market and is never resolved. **Severity: 5**

**Issue.** The package's safe harbor — "sell remotely to non-Indonesian clients, invoice offshore" — assumes Selena has *some* entity/payment rail (company, Stripe/Wise/Payoneer business account). assumptions.md A3 flags it and nothing downstream resolves it: the proposal says "Invoiced in USD to ⟨entity⟩" with the entity as a literal placeholder. A Dubai brokerage wiring $6,500 will ask what legal entity is on the invoice and contract; "personal Wise account" undermines the trust ladder the whole sales system is built on, and payment platforms' business accounts themselves require registration documents.

**Fix.** Make "founder billing entity confirmed" Task Zero item 0 (before the Indonesia question, because it gates Dubai too). If none exists, note the fast options (e.g., US LLC / UK Ltd / Estonia e-residency / UAE freelance permit — the last also strengthens the Dubai motion) with cost/lead-time, and fill the proposal's ⟨entity⟩ before any outreach.
**Files:** assumptions.md (A3 → action item), winning_offer.md (§17), proposal_template.md (§6), backup_offers.md (Backup 2 terms).

---

### R12 — No quantified pipeline math or kill/pivot criteria; the post-founding price jump is untested. **Severity: 5**

**Issue.** The package's own scores say villa-PM willingness-to-pay is the weakest of the finalists (6/10), and the founding motion only proves demand at $5,000 — not at the published $7,500/$9,500 that the model needs after client 3. Meanwhile the pivot triggers are vague: "promote O4 if villa PMs stall in week 1–2" (what is "stall"? how many audits sent, meetings held, proposals out?). Without expected conversion rates (contacts → audits accepted → discovery → proposal → close) there is no way to distinguish "normal early funnel" from "dead offer," and a solo founder's two most likely failure modes are quitting too early and grinding too long.

**Fix.** Add a one-page operating dashboard to winning_offer.md or a new gtm_metrics section: weekly targets (e.g., 25 first touches, 8 audits delivered, 3 discovery calls, 1 proposal), explicit pivot triggers (e.g., "if <2 discovery calls by day 14 → promote Backup 1; if no signed founding client by day 30 → Dubai primary"), and a price-validation note (client #3 pays $6,500, not $5,000, to test the ladder before the $7,500 list price must hold).
**Files:** winning_offer.md (§18 or new §19), backup_offers.md (activation criteria), delivery_process.md (§10).

---

### R13 — The go-live payment gate is client-controlled, and the day-7 stop option hands over the knowledge base for $1,500. **Severity: 4**

**Issue.** Balance is due "at go-live (day ~10)," but go-live requires the client's approval; a stalling or cash-tight client can extend shadow mode indefinitely while Selena keeps working (the timeline shifts "day-for-day" — including the payment). Separately, the Shadow-Mode Guarantee lets a client stop at day 7 and *keep the knowledge base and pipeline built to that point* — an invitation for a technically savvy operator to buy $5k+ of structured discovery and KB engineering for $1,500 and finish it with a cheap local dev.

**Fix.** (a) Define go-live objectively in the proposal: "go-live occurs at day 10 or when shadow-mode approval ≥80% is reached, whichever is later, but no later than day 17 absent written defect list — balance due then." (b) On stop, client keeps the KB *content* (their knowledge, rightly theirs) but not the configured agent/prompt system; or price the starter at $2,000–2,500 to cover the real cost of days 0–7. Keep the spirit — the ladder is right — just close the gaps.
**Files:** proposal_template.md (§4, §6, §7), winning_offer.md (§8, §9), sales_call_script.md (§9).

---

### R14 — Evidence hygiene in customer-facing copy: dated/misframed stats and borrowed-vertical anecdotes. **Severity: 4**

**Issue.** (a) The "21x" stat is from a 2007-era US phone-based lead-response study about *qualification* odds of calling web leads within 5 minutes vs 30; outreach FU2 restates it as "~21x more likely to **convert**" — a claim a sharp prospect can dismantle, taking credibility with it. (b) WAV Group 48%/917-min is US/2014 (backup_offers itself says don't use it in-pitch — but market_research headlines it). (c) The winning offer's most vivid pain anecdote (Fastboat Bali Gili) is a boat operator, not a villa PM; villa-specific evidence is mostly job-post inference. (d) The secret-shop tactic — sending fake booking inquiries and then citing the business's slow reply back at them — is the package's best opener *and* its most likely source of an angry "you wasted my staff's time" response; there is no guidance on keeping the fake inquiry minimal/low-cost to the target.
**Fix.** In all customer-facing scripts use the hedged form already on the landing page ("dramatically more likely"), keep the 21x citation for internal ROI framing only with its vintage stated; swap Fastboat for a villa-specific example once the first secret shops produce one (they will); add a secret-shop ethics note (one short inquiry, no phantom bookings requiring work, disclose readily if asked).
**Files:** outreach_scripts.md (§6, §10), winning_offer.md (§4), market_research.md (§1 caveat), sales_call_script.md (§4).

---

### R15 — Lead data quality: ~8% of sampled rows have wrong/stale fields, and at least one "lead" is closer to a competitor. **Severity: 4**

**Issue.** verification-leads.json: 2 of 24 sampled rows SUSPECT (The Udaya's website field points to a dead domain; Sydney Health Physio's website field is a LinkedIn job URL) — extrapolated, ~10 of 122 rows have field errors that would make outreach look sloppy ("I audited your site" → wrong site). Also note the pains file achieved only CORROBORATED status for all 20 sampled rows (environment blocked direct fetches — honest, but it means no claim has been read at the source). And Bukit Vista (priority 4, villa batch) is a tech-forward PM that publishes content about its own guest-communication automation — arguably a competitor/at best a poor prospect, possibly a partnership target instead.
**Fix.** Add a mandatory pre-outreach row check (website loads, WhatsApp number live, business still operating — assumption M4 already requires this; make it a checklist step in the cadence); fix the two known-bad rows; retag Bukit Vista as partner/competitor-watch, not lead.
**Files:** lead_list.csv (rows for The Udaya, Sydney Health Physio, Bukit Vista), outreach_scripts.md (cadence step 0), assumptions.md (M4 cross-reference).

---

### R16 — The competitive moat is thinner than the "empty $5–10k middle" framing suggests. **Severity: 4**

**Issue.** The gap analysis rests entirely on the package's own competitor scan. Three uncounted threats: (a) cheap local implementation — Bali/Indonesian developers at $10–20/h can copy a delivered system for a fraction of $7,500, and the handover docs are effectively a build spec; (b) SaaS catching up — guest-messaging and WhatsApp-CRM tools are racing to add AI + no-PMS onboarding; the "SaaS can't connect" wedge is a snapshot, not a law; (c) the buyer's nephew (acknowledged in objection handling — good — but the strategic answer, speed + accountability, erodes as tools get easier). None of this kills a services business, but it caps the post-founding price ceiling and argues for converting one-time builds into Care-Plan relationships faster than the current optional-$250–500/month posture.
**Fix.** Add a competitive-response paragraph to winning_offer.md: moat = speed, accountability, and the accumulating cross-client playbook, not the tech; push Care Plan attach explicitly (target ≥60% attach at handover, priced $400–600 with a quarterly review) so revenue compounds before the implementation gap closes.
**Files:** winning_offer.md (§13), delivery_process.md (§9), market_research.md (§4 caveat).

---

### R17 — Dangling references: documents cite files that don't exist. **Severity: 3**

**Issue.** market_research.md and winning_offer.md cite `red_team_report.md` ("flagged at severity 9 in red_team_report.md R1") — the file doesn't exist yet; assumptions.md P2 cites `source_log.md` — also absent. Broken internal references undermine the package's otherwise excellent traceability.
**Fix.** Create source_log.md (or repoint P2 to the raw JSONs, which do carry URLs) and repoint red-team references to the final report path once published.
**Files:** market_research.md (§2), winning_offer.md (§17), assumptions.md (P2).

---

### R18 — Shadow-mode acceptance is statistically thin at the minimum qualifying volume. **Severity: 3**

**Issue.** The qualification gate admits clients at ~20 inquiries/week; shadow mode days 4–7 then sees ~11 real inquiries — across up to three languages — against an "≥80% approved unedited" acceptance bar. One weird week decides a guarantee. The 40-inquiry scripted intent suite (delivery_process §4) partially covers this but isn't tied into the day-7 gate.
**Fix.** Make the day-7 gate = scripted intent suite results (deterministic, per language) + whatever real inquiries arrived; state that in the proposal's guarantee so a thin week can't sink an otherwise-good build.
**Files:** delivery_process.md (§3, §4), proposal_template.md (§7).

---

### R19 — Minor factual wobbles in copy. **Severity: 3**

**Issue.** (a) The hero anecdote "Sydney at 2am Bali time" implies a Sydney guest inquiring at ~4–5am their time — implausible; Sydney is only 2–3h ahead (outreach §3 gets it right: Europe is the overnight source, Sydney is early-morning). (b) BaliSuperHost portfolio: market_research says 550+, lead_list says "300+ per homepage… another snippet says 550" — pick one, it's a company you may pitch. (c) landing form "You'll hear back within one business day" vs proposal footer "replies within one business hour" — align on the faster one; the slow one contradicts the brand promise.
**Fix.** Swap the hero example to Berlin/London for the 2am slot and use Sydney for the 6am slot; reconcile the BaliSuperHost figure at next verification; unify response-time promises.
**Files:** winning_offer.md (§4), landing_page_copy.md (§1, form note), candidate_offers.md (O1), lead_list.csv (BaliSuperHost row).

---

## What the package gets RIGHT (brief)

- **Honesty infrastructure:** a real assumptions log, ASSUMPTION labels in data, an environment-limitations caveat, and a verification pass that reported its own weaknesses (0 VERIFIED pains, 2 SUSPECT leads) instead of hiding them.
- **The tournament worked:** dedicated skeptics landed real blows (O3's fatal flaw, O1's overpromise, O2's trust wall) and the judges' mandated modifications (Task Zero, scope cut, trust ladder) were actually propagated into the winning offer — rare discipline. Dropping the clinics offer for compliance reasons was correct and brave.
- **Sales system quality:** the secret-shop → 3-minute audit → "the audit is the portfolio" motion is a genuinely strong zero-proof opener; the shadow-mode guarantee is the right risk reversal (client judges quality on their own inquiries); the $1,500 starter correctly prices the trust problem; the ROI framework refuses to promise revenue and makes the client pick the uplift — excellent.
- **Delivery realism:** shadow → supervised → autonomous safety ladder, anti-hallucination guardrails in writing, prompt-injection tests in the intent suite, client-owned accounts (no hostage infrastructure), fail-safe routing to staff, day-for-day slip policy, and solo capacity caps (max 2 sprints).
- **Positioning:** published fixed pricing against a "book a call" industry, the no-PMS/WhatsApp-first wedge, and the founding-client trade stated openly are all differentiated and coherent.
- **Payment hygiene for the region:** USD/AED invoicing, never net-30 in Indonesia, starter-before-work policy — grounded in the Atradius overdue-invoice data.

## What the definition-of-done misses (summary)

Founder-side legal viability (visa activity + billing entity) treated as a lead attribute instead of a founder gate (R1, R11); platform-policy compliance for the delivery channel itself (R4); contractual/legal protections and data-processing terms (R10); quantified funnel targets and kill criteria (R12); sales-capacity planning symmetrical to delivery-capacity planning (R6); and a consistency pass across documents (R7, R9, R17, R19).

## Priority fix order (before first outreach)

1. R1 + R11: one legal consult answering the founder-activity and entity questions → determines whether O1 or O2 is primary (day 1–2).
2. R2: gate/rewrite the landing page and local outreach scripts pending that answer.
3. R3: expand villa-PM leads to ≥50 and correct the "65 leads" claims.
4. R4: WhatsApp policy architecture (outreach rules + product opt-in/template design).
5. R5 + R7 + R9: one consistency pass across winning_offer / landing / proposal / delivery (OTA scope, fast-follow placement, SLA wording).
6. R10: add the contract annex (liability cap, DPA) to the proposal template.

Everything below R10 can be fixed in parallel with early outreach.
