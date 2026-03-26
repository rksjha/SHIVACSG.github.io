# SCG Client Sourcing System

A lightweight, deployable browser-based intake and qualification system for Shiva Consultancy Group.

## What it does
- Rapid client / DSA intake form
- Opportunity scoring out of 100
- A / B / C lead categorization
- Suggested action logic
- Local lead register in browser storage
- JSON export of all saved leads
- Printable intake sheet

## Files
- `index.html` — main application
- `styles.css` — styling
- `app.js` — logic and lead scoring

## Fast deployment options

### Option 1: GitHub Pages
1. Create a new GitHub repository
2. Upload these files to the root
3. Go to **Settings → Pages**
4. Set source to **Deploy from branch**
5. Select **main** branch and **/root**
6. Your intake system will go live as a static site

### Option 2: Netlify / Vercel
Upload the folder as a static site.

## Notes
- This version stores leads in browser localStorage, so each browser/device maintains its own copy.
- For a multi-user production version, connect it to Google Sheets, Airtable, Supabase, or a backend CRM.

## Suggested production upgrades
- DSA login
- Admin dashboard
- Google Sheets sync
- Auto-email notification to SCG
- Mandatory document request workflow
- Lead owner allocation
- Status pipeline: New / Screening / Qualified / Rejected / On Hold / Won
