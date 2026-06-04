# FinSoko Agent Pride Prototype

A live prototype for the AI Safari Capstone project demonstrating how **FinSoko**, a SACCO-aligned lending platform in Western Kenya, uses a coordinated AI agent system to support fair lending for informal traders, women vendors, and smallholder farmers.

---

## What This Prototype Demonstrates

This website simulates the **Scout → Guardian → Hunter** agent workflow that FinSoko uses to process loan-related messages from SACCO members:

1. **Scout Agent** — Financial literacy coach that educates members about savings, repayment readiness, and harvest-cycle planning. Max 3 SMS/day, never recommends a specific loan.

2. **Guardian Agent** — Tier-1 loan triage that checks affordability, seasonal income, missing evidence, and risk flags. Can recommend review for low-risk loans up to KES 15,000, but cannot final-approve or final-deny high-stakes cases.

3. **Hunter Agent** — Human-in-the-loop coordinator that prepares a briefing for the human loan officer. Never approves or denies loans.

**Final lending decisions always stay with a human loan officer.**

### Frameworks Demonstrated

- **RANK** — Defines each agent's Role, Authority limits, Notification triggers, and Kill switch
- **TRAIL** — Controls memory using Transient, Relational, Archival, Inheritance, and Land Rights
- **HUNT** — Defines Handoff triggers, Unified context, Negotiation rules, and Termination conditions
- **GUARD** — Adds Guardrails, Unusual pattern detection, Audit trail, Red team testing, and Dignity preservation
- **CYCLE** — Captures outcomes, yields insights, proposes course correction, requires human validation, and explains changes

---

## How to Run

### Option 1: Open Locally

1. Download or clone this repository
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
3. No server or build step required — everything runs locally

### Option 2: Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages** in your repository
3. Select the branch you want to deploy (usually `main`)
4. Your site will be live at `https://yourusername.github.io/repository-name/`

### Option 3: Deploy to Netlify / Vercel

1. Drag and drop the project folder into [Netlify Drop](https://app.netlify.com/drop) or [Vercel](https://vercel.com/new)
2. Your site will be live instantly with a public URL

### Option 4: Deploy to Replit

1. Create a new Repl and upload these files
2. Use a simple HTML/CSS/JS Repl template
3. Click "Run" to start

---

## File Structure

```
.
├── assets/
│   ├── finsoko-hero-background.png   # Generated source hero background
│   └── finsoko-hero-background.webp  # Optimized hero background used by the site
├── index.html          # Main page with all 6 sections
├── style.css           # All styles and visual effects
├── script.js           # All simulation logic and interactivity
└── README.md           # This file
```

### External Dependencies (loaded via CDN)

- **GSAP 3.12** — Animation library for scroll-triggered effects and particle bursts
- **GSAP ScrollTrigger** — Scroll-based animation triggers
- **Google Fonts** — Sora (headings) and Inter (body text)

All simulation logic runs entirely in the browser. No API keys, no server, no database required.

---

## How to Use the Demo

1. **Select a preset borrower** — Click one of the three preset buttons (Grace, Amina, Peter) to auto-fill the form with realistic borrower data from Western Kenya
2. **Or enter custom details** — Fill in the form fields manually with any borrower scenario
3. **Click "Run Agent Demo"** — The simulation will execute:
   - **Step 1**: Scout Agent analyzes the message and sends an education SMS
   - **Step 2**: Guardian Agent evaluates risk flags and affordability
   - **Step 3**: Hunter Agent assigns a human officer and prepares a briefing
   - **Final**: Human decision required — always
4. **Observe the risk flags** — Risk flags change dynamically based on the input data (loan amount, income variance, children under 5, harvest timing, hardship language)
5. **Review the frameworks** — Scroll down to read about RANK, TRAIL, HUNT, GUARD, and CYCLE

### Preset Borrowers

| Borrower | Occupation | County | Loan Amount | Key Risk Factor |
|----------|-----------|--------|-------------|-----------------|
| Grace | Maize trader | Kakamega | KES 28,000 | Amount > authority limit |
| Amina | Shea butter trader | Busia | KES 12,000 | Low risk, eligible for review |
| Peter | Formal employee | Nairobi | KES 60,000 | Urgent hardship language |

---

## Key Design Decisions

### Safety & Dignity

- Gender, ethnicity, and county proxies **cannot** be used as denial reasons
- Denial-rate anomaly above 30% triggers automatic review
- Every recommendation and handoff is logged with full audit trail
- Red-team cases include women vendors, rural farmers, shea butter traders, and seasonal earners
- Dignity-filtered messages never use words like "unreliable," "risky," "lazy," or "unfit"
- Human officer makes the final decision — always
- Member appeal rights remain available at every stage

### Technical

- **100% offline capable** — All logic runs in the browser
- **No paid services** — No API keys required
- **No login required** — Open access
- **Responsive design** — Works on laptop, tablet, and mobile
- **Generated hero background** — African fintech operations scene with market context and dashboard overlays
- **Dark theme** — Professional African fintech aesthetic with navy, gold, and green accents

---

## Prototype Option

**Option B: Web-Based Local Agent Team with RANK Constraints**

This website simulates the Scout → Guardian → Hunter workflow using mock SACCO loan applications. All agent logic is implemented in pure JavaScript and runs entirely in the browser. No paid API keys or external services are required.

---

## Capstone Submission

This prototype is suitable to submit as the **Live Prototype** link for the AI Safari Capstone. It demonstrates:

- Agent coordination with clear role separation
- Safety rails and dignity-preserving language
- Human-in-the-loop decision making
- Transparent audit trails and context passing
- Risk-calibrated triage with escalation rules

---

## License

This prototype was built for educational purposes as part of the AI Safari Capstone program.
