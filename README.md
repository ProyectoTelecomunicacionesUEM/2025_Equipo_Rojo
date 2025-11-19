[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnexi-launch%2Ffinwise-landing-page)

# Finwise - Next.js + Tailwind Landing Page Template

Finwise is a lightweight, easily configurable, and customizable **Next.js** and **Tailwind CSS** landing page template. It’s built to be adaptable, performant, and perfect for any product launch, portfolio, or promotional site.

Try out the demo here: [https://finwise-omega.vercel.app](https://finwise-omega.vercel.app).

Please check out the documentation below to get started.

---

## Features

- **Next.js** app router with **TypeScript**
- **Tailwind CSS** v3 for flexible styling customization
- Smooth transitions powered by **Framer Motion**
- Built-in **font optimization** with [next/font](https://nextjs.org/docs/app/api-reference/components/font)
- Automatic **image optimization** via [next/image](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- Access to **31+ icon packs** via [React Icons](https://react-icons.github.io/react-icons/)
- Near-perfect **Lighthouse score**
- Modular, responsive, and **scalable components**
- **Free lifetime updates**

---

## Sections

- Hero
- Partners or Clients Logos
- Features
- Pricing
- Testimonials
- FAQ
- Statistics
- CTA
- Footer

---

## Getting Started

### Prerequisites

Before starting, make sure you have the following installed/services created:

- **Node.js**: Version 18 or later
- **npm**: Version 8 or later (bundled with Node.js)
- **Code editor**: [VS Code](https://code.visualstudio.com/) is recommended.
- **PostgreSQL database**: Preferably a [Neon](https://neon.tech/) project with pooled connection URL (`?sslmode=require`).

### Environment Variables

1. Duplicate `.env.example` as `.env.local`.
2. Fill in the required values:

```ini
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
AUTH_SECRET=<random-64-hex> # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
GOOGLE_ANALYTICS_ID=G-XXXXXXX # optional
```

3. In Vercel, add the same variables (`DATABASE_URL`, `AUTH_SECRET`, optional `AUTH_TRUST_HOST=true`) under Project Settings -> Environment Variables.

### Database Setup

1. Create a database in Neon (or any hosted Postgres) and copy the pooled connection string with `?sslmode=require`.
2. With `.env.local` configured, run:

   ```bash
   npm run db:migrate   # executes migrations/001_init.sql
   npm run db:seed      # inserts demo@finwise.dev / Demo123!
   ```

3. (Optional) If you change the demo password, regenerate the bcrypt hash via `node -e "console.log(require('bcrypt').hashSync('NewPass123!', 10))"` and update `migrations/002_seed.sql`.

### Steps

1. **Install dependencies**: Run `npm install`
2. **Run the development server**: `npm run dev`
3. **View your project**: Open [localhost:3000](http://localhost:3000)
4. **Test auth**:
   - `/login` with the seeded demo user.
   - `/dashboard` redirects to `/login` when not authenticated.
   - `/api/me` and `/api/transactions` require a valid session.

### Cloning & Running Your Own Instance

Anyone who clones the repository can reproduce the setup by following these steps:

1. `git clone <repo>` and `cd` into the folder.
2. Copy `.env.example` -> `.env.local`, then paste their own Neon/Postgres credentials and generate an `AUTH_SECRET`.
3. Run `npm install` to download dependencies (this also provides the `next` CLI).
4. Execute `npm run db:migrate && npm run db:seed` to prepare the database with the schema and demo user.
5. Start the dev server with `npm run dev`. The template will run on [http://localhost:3000](http://localhost:3000) (or a fallback port if 3000 is taken).

---

## Customization

1. **Edit colors**: Update `globals.css` for primary, secondary, background, and accent colors.
2. **Update site details**: Customize `siteDetails.ts` in `/src/data` to reflect your brand and site info.
3. **Modify content**: Files in `/src/data` handle data for navigation, features, pricing, testimonials, and more.
4. **Replace favicon**: Add your icon to `/src/app/favicon.ico`.
5. **Add images**: Update `public/images` for Open Graph metadata (e.g., `og-image.jpg`, `twitter-image.jpg`).

---

## Deploying on Vercel

The fastest way to deploy Finwise is on [Vercel](https://vercel.com/). Simply click the "Deploy with Vercel" button at the top of this README, or check the [Next.js deployment docs](https://vercel.com/docs/deployments/deployment-methods) for other deployment options.

### Post-deploy checklist

1. In Vercel -> Project Settings -> Environment Variables, set:
   - `DATABASE_URL` (pooled Neon URL with `?sslmode=require`)
   - `AUTH_SECRET` (same one you use locally or a new random hex string)
   - `AUTH_TRUST_HOST=true` (recommended for Auth.js if you plan to use custom domains)
   - Optional: `GOOGLE_ANALYTICS_ID`
2. Re-run the SQL migrations against your production database (either from local using the prod `DATABASE_URL` or with a CI step).
3. Redeploy so that build-time scripts see the new env vars.
4. Verify `/login`, `/dashboard`, `/api/me`, and `/api/transactions` in production.

---

## Contributing

Finwise is an open-source project, and we welcome contributions from the community! If you have ideas for new components, designs, layouts, or optimizations, please join us in making Finwise even better.

### How to Contribute

1. **Fork the Repository**: Clone it locally.
2. **Create a New Branch**: For example, `feature/new-section` or `fix/style-issue`.
3. **Develop and Test**: Make sure your changes work and don't break existing functionality.
4. **Submit a Pull Request**: Open a pull request with a clear description of your changes, and we'll review it.

### Ideas for Contributions

- New component sections (team introductions, comparison table, case studies, etc.)
- Additional page variants (e.g., agency, eCommerce, portfolio layouts)
- Additional themes
- Documentation updates, tutorials, or guides

---

## Community and Support

Join our community discussions on GitHub to share ideas, ask questions, or suggest improvements. Let’s build something amazing together!


--- 

## License

This project is open-source and available under the MIT License. Feel free to use, modify, and distribute it for personal or commercial projects.
