# EquivLens Career Compass

Build a complete, self-contained, frontend-only React + Tailwind CSS web application called "EquivLens" for a hackathon demo aligned with UN SDGs 4 (Quality Education) and 8 (Decent Work). 

IMPORTANT TECHNICAL CONSTRAINTS:

- Do NOT set up any backend, authentication, or database (no Supabase). Store all data in local TypeScript arrays/objects and React state so the app works immediately out of the box with zero external dependencies.

- Build the entire experience cleanly as a fast, responsive single-page web app with smooth tab/view switching so I can demo every feature live without page reloads.

DESIGN SYSTEM & VISUAL STYLE:

- Aesthetic: Clean, authoritative, warm civic-tech & education design. High contrast (minimum 4.5:1 text contrast), generous whitespace, crisp borders, and rounded-xl cards.

- Color Palette:

  - Primary Background: #F8FAFC (Slate 50)

  - Card Surface: #FFFFFF with #E2E8F0 border

  - Primary Brand Accent: #0F4C81 (Deep Trust Navy)

  - Secondary Accent (Verified / SDG 8): #0D9488 (Teal 600)

  - Warning / Gap Accent: #D97706 (Amber 600)

  - Text Primary: #0F172A (Slate 900), Text Muted: #475569 (Slate 600)

- Typography: Use "Plus Jakarta Sans" for headings and "Inter" for body text.

APP STRUCTURE & FEATURES TO BUILD:

1. TOP NAVIGATION BAR:

   - Brand logo: "EquivLens" with a subtle compass/check badge and small subtitle "SDG 4 & 8 Qualification Navigator".

   - Navigation tabs: "1. Equivalency Wizard", "2. Missing Records Alternatives", and "3. Sample Directory".

   - A "Load Demo Profile" quick-fill button in the header that auto-populates a realistic test case (e.g., "Amina – TVET Diploma in Electrical Engineering from Kenya → Targeting Junior Renewable Energy Technician in Germany/EU") so I can demonstrate the app in one click during my pitch.

2. HERO & INTERACTIVE EQUIVALENCY WIZARD (Main View):

   - Compact, impactful hero header:

     - Headline: "Turn Unrecognized Qualifications into Clear Career Pathways."

     - Subtext: "Map foreign degrees, TVET diplomas, and informal skills to local standards—even when paper records are missing."

   - Interactive 3-Step Form Card:

     - Step 1 (Origin Background): Dropdown for Country/Region of Study (Kenya, Nigeria, Syria, Ukraine, India, Colombia), Qualification Type (TVET / Vocational Diploma, Bachelor's Degree, Incomplete University Credits, Informal Apprenticeship), and Field of Study (Software Development, Electrical & Solar Engineering, Nursing & Healthcare Support, Accounting & Finance, Hospitality & Trades).

     - Step 2 (Target Destination & Goal): Target Country/Framework (Kenya KNQA, European EQF, Canada WES/NOC, UK ENIC, UAE) and Target Role or Study Level.

     - Step 3 (Document Status Toggle): Interactive toggle buttons for "Full Transcripts Available", "Partial Records Only", or "Paper Records Lost / Unreachable Institution".

     - Primary CTA Button: "Analyze Equivalency & Action Plan".

3. DYNAMIC RESULTS DASHBOARD (Appears smoothly below or replaces form with an "Edit Inputs" button):

   - Include a realistic pre-computed matching engine with at least 6 rich, domain-accurate scenarios (covering Software Engineering, Electrical/Solar TVET, Healthcare, and Incomplete Degrees) plus intelligent fallback mapping so ANY combination selected by the user produces tailored, realistic results.

   - Display 4 clear visual cards in the results view:

     a) **Equivalency Match Score & Level Badge**: Visual circular progress gauge (e.g., "82% Direct Alignment") comparing Origin Level (e.g., "KNQF Level 6 Diploma") side-by-side with Target Level (e.g., "EQF Level 5 / Associate Technician").

     b) **Competency Breakdown Matrix**: A clean list with green checkmarks for "Recognized Core Competencies" (4–5 specific skills) and amber badges for "Bridging Gaps Identified" (1–2 specific modules or local regulatory exams needed).

     c) **Missing Records Alternative Proof Generator** (Adapts dynamically if user chose "Partial" or "Lost Records"): Interactive checklist of practical alternatives (e.g., UNESCO Qualifications Passport / Background Paper template, Technical Competency Assessment Portfolio, Supervisor Attestation Letter, Syllabi Reconstruction) where checking items updates a "Readiness Score" progress bar.

     d) **Targeted Bridging & Micro-Grant Step Card**: Shows estimated bridging duration (e.g., "4 Weeks"), estimated exam/assessment cost, and a clickable "Generate Shareable Equivalency Summary" modal that displays a clean, printable/exportable summary card with a mock verification ID.

4. "MISSING RECORDS TOOLKIT" TAB:

   - A dedicated reference section explaining 4 real-world pathways when paper certificates are missing or destroyed (Sworn Affidavit & Syllabus Reconstruction, Practical Trade/Code Assessment, Employer/Supervisor Verification, and Humanitarian Qualifications Passports), each with an interactive "Preview Template" modal showing sample wording.

5. "SAMPLE DIRECTORY" TAB:

   - Searchable, filterable table of 8 pre-loaded cross-border qualification mappings (e.g., BSc Computer Science, TVET Electrical Installation, Diploma in Clinical Medicine, Coding Bootcamp Certificate) where clicking any row loads that exact scenario directly into the Equivalency Wizard results view.

6. FOOTER:

   - Clean minimal footer noting: "Built for Power Learn Project (PLP) Hackathon • Advancing UN SDG 4 (Quality Education) & SDG 8 (Decent Work & Economic Growth)."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://equivlens-career-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/543217d0-65ef-5ddb-a4a0-ff1a5a496a92).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
