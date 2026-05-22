# care-platform-api

A NestJS API project for the Care Management system.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Apply database schema (after auth schema changes, reset dev data if needed):
   ```bash
   npx prisma db push
   ```
   If you have existing OTP-era users without passwords, reset the dev database:
   ```bash
   npx prisma db push --force-reset
   ```

3. Run in development mode:
   ```bash
   npm run start:dev
   ```

4. API docs: `http://localhost:3000/api/docs`

## Authentication

Password-based auth endpoints under `/auth`:

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/auth/register` | `email`, `firstName`, `lastName`, `phone`, `password` |
| POST | `/auth/login` | `email`, `password` |
| POST | `/auth/forgot-password` | `email` |
| POST | `/auth/reset-password` | `token`, `password` |
| GET | `/auth/me` | Bearer access token |

### Email (forgot password)

Uses `@nestjs-modules/mailer` with Gmail SMTP from `.env` (see `.env.example`).

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your.email@gmail.com
MAIL_PASS=your-google-app-password
MAIL_FROM=Care Platform <your.email@gmail.com>
```

1. Turn on [2-Step Verification](https://myaccount.google.com/security) for your Google account.
2. Create an [App Password](https://myaccount.google.com/apppasswords) and put it in `MAIL_PASS` (not your normal Gmail password).
3. `MAIL_USER` and `MAIL_FROM` should use the same Gmail address.

**Without SMTP configured:** reset link and token are logged to the server console.

**Production later:** change `MAIL_HOST` / credentials to SendGrid, AWS SES, Resend, etc. — no code changes needed.
