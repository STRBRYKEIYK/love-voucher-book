// Vercel serverless function: pings Keith when a voucher is redeemed.
// Channels switch on by environment variables (see README). Message text is fixed here,
// never taken from the request, so only a voucher number can be sent in.
const TITLES = {
  1: "ISANG KANTA PARA SAYO",
  2: "ISANG TAWAG MULA SA AKIN",
  3: "ISANG MAHIGPIT NA YAKAP",
  4: "TAKOYAKI O CHEESECAKE",
  5: "ISANG DATE, IKAW ANG BAHALA",
  6: "ISANG SURPRISE",
  7: "UNLIMITED NA I LOVE YOU",
  8: "SURPRISE: AKO. HABAMBUHAY. (NAKUSKOS NA)"
};

async function post(url, body, headers) {
  const r = await fetch(url, { method: "POST", headers: Object.assign({ "content-type": "application/json" }, headers), body: JSON.stringify(body) });
  return r.ok;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
  const n = Number(req.body && req.body.n);
  if (!Number.isInteger(n) || !TITLES[n]) { res.status(400).json({ ok: false }); return; }

  const when = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });
  const text = "CHICAAAAA REDEEMED VOUCHER #" + n + ": " + TITLES[n] + " (" + when + " PHT)";
  const env = process.env;
  const jobs = {};

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    jobs.telegram = post("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", { chat_id: env.TELEGRAM_CHAT_ID, text });
  }
  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    jobs.email = post("https://api.resend.com/emails",
      { from: "Love Voucher Book <onboarding@resend.dev>", to: [env.NOTIFY_EMAIL], subject: "Voucher #" + n + " redeemed", text },
      { authorization: "Bearer " + env.RESEND_API_KEY });
  }
  if (env.CALLMEBOT_APIKEY && env.NOTIFY_PHONE) {
    const u = "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(env.NOTIFY_PHONE) +
      "&text=" + encodeURIComponent(text) + "&apikey=" + encodeURIComponent(env.CALLMEBOT_APIKEY);
    jobs.whatsapp = fetch(u).then(r => r.ok);
  }

  const keys = Object.keys(jobs);
  const results = await Promise.allSettled(keys.map(k => jobs[k]));
  const sent = {};
  keys.forEach((k, i) => { sent[k] = results[i].status === "fulfilled" && results[i].value === true; });
  res.status(200).json({ ok: Object.values(sent).some(Boolean), sent });
};
