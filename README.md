# Junction — Scope & Assumptions

**Product:** Junction, an AI career coach prototype for Indian working
professionals with 1–5 years of experience.
**Prepared for:** Leap Finance — Product Assignment
**Live prototype:** https://junction-task-azure.vercel.app
**Repository:** https://github.com/ayuxh16/Junction-task

---

## 0. Why this matters

Secondary research suggests the underlying problem is large and current, not
assumed. Independent sources converge on similar figures for 2025-26: a
Blind survey found 68% of Indian professionals had attempted to switch jobs
in the past 12 months [1], LinkedIn's India Jobs on the Rise report found
84% feel unprepared to job search amid AI-driven hiring changes [2], and
Gallup's 2025 workplace report found close to half of Indian employees are
actively looking to leave, driven by burnout and lack of career clarity
rather than compensation alone [3].

The competitive landscape also has a real gap rather than direct overlap.
Most tools marketed as "AI career coaches" — Teal, Careerflow, Prentus —
are actually resume-building, ATS-optimization, and interview-drilling
tools; they support *execution* once a decision is made, not the decision
itself. India's closest analog to decision-stage support is human
mentorship platforms like Preplaced (~₹2,500/month) [4] — which validates
willingness to pay for this kind of guidance, but is human-only and
concentrated in tech/product/data roles. An AI-native, function-agnostic,
decision-focused coach doesn't have an obvious incumbent — which is the
gap Junction is built for.

[1] Blind, "7 in 10 Professionals in India Tried to Switch Jobs in the Past
Year," 2025
[2] LinkedIn India Jobs on the Rise Report, cited in The Tribune, Jan 2026
[3] Gallup, State of the Global Workplace 2025 Report
[4] Preplaced pricing, cited in MentorMeet platform comparison, 2025

---

## 1. Scope

### 1.1 Target group
Indian working professionals with 1–5 years of experience, across
functions — not limited to tech. This is a deliberately broad band: someone
18 months into their first job and someone 5 years in with a team under
them have different questions, but both are navigating early-to-mid-career
decisions without an obvious playbook or a company-provided mentor for it.

### 1.2 In scope — what Junction helps with
- **Evaluating a job or company switch** — weighing a move against staying
- **Comparing job offers** — trade-offs across comp, role, growth, brand
- **Domain or function pivots** — e.g. ops → product, support → engineering,
  IC → people manager
- **Promotion readiness** — is it time, and what's missing if not
- **Upskilling direction** — what to learn next and why, tied to a goal
- **Stay-or-go calls** — someone unhappy but unsure whether the fix is the
  role, the company, or something else

### 1.3 Out of scope — explicitly, and why
| Excluded | Why |
|---|---|
| Resume writing / editing | Different skill (writing), different tool category; conflating it dilutes the "coach" positioning into a document editor |
| Interview drilling / mock interviews | Execution support, not a decision — belongs in a separate prep tool |
| Salary negotiation scripts / exact numbers | Legal and market-data sensitive; a general chat model shouldn't be the source of truth on comp figures |
| Legal or HR disputes | Needs a qualified professional, not a coach |
| Mental health / therapy-level support | Outside a career tool's competence and responsibility; redirect to appropriate support if it comes up |

Junction acknowledges these when raised and redirects back to the
underlying career question, rather than refusing silently.

### 1.4 Interaction model
- **Structured intake first** (4 questions: current role/experience, the
  core decision, what's been tried, timeline), then open chat.
- **Coaching, not directive.** The system prompt is loosely structured
  around the GROW model (Goal, Reality, Options, Way Forward) [5] — a
  widely used professional coaching framework — so the conversation moves
  from clarifying what the person actually wants, to their current
  situation, to the options in front of them, to a concrete next step,
  rather than jumping straight to advice.

[5] Whitmore, J., *Coaching for Performance* — the GROW model, summarized
in Mindtools, "The GROW Model: A Coaching Framework That Works," 2026
- **Single session.** No persistent user accounts or cross-session memory
  in this prototype — each session is self-contained.

---

## 2. Assumptions

Listed so they can be revisited if wrong.

1. **"Career transitions" means role/function/company moves**, not broader
   life transitions (relocation, career breaks, freelancing vs. full-time).
   A v2 could expand this, but v1 stays tight to the stated scope.
2. **No integration with resume, LinkedIn, or company data.** The coach
   only knows what the person tells it in the conversation. This keeps the
   prototype fast to build and avoids data-handling complexity, at the cost
   of some personalization.
3. **English-only.** No Hindi or code-switched input handling, though the
   tone is written to feel natural to an Indian professional context
   (notice periods, appraisal cycles, family/relocation factors).
4. **One-off sessions, not an ongoing relationship.** No memory across
   visits. A real product would likely want returning-user context; this
   prototype optimizes for demonstrating the core coaching interaction.
5. **The coach gives frameworks and questions, not verdicts.** Assumed
   this is both safer (avoids liability from telling someone to quit their
   job) and more genuinely useful — real career decisions rarely have a
   single correct answer a chatbot should hand down.
6. **No monetization, auth, or admin surface** in this prototype — out of
   scope for a "working prototype to test," not a production launch.
7. **In-memory session storage** on the backend is acceptable for a demo;
   sessions don't need to survive a server restart at this stage.
8. **Gemini (free API tier) is an acceptable model choice for this
   prototype** in place of a paid model — the product logic (scope,
   session handling, prompt design) is model-agnostic and would port to
   any LLM provider with no architecture changes.

---

## 3. What a v2 would need to address
- Persistent accounts and cross-session memory (so the coach can track a
  decision over weeks, not just one sitting)
- A data source for realistic Indian salary benchmarks, if offer
  evaluation is to go beyond generic frameworks
- Some connection to resume/LinkedIn data to reduce how much the user has
  to type in manually
- Clear disclaimers and hand-off points to human professionals for the
  out-of-scope categories, rather than just a conversational redirect
