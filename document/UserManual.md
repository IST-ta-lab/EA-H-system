# TA Recruitment System — User Manual

**System:** BUPT International School TA Hiring System (tapj)
**Audience:** Teaching Assistants (TA), Module Organizers (MO), Administrators
**Base URL:** `http://<server>:8080/tapj/`

---

## Table of Contents

1. [Getting Started — Login & Registration](#1-getting-started)
2. [TA User Guide (`ta.html`)](#2-ta-user-guide)
3. [MO User Guide (`mo.html`)](#3-mo-user-guide)
4. [Admin User Guide (`admin.html`)](#4-admin-user-guide)
5. [Messaging Center (`message.html`)](#5-messaging-center)
6. [AI Career Advice (`suggestion.html`)](#6-ai-career-advice)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Getting Started — Login & Registration

**Entry page:** `index.html` (the system's welcome page) or `login.html` (the standalone login page).

### Registering a new account

1. On `index.html`, click the **Register** tab.
2. Choose your role from the dropdown: **TA** or **MO**. (Admin accounts must be created by an existing administrator.)
3. Fill in the required fields (marked with `*`):
   - **Username** (must be unique)
   - **Password**
   - Real name, email
   - TA-only: Student ID, Major, Education, Grade
   - MO-only: Staff ID, Department
4. Click **Register Now**. On success, you are logged in automatically and redirected to your role's home page.

### Logging in

1. Enter your **username** and **password** on the login tab.
2. (Optional) Tick **"Remember username"** to save your username locally for next time.
3. Click **Login Now** or press **Enter**.
4. The system automatically redirects you to:
   - `ta.html` if you are a TA
   - `mo.html` if you are an MO
   - `admin.html` if you are an administrator

### Useful shortcuts on the login page

- **Show / Hide password** — eye icon next to the password field
- **Caps Lock warning** — automatically displayed if Caps Lock is on
- **Guest Login** — browse jobs without registering (read-only mode via `guest.html`)
- **Already signed in?** The page auto-detects an active session and redirects you immediately.

---

## 2. TA User Guide

**Page:** `ta.html` — your home page after logging in as a TA.

### Top navigation

| Icon / Button | Action |
|---|---|
| ✉️ Message icon | Open the messaging center |
| 👤 Avatar icon | View and edit your profile |
| Logout | End your session |

### Main feed — Browsing roles

- The center panel displays **recommended jobs first** (matched to your tags and skills), followed by all other open positions.
- Each job card shows: course/module name, required skills, weekly workload, deadline, and a **match percentage** (how well your profile fits).
- Click **View Details** on any card to open the full role description.
- Use the **search bar** to filter by course name or professor.

### Applying for a position

1. Click **View Details** on a job card.
2. In the job modal, scroll to the **Submit Application** section.
3. Tick the relevant boxes:
   - "I have taken this course before"
   - "I can attend in-person sessions"
4. (Optional) Add a note in **Additional Notes** explaining why you're a good fit.
5. Click **Submit Application**.
6. Track your application status under the right sidebar (Pending / Approved / Rejected).

### Editing your profile

1. Click your **avatar** (top-right).
2. In the Edit Profile modal you can update:
   - Name, email, major, bio
   - Skill **tags** (click to toggle popular ones, or add custom)
   - **Visibility** — make your profile discoverable by MOs
3. Click **Save Changes**.

### Uploading / previewing your resume

- In the profile modal, click **Upload Resume** to attach a PDF.
- Click **Preview Resume** to open it in a built-in viewer.
- Use **Replace File** to update an existing resume.

### AI features for TAs

- **Recommendation Center** — click the recommendation entry to see top-matched jobs sorted by AI score (`recommend.html`).
- **AI Career Advice** — open `suggestion.html` for personalized career guidance (see Section 6).

---

## 3. MO User Guide

**Page:** `mo.html` — your home page after logging in as a Module Organizer.

### Posting a new position

1. Click **+ Post Position** in the header.
2. Fill in the modal form:
   - **Position title** (e.g. "CS101: Intro to Programming TA")
   - **Belongs to module**
   - **Job description** — responsibilities and requirements
   - **Weekly work hours**
   - **Number to recruit**
   - **Application deadline**
   - **Tags** (helps AI matching)
3. Click **Post Position**. The job appears in your list and is immediately visible to TAs.

### Managing your positions

The main panel lists all positions you have posted. For each one:

- **View Applicants** — see all TAs who applied
- **Edit** — open the post form pre-filled to modify details
- **Close** / **Delete** — close further applications or remove the post entirely (deleted jobs also remove their applications via cascade)

### Reviewing applications

1. Click **View Applicants** on a position.
2. In the applicant list, click on any TA to open their **Applicant Profile**:
   - Real name, major, year, skills/tags
   - Self-introduction, resume PDF preview
3. Choose an action:
   - **Approve** — application status → Approved; the position's hired count increases. When the recruit quota is filled, the position auto-closes.
   - **Reject** — application status → Rejected
   - **Send Message** — open a chat with the applicant (jumps to `message.html` pre-filled)
4. Add an optional **remark** before approving/rejecting.

### Recommendations for MOs

- Click **Recommend TAs** (or visit `recommend.html`) to get an AI-ranked list of best-matching candidates for any of your posted positions.

---

## 4. Admin User Guide

**Page:** `admin.html` — only accessible to users with `userType=3`.

### Dashboard sections

1. **System Statistics Report** — aggregate counts of users, jobs, and applications.
2. **System Users Management** — full list of registered users.
3. **Role Change Requests** — review and approve/reject pending role changes.
4. **All Jobs Management** — view and moderate every posted position.

### Managing users

- The user table shows username, real name, role (TA/MO/Admin), email, and registration date.
- **Click a row** to open **Teaching Assistant Details** (or MO/Admin details). You see their full profile, applications, and posted jobs.
- **Delete a user** — removes their account and cascading data (TA profile / MO profile / applications). Use with caution; this action cannot be undone.

### Managing jobs

- The job table lists every position from every MO.
- **Click a job** to view its details and applicant list.
- **Delete a job** — removes the position and all associated applications.

### Best practices for administrators

- Verify user identities before approving role changes.
- Before deleting a user, check whether they have pending applications or active positions that might affect others.
- Use the statistics dashboard to monitor recruitment health each semester.

---

## 5. Messaging Center

**Page:** `message.html` — accessible from the ✉️ icon on any role's main page.

### Layout

- **Left panel** — your conversation list. An unread red dot marks new messages.
- **Right panel** — the active chat window with the selected user.

### Starting a new conversation

1. Click the **+** button at the top of the conversation list.
2. Enter the recipient's **User ID** (visible on job details, applicant profiles, or admin pages) and a name/note.
3. Click **Start Chat**.

> **Tip:** When you click *Send Message* on a TA's applicant card (MO side) or a job poster's card (TA side), the system pre-fills the recipient automatically — no need to look up IDs manually.

### Sending a message

1. Click any conversation in the left list to open it.
2. (Optional) Fill in **Linked Job ID** and **Linked Job title** to attach context.
3. Type your message in the bottom box. Maximum **500 characters** (counter appears above 400).
4. Press **Enter** to send, or click **Send**. Use **Shift+Enter** for a line break (future).

### Reading messages

- Opening a conversation marks all its unread messages as read.
- The unread badge in the top bar updates automatically.
- Press **ESC** to close any open dialog (e.g., the new-conversation form).

---

## 6. AI Career Advice

**Page:** `suggestion.html` — TA-only feature that generates personalized application advice using AI.

### What it does

The AI advisor analyzes your profile (major, grade, tags, self-introduction) and your top recommended jobs, then produces 300-500 words of tailored career guidance — covering your competitive strengths, application strategy for your best-matching roles, and skills to improve.

### Generating advice

1. Open `suggestion.html` (entry via "AI Advice" link from the TA home page).
2. The page automatically generates your first piece of advice (TA users with no cached result).
3. To regenerate, click **✨ Generate Advice** or press **Ctrl + Enter**.

### Reading the result

- The result card shows the generated advice with rich formatting (headings, bullets, bold).
- Top of the result: timestamp, approximate word count, your name, and a freshness badge (**Just generated** / **Last result (cached)**).
- Loading time is typically **5–30 seconds** — a live timer shows elapsed seconds.

### Saving / sharing your advice

| Button | Action |
|---|---|
| 📋 Copy | Copy plain text to clipboard |
| ⬇ Download | Save as a Markdown file `suggestion_<name>_<date>.md` |
| 🖨 Print | Open the print dialog (or "Save as PDF") |
| 🔄 Regenerate | Run the AI again for a fresh perspective |

### Advanced — generating advice for another TA

- Click **"Advanced: generate for a specific TA"** to reveal an input box for a target `userId`.
- Regular TAs can only generate advice for themselves; admins/MOs are blocked at the backend (returns 403).

### Tips for better advice

- **Complete your profile**: bio, major, grade
- **Add 3–5 relevant skill tags** (e.g. Python, Grading, ML)
- **Upload your resume** and set profile to "visible to others"
- Results may vary slightly between generations — compare and pick the best version

---

## 7. Troubleshooting

| Problem | Solution |
|---|---|
| **"Not signed in" error** | Your session expired (after 1 hour of inactivity). Sign in again. |
| **"Permission denied" on suggestion page** | Only TA users can generate advice. MO/Admin will see 403. |
| **AI advice fails with "AI_API_TOKEN not configured"** | Backend has no AI key set. Contact the administrator. |
| **Can't apply to a job** | The job may be closed, filled, or you may have already applied. |
| **Messages not sending** | Check the recipient's user ID is correct; the user must still exist. |
| **Caps Lock warning on login** | Disable Caps Lock and try again. |
| **Page won't load after login** | Clear browser cookies and re-login. Make sure cookies are enabled. |
| **Resume preview is blank** | The file may have failed to upload; click **Replace File** to try again. |
| **Forgot password** | Contact an administrator — currently no self-service password reset. |

### Browser requirements

- Modern browsers: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- JavaScript must be enabled
- Cookies must be enabled (used for session management)
- Recommended screen width: 1280 px or wider; mobile layouts available below 600 px

### Getting help

- For account or system issues: contact your **Administrator**
- For TA application questions: contact the **MO** who posted the position via the Messaging Center
- For technical bugs: report via your group's project repository
