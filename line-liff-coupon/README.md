# LINE LIFF Coupon Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that uses the LINE Front-end Framework (LIFF) to allow users to view and redeem coupons, and send the coupon redemption information back to LINE using the Messaging API.

## Environment Variables Setup

To run this project, you'll need to set up your LINE Channel Access Token as an environment variable.

### LINE Channel Access Token

1. Go to the [LINE Developers Console](https://developers.line.biz/console/)
2. Log in with your LINE account
3. Create or select your provider
4. Create or select your Messaging API channel
5. Go to the "Messaging API" tab
6. Scroll down to find the "Channel access token" section
7. Generate a long-lived channel access token or use the existing one
8. Copy the token

### Setting up the .env.local file

1. Create a file named `.env.local` in the root directory of your project
2. Add your LINE Channel Access Token to the file:

```
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
```

3. Replace `your_line_channel_access_token_here` with the actual token you copied from the LINE Developers Console

### Important Notes

- Never commit your `.env.local` file to version control
- For production deployment, set the environment variables in your hosting provider's dashboard
- For local development, the `.env.local` file will be automatically loaded by Next.js

## Getting Started

After setting up your environment variables, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
