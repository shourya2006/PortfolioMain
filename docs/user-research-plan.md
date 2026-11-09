# Portfolio UI: Expert Review and User Research Plan

Reviewed on 9 Nov 2026 against the local dev build (`npm run dev`) at desktop (800×600) and mobile (375×812) sizes, plus the source code. No real users have been tested yet. Everything in Part 1 is a **hypothesis** for Part 2 to confirm or rule out.

## Who the site is for

| Audience | Job they "hire" the site for | Time they give it |
|---|---|---|
| Recruiter / HR screener | "Is this person worth a call? Can I get the résumé and contact fast?" | 30–90 s |
| Hiring engineer | "Can they actually build? Show me real code and decisions." | 3–5 min |
| Founder / client (freelance) | "Can they build *my* thing? How do I reach them?" | 1–2 min |

The site mixes all three today. The Services section has "Inquire" buttons aimed at clients, while the rest is aimed at internship hiring. Choosing the main audience is the first research question.

---

## Part 1: What I found in the UI (hypotheses)

### High impact

1. **The preloader blocks content on every visit.** The page shows a black screen with a percentage counter before anything else (`components/intro-preloader.tsx`). In dev mode it was still at 17% after 5 s on desktop and 2% after 10 s on mobile. Nothing skips it on a repeat visit (no session flag). A recruiter with 30 seconds may leave first. *Caveat: dev mode is slower than production. Measure on the deployed site.*
2. **The project you feature isn't your strongest.** The home "Featured build" card shows Smart Waste Segregator (classical ML on six classes), but NextFlow and Vortex are the more impressive full-stack and AI work. The Portfolio page already leads with NextFlow.
3. **Contact is form-only.** The README notes that no email is shown, and the form currently delivers through Resend's onboarding sender. If delivery fails, the visitor has no fallback. Recruiters often want a plain email or LinkedIn link they can copy.
4. **The design is a reconstruction of another developer's site.** The README says the layout and styles were reconstructed from devxsubh.com. A hiring engineer who knows that site may read it as copied work. Check this risk before sending the link out widely.

### Medium impact

5. **The Work section's labels are confusing.** It says "Three kinds of work," then shows cards labelled "Portfolio", "The build journey", and "Featured build". There's a "Portfolio" card inside the portfolio, and the numbering continues into a separate "04 · Research" card. Visitors may not know where to click to see projects.
6. **The education section gives weak scores equal space.** Class XII (62%) gets the same weight as the 8.6 CGPA. Most portfolios for B.Tech students show only the current degree.
7. **Some copy is generic.** Headings like "Creativity with purpose" and "How I can help" say little about you. Specific outcomes, such as numbers, users, and what shipped, scan better.
8. **On mid-size screens, hero text overlaps the illustration.** At 800 px wide, the right-hand description sits on top of the figure's arm, which hurts readability.

### Strengths to keep

- Clear headline and role label above the fold ("Building Full-Stack AI Systems.").
- Competitive-programming cards (LeetCode, Codeforces, GitHub, CodeChef) give fast, checkable proof.
- Accessibility work is solid: skip link, reduced-motion path, `sr-only` text behind the rolling labels, and keyboard-focusable cards.
- Experience entries have concrete stacks and responsibilities.

---

## Part 2: Research plan

### Objectives
1. Can a recruiter find the résumé, the best project, and a way to contact you within 60 seconds?
2. Do engineers understand what you built, and do they trust it (code, demo, your role)?
3. Do the preloader and motion feel premium, or do they slow people down?
4. Who is the main audience: hiring or freelance clients?

### Methods
| Method | Who | How many | Time |
|---|---|---|---|
| 5-second test (screenshot of the hero) | Anyone in tech | 10–15 | 1 day, async (e.g. Lyssna free tier, or send to friends) |
| Moderated usability test (remote, think-aloud) | 3 recruiters/HR + 3 engineers who hire interns | 6 | 1 week |
| Short follow-up interview (same session) | Same 6 | — | +10 min each |
| Analytics after changes | Live visitors | — | Ongoing (Cloudflare Web Analytics is free) |

Where to find participants: LinkedIn connections in HR, seniors from Newton School / Rishihood alumni, RashtramAI and Get Interview Confidence colleagues, and college placement-cell staff.

### Usability test tasks (about 20 min)
Give the deployed URL. Don't explain the site. Ask them to think aloud.

1. "You're screening intern candidates. You have one minute. Go." *(Watch: Do they wait out the preloader? Where do they look first? Note time-to-first-click.)*
2. "What does Shourya do, in one sentence?" *(Tests the hero message.)*
3. "Find the project you'd ask about in an interview, and tell me why you picked it."
4. "Download the résumé." *(Time it.)*
5. "Get in touch with Shourya however you'd prefer." *(Do they look for email or LinkedIn, or do they use the form? Does the form feel trustworthy?)*
6. Engineers only: "Find the code for NextFlow and tell me what Shourya personally built."
7. Open the site on their phone and repeat task 1.

Record: success yes/no, time, hesitations, and quotes.

### Follow-up interview guide (10 min)
- **Warm-up:** "How many portfolios do you look at in a typical week? What usually makes you close one?"
- **Context:** "What do you check first on a student's portfolio?"
- **Deep dive:**
  - "How did the opening animation feel?" (Probe: worth it, or annoying?)
  - "Did anything look copied, templated, or not quite real?"
  - "Was anything shown that you'd leave out?" (Probe: Class XII score, Services section.)
  - "What's missing that you expected?"
- **Reaction:** Show an alternate hero with NextFlow featured and the preloader skipped. Ask "Which one would you keep reading?"
- **Wrap-up:** "If you could change one thing, what would it be?"

### Synthesis
- Affinity-map observations by theme: first impression, navigation, trust, contact, motion.
- Plot each fix on an impact/effort matrix. Likely quick wins: skip the preloader on repeat visits, feature NextFlow, add an email or LinkedIn fallback, trim the education section.
- Success metrics for the next version: recruiter finds the résumé in under 15 s, 5 of 6 participants can name your best project, and nobody gives up during the intro.

### Timeline
| Week | Work |
|---|---|
| 1 | Deploy, run 5-second test, recruit 6 participants |
| 2 | Run 6 sessions (30 min each) |
| 3 | Synthesize, ship top 3 fixes, turn on analytics |
