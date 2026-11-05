// Vercel Serverless Function: securely send OneSignal Web Push notifications
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const expectedToken = process.env.ONESIGNAL_ADMIN_TOKEN;
  const suppliedToken = req.headers["x-admin-token"];
  if (!expectedToken || !suppliedToken || suppliedToken !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const appId = process.env.ONESIGNAL_APP_ID;
  const restKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!appId || !restKey) return res.status(500).json({ error: "OneSignal environment variables are missing" });
  const { title, message, url } = req.body || {};
  if (typeof title !== "string" || typeof message !== "string" || !title.trim() || !message.trim()) {
    return res.status(400).json({ error: "title and message are required" });
  }
  try {
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Key ${restKey}` },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Subscribed Users"],
        headings: { en: title, ar: title },
        contents: { en: message, ar: message },
        ...(typeof url === "string" && /^https:\/\//i.test(url) ? { url } : {})
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: result.errors || result.message || "OneSignal request failed" });
    return res.status(200).json({ ok: true, id: result.id, recipients: result.recipients });
  } catch {
    return res.status(502).json({ error: "OneSignal service unreachable" });
  }
}
