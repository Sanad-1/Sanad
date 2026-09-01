# Deploying the OTP login backend

No Supabase CLI project is linked in this repo, so the simplest path is the
Supabase Dashboard (no CLI install needed). If you do have the CLI set up
against this project, the equivalent commands are noted too.

## 1. Run the schema migration

Dashboard → SQL Editor → New query → paste the contents of `schema.sql`
(the whole file — every step is written to be safe to rerun) → Run.

## 2. Create a Twilio Verify Service (if you don't have one yet)

Twilio Console → Verify → Services → Create new. Takes about 30 seconds,
no cost until the first code is sent. Copy the Service SID (starts `VA`).

## 3. Set Edge Function secrets

Dashboard → Project Settings → Edge Functions → Secrets (or
`supabase secrets set` if using the CLI), add:

- `TWILIO_API_KEY_SID` — your Twilio API Key SID (starts `SK`)
- `TWILIO_API_KEY_SECRET` — the matching API Key secret
- `TWILIO_VERIFY_SERVICE_SID` — the Verify Service SID from step 2 (starts `VA`)

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
into every Edge Function — nothing to set for those.

**Do not** put any of these values into `app.js`, `index.html`, or any
other file that ships to the browser — they must only ever exist as Edge
Function secrets.

## 4. Deploy the two functions

Dashboard → Edge Functions → Create a new function named `send-otp`,
paste in `functions/send-otp/index.ts`, deploy. Repeat for `verify-otp`
with `functions/verify-otp/index.ts`.

CLI equivalent, if you have it linked:

```
supabase functions deploy send-otp
supabase functions deploy verify-otp
```

## 5. Test it

From the deployed site: Profile → sign-in → enter a real WhatsApp number
→ you should receive a code on WhatsApp within a few seconds → enter it
→ you should land back in the app signed in.
