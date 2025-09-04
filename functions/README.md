# Firebase Functions – Task Reminders

This directory contains scheduled Cloud Functions to send email reminders for overdue and due-soon tasks.

## What it does

- Runs daily at 08:00 UTC
- Reads tasks from Firestore `tasks` collection
- Groups by `student_id`
- Looks up user email (Auth or `users/{uid}`)
- Sends consolidated email via SendGrid (optional)

## Setup

1) Install deps

```bash
cd functions
npm install
```

2) Configure SendGrid (optional but recommended)

- Create an API key at https://sendgrid.com/
- Set environment variable locally for emulator or CI:

```bash
export SENDGRID_API_KEY=YOUR_KEY
```

- Or set in Cloud Functions runtime config (if using secrets, prefer that):

```bash
firebase functions:secrets:set SENDGRID_API_KEY
```

3) Deploy

```bash
npm run deploy
```

## Data model expected

Collection: `tasks`

Minimal fields required per document:

- `student_id`: string (must match Firebase Auth UID)
- `start_date`: ISO string
- `status`: one of `not_started`, `in_progress`, `completed`, `overdue`, `cancelled`
- `title`: string (recommended)

Adjust queries as needed for your schema.

## Notes

- If `SENDGRID_API_KEY` is not set, function logs and skips sending emails.
- For local testing, use the emulator: `npm run serve`.


