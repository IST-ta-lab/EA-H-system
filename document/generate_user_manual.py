"""
Generate UserManual.docx from UserManual.md, with screenshot placeholders.
Each major section has a [SCREENSHOT: ...] placeholder you can replace later.
"""
from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

# === Page setup ===
section = doc.sections[0]
section.left_margin = Cm(2.0)
section.right_margin = Cm(2.0)
section.top_margin = Cm(2.0)
section.bottom_margin = Cm(2.0)

# === Default font ===
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)

# === Helpers ===
def add_h1(text):
    p = doc.add_heading(text, level=1)
    return p

def add_h2(text):
    p = doc.add_heading(text, level=2)
    return p

def add_h3(text):
    p = doc.add_heading(text, level=3)
    return p

def add_para(text, bold=False, italic=False):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    return p

def add_bullet(text):
    p = doc.add_paragraph(text, style='List Bullet')
    return p

def add_number(text):
    p = doc.add_paragraph(text, style='List Number')
    return p

def add_screenshot_placeholder(label, description=""):
    """Insert a visible placeholder where the user can replace with a screenshot."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.0)
    # Add subtle shading
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:fill'), 'F2F4F7')
    tc_pr.append(shd)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(f"📸 [SCREENSHOT: {label}]")
    run.bold = True
    run.font.color.rgb = RGBColor(0x66, 0x7E, 0xEA)
    run.font.size = Pt(11)
    if description:
        p2 = cell.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2 = p2.add_run(description)
        r2.italic = True
        r2.font.size = Pt(9)
        r2.font.color.rgb = RGBColor(0x88, 0x88, 0x88)
    doc.add_paragraph()

def add_table(headers, rows):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Light Grid Accent 1'
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for run in hdr[i].paragraphs[0].runs:
            run.bold = True
    for row_data in rows:
        cells = table.add_row().cells
        for i, val in enumerate(row_data):
            cells[i].text = str(val)
    doc.add_paragraph()

# === Title ===
title = doc.add_heading('TA Recruitment System', level=0)
sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = sub.add_run('User Manual')
r.font.size = Pt(20); r.bold = True; r.font.color.rgb = RGBColor(0x66, 0x7E, 0xEA)

meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
meta.add_run('BUPT International School TA Hiring System (tapj)\n').italic = True
meta.add_run('Version 1.0 — 2026').italic = True

doc.add_page_break()

# === TOC ===
add_h1('Table of Contents')
toc_items = [
    '1. Getting Started — Login & Registration',
    '2. TA User Guide (ta.html)',
    '3. MO User Guide (mo.html)',
    '4. Admin User Guide (admin.html)',
    '5. Messaging Center (message.html)',
    '6. AI Career Advice (suggestion.html)',
    '7. Troubleshooting',
]
for t in toc_items:
    add_para(t)
doc.add_page_break()

# ============================================================
# 1. Getting Started
# ============================================================
add_h1('1. Getting Started — Login & Registration')

add_para('Entry page: index.html (welcome page) or login.html (standalone login).')

add_screenshot_placeholder(
    'Login & Registration page',
    'Capture the index.html showing both Login and Register tabs'
)

add_h2('Registering a new account')
add_number('On index.html, click the Register tab.')
add_number('Choose your role from the dropdown: TA or MO. (Admin accounts must be created by an existing administrator.)')
add_number('Fill in the required fields (marked with *):')
add_bullet('Username (must be unique) and Password')
add_bullet('Real name, email')
add_bullet('TA-only: Student ID, Major, Education, Grade')
add_bullet('MO-only: Staff ID, Department')
add_number('Click Register Now. On success, you are logged in automatically and redirected to your role\'s home page.')

add_screenshot_placeholder(
    'Registration form (TA)',
    'Capture the Register tab with TA fields filled'
)

add_h2('Logging in')
add_number('Enter your username and password on the Login tab.')
add_number('(Optional) Tick "Remember username" to save your username for next time.')
add_number('Click Login Now or press Enter.')
add_number('The system automatically redirects you based on your role: TA → ta.html, MO → mo.html, Admin → admin.html.')

add_h2('Login page features')
add_table(
    ['Feature', 'How to use'],
    [
        ['Show / Hide password', 'Click the eye icon next to the password field'],
        ['Caps Lock warning', 'Auto-displayed if Caps Lock is on while typing password'],
        ['Remember username', 'Tick the checkbox; username is saved locally'],
        ['Guest Login', 'Click Guest Login to browse jobs without registering'],
        ['Auto-redirect', 'If a session is active, you are redirected immediately'],
    ]
)

doc.add_page_break()

# ============================================================
# 2. TA Guide
# ============================================================
add_h1('2. TA User Guide')
add_para('Page: ta.html — your home page after logging in as a Teaching Assistant.')

add_screenshot_placeholder(
    'TA home page (ta.html)',
    'Capture the full ta.html showing job feed and sidebar'
)

add_h2('Top navigation')
add_table(
    ['Icon / Button', 'Action'],
    [
        ['✉ Message icon', 'Open the messaging center'],
        ['👤 Avatar icon', 'View and edit your profile'],
        ['Logout', 'End your session'],
    ]
)

add_h2('Browsing roles')
add_bullet('The main panel shows recommended jobs first (matched to your tags & skills), then all other open positions.')
add_bullet('Each card shows: course/module, required skills, weekly workload, deadline, and a match percentage.')
add_bullet('Click View Details on any card to open the full description.')
add_bullet('Use the search bar to filter by course or professor.')

add_h2('Applying for a position')
add_number('Click View Details on a job card.')
add_number('Scroll to the Submit Application section in the modal.')
add_number('Tick the relevant checkboxes (taken course before, can attend in-person).')
add_number('(Optional) Add notes explaining why you\'re a good fit.')
add_number('Click Submit Application. Track status in the right sidebar.')

add_screenshot_placeholder(
    'Job details + apply modal',
    'Capture the modal showing role description and application form'
)

add_h2('Editing your profile')
add_number('Click your avatar (top-right).')
add_number('Update name, email, major, bio, and skill tags.')
add_number('Toggle visibility to allow MOs to discover you.')
add_number('Click Save Changes.')

add_screenshot_placeholder(
    'Edit profile modal',
    'Capture the profile edit form with tags section'
)

add_h2('Resume management')
add_bullet('Upload Resume — attach a PDF in the profile modal.')
add_bullet('Preview Resume — open in built-in viewer.')
add_bullet('Replace File — upload a new version to overwrite.')

add_h2('AI features for TAs')
add_bullet('Recommendation Center — top-matched jobs sorted by AI score (recommend.html).')
add_bullet('AI Career Advice — personalized guidance on suggestion.html (see Section 6).')

doc.add_page_break()

# ============================================================
# 3. MO Guide
# ============================================================
add_h1('3. MO User Guide')
add_para('Page: mo.html — your home page after logging in as a Module Organizer.')

add_screenshot_placeholder(
    'MO home page (mo.html)',
    'Capture the full mo.html showing posted positions list'
)

add_h2('Posting a new position')
add_number('Click + Post Position in the header.')
add_number('Fill in the modal form:')
add_bullet('Position title (e.g. "CS101: Intro to Programming TA")')
add_bullet('Belongs to module')
add_bullet('Job description — responsibilities and requirements')
add_bullet('Weekly work hours, recruit number, deadline, tags')
add_number('Click Post Position. The job is immediately visible to TAs.')

add_screenshot_placeholder(
    'Post Position modal',
    'Capture the new-job modal with all fields visible'
)

add_h2('Managing your positions')
add_table(
    ['Action', 'Description'],
    [
        ['View Applicants', 'See all TAs who applied for this position'],
        ['Edit', 'Open the post form pre-filled to modify details'],
        ['Close / Delete', 'Stop further applications or remove the post (cascades to applications)'],
    ]
)

add_h2('Reviewing applications')
add_number('Click View Applicants on a position.')
add_number('Click any TA to open their Applicant Profile.')
add_number('Choose an action:')
add_bullet('Approve — application status → Approved; hired count increases. Position auto-closes when quota is filled.')
add_bullet('Reject — application status → Rejected.')
add_bullet('Send Message — open chat with the applicant (jumps to message.html pre-filled).')
add_number('(Optional) Add a remark before approving/rejecting.')

add_screenshot_placeholder(
    'Applicant Profile modal',
    'Capture an applicant detail view with Approve/Reject buttons'
)

add_h2('Recommendations for MOs')
add_para('Click Recommend TAs (or visit recommend.html) to get an AI-ranked list of best-matching candidates for any of your positions.')

doc.add_page_break()

# ============================================================
# 4. Admin Guide
# ============================================================
add_h1('4. Admin User Guide')
add_para('Page: admin.html — only accessible to users with administrator privileges.')

add_screenshot_placeholder(
    'Admin dashboard (admin.html)',
    'Capture the full admin.html showing all 4 sections'
)

add_h2('Dashboard sections')
add_number('System Statistics Report — aggregate counts of users, jobs, and applications.')
add_number('System Users Management — full list of registered users.')
add_number('Role Change Requests — review and approve/reject pending role changes.')
add_number('All Jobs Management — view and moderate every posted position.')

add_h2('Managing users')
add_bullet('The user table shows username, real name, role, email, and registration date.')
add_bullet('Click a row to open Teaching Assistant Details (or MO/Admin details).')
add_bullet('Delete a user — removes their account and cascading data. This action cannot be undone.')

add_screenshot_placeholder(
    'User details modal',
    'Capture a user details popup showing applications/posted jobs'
)

add_h2('Managing jobs')
add_bullet('The job table lists every position from every MO.')
add_bullet('Click a job to view its details and applicant list.')
add_bullet('Delete a job — removes the position and all associated applications.')

add_h2('Best practices')
add_bullet('Verify user identities before approving role changes.')
add_bullet('Before deleting a user, check pending applications or active positions.')
add_bullet('Use the statistics dashboard to monitor recruitment health each semester.')

doc.add_page_break()

# ============================================================
# 5. Messaging Center
# ============================================================
add_h1('5. Messaging Center')
add_para('Page: message.html — accessible from the ✉ icon on any role\'s main page.')

add_screenshot_placeholder(
    'Message center (message.html)',
    'Capture the two-pane layout with conversation list + chat window'
)

add_h2('Layout')
add_bullet('Left panel — your conversation list. A red dot marks unread messages.')
add_bullet('Right panel — the active chat window with the selected user.')

add_h2('Starting a new conversation')
add_number('Click the + button at the top of the conversation list.')
add_number('Enter the recipient\'s User ID and a name/note.')
add_number('Click Start Chat.')
add_para('Tip: Clicking "Send Message" on an applicant card or job poster card auto-fills the recipient — no manual ID lookup needed.', italic=True)

add_screenshot_placeholder(
    'New conversation modal',
    'Capture the modal asking for User ID and Name'
)

add_h2('Sending a message')
add_number('Click any conversation in the left list.')
add_number('(Optional) Fill in Linked Job ID and Linked Job title for context.')
add_number('Type your message — maximum 500 characters (counter appears above 400).')
add_number('Press Enter to send, or click Send. Use Shift+Enter for line break (future).')

add_h2('Reading messages')
add_bullet('Opening a conversation marks all its unread messages as read.')
add_bullet('The unread badge in the top bar updates automatically.')
add_bullet('Press ESC to close any open dialog.')

doc.add_page_break()

# ============================================================
# 6. AI Career Advice
# ============================================================
add_h1('6. AI Career Advice')
add_para('Page: suggestion.html — TA-only feature that generates personalized application advice using AI (DeepSeek).')

add_screenshot_placeholder(
    'AI Career Advice page (suggestion.html)',
    'Capture the page with a generated advice result visible'
)

add_h2('What it does')
add_para('The AI advisor analyzes your profile (major, grade, tags, self-introduction) and your top recommended jobs, then produces 300-500 words of tailored career guidance — covering competitive strengths, application strategy, and skills to improve.')

add_h2('Generating advice')
add_number('Open suggestion.html (entry from the TA home page).')
add_number('The page automatically generates your first piece of advice if no cached result exists.')
add_number('To regenerate, click "✨ Generate Advice" or press Ctrl + Enter.')

add_screenshot_placeholder(
    'Loading state with elapsed timer',
    'Capture the spinner + "Elapsed Xs" indicator during generation'
)

add_h2('Reading the result')
add_bullet('The result card shows formatted advice with headings, bullets, bold text.')
add_bullet('Top of result: timestamp, word count, your name, freshness badge (Just generated / Cached).')
add_bullet('Loading time: typically 5-30 seconds — a live timer shows elapsed seconds.')

add_h2('Saving / sharing your advice')
add_table(
    ['Button', 'Action'],
    [
        ['📋 Copy', 'Copy plain text to clipboard'],
        ['⬇ Download', 'Save as a Markdown file: suggestion_<name>_<date>.md'],
        ['🖨 Print', 'Open the print dialog (or "Save as PDF")'],
        ['🔄 Regenerate', 'Run the AI again for a fresh perspective'],
    ]
)

add_screenshot_placeholder(
    'Result card with action buttons',
    'Capture the advice result showing Copy / Download / Print / Regenerate'
)

add_h2('Tips for better advice')
add_bullet('Complete your profile: bio, major, grade')
add_bullet('Add 3-5 relevant skill tags (e.g. Python, Grading, ML)')
add_bullet('Upload your resume and set profile to "visible to others"')
add_bullet('Results may vary slightly between generations — compare and pick the best')

doc.add_page_break()

# ============================================================
# 7. Troubleshooting
# ============================================================
add_h1('7. Troubleshooting')

add_table(
    ['Problem', 'Solution'],
    [
        ['"Not signed in" error', 'Your session expired (after 1 hour). Sign in again.'],
        ['"Permission denied" on suggestion page', 'Only TA users can generate advice. MO/Admin will see 403.'],
        ['AI advice fails: "AI_API_TOKEN not configured"', 'Backend has no AI key set. Contact the administrator.'],
        ["Can't apply to a job", 'The job may be closed, filled, or you may have already applied.'],
        ['Messages not sending', 'Check the recipient\'s user ID is correct; the user must still exist.'],
        ['Caps Lock warning on login', 'Disable Caps Lock and try again.'],
        ["Page won't load after login", 'Clear browser cookies and re-login. Cookies must be enabled.'],
        ['Resume preview is blank', 'File upload may have failed; click Replace File to retry.'],
        ['Forgot password', 'Contact an administrator — no self-service reset yet.'],
    ]
)

add_h2('Browser requirements')
add_bullet('Modern browsers: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+')
add_bullet('JavaScript must be enabled')
add_bullet('Cookies must be enabled (used for session management)')
add_bullet('Recommended screen width: 1280 px or wider; mobile layouts available below 600 px')

add_h2('Getting help')
add_bullet('For account / system issues: contact your Administrator')
add_bullet('For TA application questions: contact the MO via the Messaging Center')
add_bullet('For technical bugs: report via your group\'s project repository')

# === Save ===
output_path = r'E:\EA-H-system\document\UserManual.docx'
doc.save(output_path)
print(f'Saved: {output_path}')

# Count placeholders
import re
with open(__file__, 'r', encoding='utf-8') as f:
    code = f.read()
n_placeholders = code.count('add_screenshot_placeholder(')
print(f'Total screenshot placeholders: ~{n_placeholders - 1}')  # -1 for the function definition reference
