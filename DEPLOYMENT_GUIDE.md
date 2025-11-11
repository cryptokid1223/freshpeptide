# 🚀 Deployment Guide - Deploy to Vercel

Your code is committed and ready to deploy! Follow these steps:

## Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Name your repository: `freshpeptide` (or whatever you want)
3. **Make it Private** (recommended - contains your code)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

GitHub will show you commands. Use these:

```bash
cd /Users/sobirtokhtabayev/Desktop/freshpeptide
git remote add origin https://github.com/YOUR-USERNAME/freshpeptide.git
git branch -M main
git push -u origin main
```

**Replace** `YOUR-USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### Option A: Quick Deploy (Recommended)

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. If prompted, connect your GitHub account
4. Select your `freshpeptide` repository
5. Vercel will auto-detect it's a Next.js app ✅

### Configure Environment Variables

**IMPORTANT**: Before deploying, add your environment variables:

1. In the Vercel import screen, scroll to "Environment Variables"
2. Add these **one by one**:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `your-openai-api-key` |
| `USE_MOCK_AI` | `false` |
| `NEXT_PUBLIC_SUPABASE_URL` | `your-supabase-url` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-supabase-anon-key` |

3. Click "Deploy"

### Wait for Deployment

- First deployment takes 2-3 minutes
- Vercel will show you the progress
- When done, you'll get a live URL like: `https://freshpeptide.vercel.app`

## Step 4: Update Supabase Redirect URL

Your authentication needs to know the production URL:

1. Go to your Supabase dashboard
2. Click **Authentication** → **URL Configuration**
3. Add your Vercel URL to **Redirect URLs**:
   - `https://your-app.vercel.app/consent`
   - `https://your-app.vercel.app/**` (wildcard for all paths)
4. Save changes

## Step 5: Test Your Live App! 🎉

1. Visit your Vercel URL
2. Click "Start Questions"
3. Enter your email
4. Check email for magic link
5. Complete questionnaire
6. Generate peptide stack with AI!

---

## 🔄 Future Updates

When you make changes to your code:

```bash
# 1. Commit your changes
git add .
git commit -m "Your update message"

# 2. Push to GitHub
git push

# 3. Vercel auto-deploys! ✨
```

Vercel automatically deploys every time you push to GitHub.

---

## ⚙️ Vercel Dashboard

Access your deployment at: [https://vercel.com/dashboard](https://vercel.com/dashboard)

From there you can:
- View deployment logs
- See real-time analytics
- Update environment variables
- View custom domain settings
- Monitor performance

---

## 🌐 Custom Domain (Optional)

Want your own domain like `peptides.com`?

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel dashboard → Your Project → Settings → Domains
3. Add your custom domain
4. Update your DNS records (Vercel shows you exactly what to add)
5. Wait for DNS propagation (5-48 hours)

---

## 🐛 Troubleshooting

### "Environment variable not found"
- Make sure all 4 env vars are added in Vercel
- Redeploy after adding variables

### "Authentication not working"
- Check Supabase redirect URLs include your Vercel domain
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### "AI generation fails"
- Check `OPENAI_API_KEY` is correct
- Verify `USE_MOCK_AI` is set to `false`
- Check OpenAI account has credits

### "Build failed"
- Check deployment logs in Vercel
- Make sure all dependencies are in `package.json`
- Try running `npm run build` locally first

---

## 📊 Monitoring

### Check Logs
1. Go to Vercel dashboard
2. Click on your project
3. Click on latest deployment
4. Click "Runtime Logs" to see server logs
5. Look for errors or API call logs

### View Analytics
- Vercel provides free analytics
- See page views, unique visitors, etc.
- Go to your project → Analytics tab

---

## 💰 Costs

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ 100GB bandwidth/month
- ✅ Unlimited sites

### What You Pay For:
- 💵 OpenAI API ($0.03-0.10 per generation)
- 💵 Supabase (Free tier: 500MB database, 2GB bandwidth)

Your site will cost essentially **$0 to host** on Vercel!

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] Environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore` (✅ already done)
- [ ] Supabase Row Level Security is enabled (✅ already done in schema)
- [ ] API keys are not exposed in client-side code
- [ ] Supabase redirect URLs are configured correctly
- [ ] Test authentication flow in production
- [ ] Test AI generation in production

---

## 🎯 Next Steps After Deployment

1. **Share your app** - Send the URL to friends/testers
2. **Monitor usage** - Check Vercel analytics and OpenAI usage
3. **Set spending limits** - In OpenAI dashboard, set usage limits
4. **Backup your data** - Supabase has automatic backups
5. **Add more features** - The platform is yours to customize!

---

## ❓ Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Congratulations! 🎉 You're about to have a live, AI-powered peptide research platform on the internet!**

