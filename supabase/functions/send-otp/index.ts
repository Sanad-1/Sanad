// Supabase Edge Function: send-otp
// Body: { phone: string }  (E.164 format, e.g. "+966501234567")
// Sends a WhatsApp verification code via Twilio Verify. Stores nothing
// itself — Twilio Verify manages the code, its expiry, and attempt limits.

const TWILIO_API_KEY_SID = Deno.env.get("TWILIO_API_KEY_SID")!;
const TWILIO_API_KEY_SECRET = Deno.env.get("TWILIO_API_KEY_SECRET")!;
const TWILIO_VERIFY_SERVICE_SID = Deno.env.get("TWILIO_VERIFY_SERVICE_SID")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function isValidPhone(phone: unknown): phone is string {
  return typeof phone === "string" && /^\+[1-9]\d{7,14}$/.test(phone);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { phone } = await req.json();

    if (!isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ error: "invalid_phone" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`;
    const body = new URLSearchParams({ To: phone, Channel: "whatsapp" });
    const auth = btoa(`${TWILIO_API_KEY_SID}:${TWILIO_API_KEY_SECRET}`);

    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      // An API Key SID/Secret pair authenticates via Basic Auth exactly
      // like an Account SID/Auth Token pair would — Twilio resolves the
      // key to its parent account, so no separate account id is needed.
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!twilioRes.ok) {
      const detail = await twilioRes.text();
      console.error("Twilio send-otp failed:", twilioRes.status, detail);
      return new Response(
        JSON.stringify({ error: "send_failed" }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-otp error:", err);
    return new Response(
      JSON.stringify({ error: "server_error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
