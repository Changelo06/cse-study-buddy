# Architecture & Logic Flow

## 1. Information Architecture
**Main Navigation:** Home -> Lessons -> Quizzes -> Profile

**Supporting Pages:**
- Landing / Login
- About / Disclaimer
- Admin
- Lesson Detail
- Module Reading
- Module Assessment
- Quiz Taking
- Quiz Result
- Final CSE Ready Exam

## 2. Page-by-Page Flow
- **Landing/Login**: Introduce CSE Ready, start session. Emphasize disclaimer (not affiliated with CSC).
- **Home/Dashboard**: Central study hub. Shows readiness score, continue unfinished lessons, next suggested tasks, study plan panel.
- **Lessons**: Displays major learning paths (English, Filipino, Math/Logic, Clerical Operations, General Info/Constitution, Ethics).
- **Lesson Detail / Module List**: Modules under a selected lesson. Shows difficulty, estimated time, locked/unlocked status.
- **Module Reading**: Actual lesson content. Includes examples, key terms, solving walkthroughs, references.
- **Module Assessment**: Test user after module completion (10-15 questions).
- **Quizzes**: Available quizzes separate from lessons. Requires prerequisites to be unlocked.
- **Quiz Taking**: Timed test experience (A-E choices). Allows skipping and number board navigation.
- **Quiz Result**: Total score, percentage, time used, correct/incorrect breakdown, explanations.
- **Profile Page**: Long-term analytics, overall readiness, subject performance, study history.
- **Final Exam**: 180 items, 3-hour timer, full readiness simulation.

## 3. Learning System Logic
`Lesson -> Module 1 -> Assessment -> Module 2 -> Assessment -> Module 3 -> Assessment`

- Modules must be completed in order.
- Each module ends with an assessment.
- Progress percentage = completed modules / total modules.
- Quizzes unlock based on completed modules.

## 4. Quiz System Logic
`Select Quiz -> Check prerequisites -> Start timer -> Answer items -> Submit -> View result`

- Timed multiple choice (A to E).
- Number board navigation and skip/return feature.
- Answers/explanations shown only after final submission.
- Restart if interrupted; retakes allowed.

## 5. Readiness Score Logic
The readiness score is an **estimate**, not a guarantee.
Suggested MVP Formula:
- Quiz accuracy: 30%
- Module completion: 25%
- Timed quiz completion: 15%
- Weakness improvement: 15%
- Recent activity: 10%
- Flashcard activity: 5%

## 6. Study Plan Logic
The study plan guides users toward useful next actions:
- Tackle weaknesses first.
- Recommend next module or suggest quizzes when ready.
- Avoid fake certainty. (e.g., "Your weakest area is Math. Review Percentages before taking the next quiz.")
