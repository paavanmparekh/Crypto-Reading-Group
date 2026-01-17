# Cryptography Reading Group Website

A modern, database-driven website for proper academic reading groups. Built with Next.js 14, Tailwind CSS, Vercel Postgres, and NextAuth.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Vercel](https://vercel.com) account (free) for deployment and database

### Local Development

1.  **Clone the repository** (if not already done)
    ```bash
    git clone https://github.com/your-username/crypto-reading-group-new.git
    cd crypto-reading-group-new
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    - Copy `.env.example` to `.env.local`
    - You will need database credentials. The easiest way is to run `npx prisma init` or deploy to Vercel first to get a Postgres database.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🛠 Deployment to Vercel (Recommended)

This project is optimized for deployment on Vercel.

1.  **Push to GitHub**:
    Make sure your project is pushed to a GitHub repository.

2.  **Import to Vercel**:
    - Go to [vercel.com/new](https://vercel.com/new)
    - Select your repository.
    - **Framework Preset**: Next.js (should be auto-detected).

3.  **Configure Storage (Database)**:
    - During deployment setup or after, go to the "Storage" tab in your Vercel project dashboard.
    - Click "Connect Store" -> "Postgres".
    - Create a new database.
    - **Variables**: It will automatically add `POSTGRES_URL` etc. to your environment.

4.  **Configure Environment Variables**:
    Go to Settings > Environment Variables and add:
    
    | Variable | Description |
    |CHAR|CHAR|
    | `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate a secure key. |
    | `NEXTAUTH_URL` | Your Vercel URL (e.g. `https://your-project.vercel.app`) - **Important**: Set this to the production URL. |
    | `RESEND_API_KEY` | (Optional) API key from [Resend](https://resend.com) for emails. |
    | `BLOB_READ_WRITE_TOKEN` | (Optional) Connect Vercel Blob storage for file uploads. |

5.  **Initialize Database**:
    After deployment, Vercel will build your app. Go to "Deployments", select the active deployment, and look for "Redeploy" if needed to ensure Prisma migrations run, or run this command locally connected to your Vercel DB:
    ```bash
    npx prisma migrate deploy
    ```

## 🔐 Admin Access

The default admin login page is at `/admin/login`.

- **Development**:
  - Email: `admin@example.com`
  - Password: `admin` (You should disable this in `app/api/auth/[...nextauth]/route.ts` for production if desired, or relying on `NODE_ENV` check is fine).

- **Production**:
  - You will need to manually insert an admin user into the database via Vercel dashboard query editor or Prisma Studio (`npx prisma studio`).

## 📚 Features

- **Talks Archive**: Complete management of past and upcoming talks.
- **Member Profiles**: Showcase researchers and their interests.
- **Admin Dashboard**: Secure interface to manage content.
- **Mailing List**: Integrated subscription with Resend (optional).
- **Responsive Design**: Looks great on mobile and desktop.

## 📝 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js
- **Email**: Resend
