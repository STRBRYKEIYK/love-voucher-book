# Love Voucher Book

A one-page love voucher booklet for Chicaaaaa: 7 redeemable vouchers and a scratch-to-reveal surprise.

Plain HTML, CSS and JavaScript, plus one small Vercel function. No build step.

## Run it

Open `index.html` to see the page. The redeem alerts only work when the folder is deployed on Vercel.

## Redeem alerts

When she taps REDEEM (or scratches voucher #8), the page calls `/api/redeem`, which pings Keith.
The function only accepts a voucher number, and the message text lives in `api/redeem.js`.
The page only says "nakarating na sa akin" if the function confirms a message went out.

Turn channels on with environment variables in Vercel (see `.env.example`):

| Channel | Variables |
| --- | --- |
| Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Email (Resend) | `RESEND_API_KEY`, `NOTIFY_EMAIL` |
| WhatsApp (CallMeBot, optional) | `CALLMEBOT_APIKEY`, `NOTIFY_PHONE` |

Keep real values in Vercel only, never in this repo.

## Notes

- Redeemed vouchers are remembered in the browser (`localStorage`), per device.
- A redeemed voucher also offers a WhatsApp button with a ready message.
