# 2-Week Deployment Plan & Schedule

The two-week version is treated as a deployable MVP/prototype to prove the core learning flow, not a complete reviewer.

## MVP Definition
**Must-Have:**
- Landing page & Home/Dashboard
- Lessons page & Lesson detail/module list
- One sample module page
- Quiz UI & Quiz result UI
- Profile analytics placeholder
- About/disclaimer page
- Mock data or initial real data mapping
- Vercel deployment & Supabase setup (Auth/DB basics)

**Should-Have:**
- Basic locked module behavior
- Basic progress calculation
- Sample flashcards & references
- Responsive layout

**Not for 2-Week MVP:**
- 180-item full exam with complete real content
- Payment system
- Complete admin panel (CMS)
- Full content library

## Workload Breakdown (Priority)
1. Finalize design system
2. Build navigation & dashboard
3. Build lessons & module detail pages
4. Prepare sample lesson content & practice questions
5. Build quiz UI & result UI
6. Build profile page (analytics placeholders)
7. Add disclaimers & responsive testing
8. Supabase Auth & Database Integration
9. Deploy to Vercel

## 2-Week Timeline

| Day | Focus | Output |
|-----|-------|--------|
| **Day 1** | Finalize scope, navigation, design system, setup Supabase, Vercel | Confirmed MVP scope & Infrastructure |
| **Day 2** | Build base layout, header/navigation, background, card system, mock data | App shell |
| **Day 3** | Build dashboard page, progress cards, readiness card, My Lessons, study plan | Dashboard MVP |
| **Day 4** | Build lessons page, lesson cards, lesson detail, module list, locks | Lessons flow |
| **Day 5** | Build module reading page with overview, discussion, key terms, examples, assessment, references | Module template |
| **Day 6** | Build quiz page UI, timer placeholder, question board, A-E choices, submit flow | Quiz taking UI |
| **Day 7** | Build quiz result page, score summary, answer key, explanations, recommended review | Result flow |
| **Day 8** | Build profile page, analytics placeholders, strength/weakness cards, graph placeholders | Profile MVP |
| **Day 9** | Add sample content: one full sample module, one sample quiz, sample flashcards | Demo content |
| **Day 10** | Add disclaimers, About page, references formatting, ethical wording review | Trust layer |
| **Day 11** | Responsive testing, mobile fixes, accessibility check, font/color cleanup | Usability pass |
| **Day 12** | QA testing, bug fixing, quiz restart placeholder, locked module behavior | QA pass |
| **Day 13** | Final polish, deployment test, README/report update, screenshots | Release candidate |
| **Day 14** | Deploy MVP, final demo, team review, next-phase list | MVP launch |

## Risks and Mitigation
- **Scope too large**: Limit MVP to core flow and sample content.
- **Content credibility issues**: Use references and human review.
- **Ethical misuse of questions**: Use original CSE-style practice only and clear disclaimers.
- **Data security problems**: Ensure Supabase RLS (Row Level Security) is properly set up if Auth is implemented.
