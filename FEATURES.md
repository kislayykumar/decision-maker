# Features Documentation

Comprehensive guide to all features in Smart Decision Helper.

## Table of Contents

1. [User Authentication](#user-authentication)
2. [Decision Creation](#decision-creation)
3. [Question Engine](#question-engine)
4. [Decision Engine](#decision-engine)
5. [Recommendation System](#recommendation-system)
6. [Feedback System](#feedback-system)
7. [Decision History](#decision-history)

---

## User Authentication

### Sign Up

Users can create an account using:
- **Email and Password**: Traditional sign-up with validation
- **Google OAuth**: One-click sign-up with Google account

**Features:**
- Email format validation
- Password strength requirements (min 6 characters)
- Password confirmation matching
- Duplicate email prevention
- Automatic password hashing with bcrypt
- Auto-login after successful registration

**User Data Stored:**
- Name
- Email (unique)
- Hashed password (for credential users)
- Preferences (future use)
- Creation timestamp

### Sign In

**Methods:**
- Credentials (email + password)
- Google OAuth

**Features:**
- Secure authentication via NextAuth.js
- JWT-based session management
- Session persistence across page reloads
- Protected route handling
- Remember me functionality

### Session Management

- Sessions use JWT tokens
- Tokens stored in HTTP-only cookies
- Automatic session validation on protected routes
- Session expiry handling
- Sign out functionality clears all session data

---

## Decision Creation

### Creating a Decision

Users can create decisions with:
- **Title**: Descriptive name for the decision
- **Multiple Options**: At least 2 options required
- **Tags**: Descriptive keywords for each option

**Tag System:**

Tags help the decision engine understand the nature of each option. Recommended tags:

**Time-based:**
- `quick` - Tasks that take < 15 minutes
- `medium` - Tasks that take 15-45 minutes
- `long` - Tasks that take > 45 minutes

**Energy-based:**
- `relaxing` - Low-energy, calming activities
- `easy` - Minimal effort required
- `moderate` - Medium effort
- `intense` - High effort required
- `active` - Physical or mentally demanding
- `passive` - Minimal engagement

**Goal-based:**
- `productive` - Work or achievement-oriented
- `work` - Job-related tasks
- `efficient` - Optimized for results
- `leisure` - Entertainment and fun
- `entertainment` - Pure enjoyment
- `calm` - Stress-reducing
- `educational` - Learning-focused
- `learning` - Skill development
- `skill` - Ability building

**Example Decision:**

```
Title: "What should I do this evening?"

Option 1: "Watch a movie"
Tags: relaxing, entertainment, long, passive

Option 2: "Go for a run"
Tags: active, quick, intense, energizing

Option 3: "Read a book"
Tags: relaxing, educational, moderate, calm
```

### Dynamic Option Management

- Add unlimited options
- Remove options (minimum 2 required)
- Add multiple tags per option
- Remove tags individually
- Real-time validation

---

## Question Engine

### Contextual Questions

The system asks three key questions to understand your current situation:

#### 1. How much time do you have?

**Options:**
- 10 minutes
- 30 minutes
- 1 hour

**Purpose:** Filters options based on time commitment

**Scoring Impact:**
- "10 minutes" → Favors `quick` or `short` tagged options
- "30 minutes" → Balanced scoring
- "1 hour" → Favors `long` or `detailed` tagged options

#### 2. What is your energy level?

**Options:**
- Low
- Medium
- High

**Purpose:** Matches tasks to your current energy state

**Scoring Impact:**
- "Low" → Favors `relaxing`, `easy`, `passive` tags
- "Medium" → Balanced scoring with `moderate` bonus
- "High" → Favors `active`, `intense`, `challenging` tags

#### 3. What is your goal?

**Options:**
- Relax
- Be productive
- Learn something

**Purpose:** Aligns recommendations with your objective

**Scoring Impact:**
- "Relax" → Favors `relaxing`, `calm`, `leisure` tags
- "Be productive" → Favors `productive`, `work`, `efficient` tags
- "Learn something" → Favors `educational`, `learning`, `skill` tags

### User Experience

- Progress bar shows completion (1/3, 2/3, 3/3)
- Back button to revise previous answers
- Clear, easy-to-understand options
- Mobile-friendly large buttons
- Smooth transitions between questions

---

## Decision Engine

### Scoring Algorithm

The engine uses a points-based system to score each option:

**Maximum Points per Category: 3 points**
**Total Maximum: 9 points**

#### Scoring Rules

**Time Scoring:**
```
IF time_available == "10 minutes":
  IF tags include "quick" or "short": +3 points
  IF tags include "long": -2 points
  
IF time_available == "30 minutes":
  IF tags include "medium": +2 points
  IF tags include "quick": +1 point
  
IF time_available == "1 hour":
  IF tags include "long" or "detailed": +3 points
```

**Energy Scoring:**
```
IF energy_level == "Low":
  IF tags include "relaxing", "easy", or "passive": +3 points
  IF tags include "intense" or "demanding": -2 points
  
IF energy_level == "Medium":
  IF tags include "moderate": +2 points
  
IF energy_level == "High":
  IF tags include "active", "intense", or "challenging": +3 points
  IF tags include "passive": -1 point
```

**Goal Scoring:**
```
IF goal == "Relax":
  IF tags include "relaxing", "calm", or "leisure": +3 points
  IF tags include "productive" or "work": -2 points
  
IF goal == "Be productive":
  IF tags include "productive", "work", or "efficient": +3 points
  IF tags include "leisure" or "entertainment": -1 point
  
IF goal == "Learn something":
  IF tags include "educational", "learning", or "skill": +3 points
```

#### Tie Breaking

- Small random variation (0-0.5 points) added to prevent exact ties
- First alphabetically sorted option wins in unlikely exact tie

#### Confidence Score Calculation

```
confidence_score = (total_points / max_possible_points) * 100
confidence_score = min(100, max(0, confidence_score))
```

**Interpretation:**
- 0-40%: Low confidence (tags don't match well)
- 41-70%: Medium confidence (decent match)
- 71-100%: High confidence (excellent match)

---

## Recommendation System

### Result Display

The recommendation result shows:

**1. Recommended Option**
- Large, prominent display
- Clear identification

**2. Confidence Score**
- Percentage from 0-100%
- Visual indicator of certainty

**3. Reasoning**
- Human-readable explanation
- Based on input parameters
- Example: "Based on your inputs (10 minutes available, low energy, goal: relax), this option best matches your current situation."

**4. Visual Design**
- Success indicator icon
- Color-coded confidence score
- Clean, easy-to-read layout

### Why This Recommendation?

The system considers:
- Time constraints
- Current energy level
- Stated objective
- Option characteristics (via tags)

**Example Scenario:**

```
User Input:
- Time: 10 minutes
- Energy: Low
- Goal: Relax

Options:
1. "Watch a movie" (relaxing, entertainment, long, passive)
2. "Go for a run" (active, quick, intense)
3. "Quick meditation" (relaxing, quick, passive, calm)

Result: "Quick meditation" ✓
Reason: Matches time constraint (quick), energy level (relaxing, passive),
        and goal (relaxing, calm)
Confidence: 95%
```

---

## Feedback System

### Purpose

Feedback helps:
- Track recommendation accuracy
- Improve future recommendations
- Build user history
- Provide insights on decision patterns

### How It Works

After receiving a recommendation, users can rate it:

**Positive Feedback**
- "Yes, helpful" button
- Indicates the recommendation was good
- Stores positive rating in database

**Negative Feedback**
- "Not helpful" button
- Indicates the recommendation missed the mark
- Stores negative rating in database

### Data Collected

- User ID
- Decision ID
- Option chosen (the recommended one)
- Rating (positive/negative)
- Timestamp

### Future Enhancements

Feedback data can be used for:
- Machine learning improvements
- Personalized recommendations
- User preference learning
- Algorithm refinement
- Success metrics

---

## Decision History

### Overview

Users can view all their past decisions with complete details.

### Information Displayed

**For Each Decision:**
- Decision title
- Creation date
- All options
- Tags for each option
- Feedback submitted (if any)
- Recommended choice
- Rating given

### Features

**Filtering** (Future):
- By date range
- By feedback rating
- By decision type

**Sorting Options**:
- Most recent first (default)
- Oldest first
- By rating

**Search** (Future):
- Search by title
- Search by options
- Search by tags

### Empty State

When no decisions exist:
- Clear message explaining the state
- Call-to-action button
- Encourages first decision creation

### Decision Card Design

Each card shows:
- Visual card with shadow
- Title prominently displayed
- Date in friendly format
- Options as colored badges
- Feedback indicators
- "View Details" button

---

## Additional Features

### Responsive Design

**Mobile (< 768px)**:
- Single column layout
- Full-width buttons
- Touch-friendly interactions
- Optimized navigation

**Tablet (768px - 1024px)**:
- Two-column grid
- Adapted spacing
- Readable text sizes

**Desktop (> 1024px)**:
- Three-column grid
- Maximum width containers
- Optimal reading width

### Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader friendly
- Color contrast compliance

### Performance

- Server-side rendering (Next.js)
- Optimized images
- Code splitting
- Fast database queries
- Cached sessions
- Minimal bundle size

### Security

- Password hashing (bcrypt)
- JWT session tokens
- HTTP-only cookies
- CSRF protection
- Input sanitization
- SQL injection prevention
- XSS protection

---

## Future Feature Roadmap

### Planned Features

**Phase 1 (MVP) - ✅ Complete**
- User authentication
- Decision creation
- Question engine
- Recommendation system
- Feedback collection
- History viewing

**Phase 2 - Coming Soon**
- User preference learning
- Advanced analytics
- Decision templates
- Export history to PDF
- Email notifications
- Dark mode

**Phase 3 - Future**
- Collaborative decisions
- AI-powered insights
- Mobile app (iOS/Android)
- Calendar integration
- Recurring decisions
- Social sharing
- Decision categories
- Advanced statistics

### Contribution

Want to add a feature? Check CONTRIBUTING.md for guidelines!