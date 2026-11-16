// Pings Keith when a voucher is redeemed. Message text lives here, never in the request.
const notify = require("./_notify.js");

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

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
  const n = Number(req.body && req.body.n);
  if (!Number.isInteger(n) || !TITLES[n]) { res.status(400).json({ ok: false }); return; }
  const when = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });
  const out = await notify("CHICAAAAA REDEEMED VOUCHER #" + n + ": " + TITLES[n] + " (" + when + " PHT)", "Voucher #" + n + " redeemed");
  res.status(200).json(out);
};
