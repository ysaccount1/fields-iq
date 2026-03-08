# Vercel Deployment Guide for Fields-IQ Email Service

This guide explains how to deploy the email functionality to Vercel as serverless functions.

## Project Structure

```
fields-iq/fields-iq/
├── api/
│   ├── early-access.js    # Serverless function for early access form
│   └── contact.js          # Serverless function for contact form
├── qsrpro/
│   ├── script.js           # Frontend with API calls
│   └── ...
├── package.json
├── vercel.json
└── VERCEL_DEPLOYMENT.md
```

## Setup Steps

### 1. Install Dependencies

```bash
cd fields-iq/fields-iq
npm install
```

### 2. Configure Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

#### Required Variables

| Variable | Value | Example |
|----------|-------|---------|
| `ADMIN_EMAIL` | Your admin email | `support@qsrpro.app` |

#### SMTP Configuration

**For AWS SES:**
| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `email-smtp.us-east-1.amazonaws.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your AWS SES SMTP username |
| `SMTP_PASS` | Your AWS SES SMTP password |
| `SMTP_FROM` | `noreply@fields-iq.com` |

**For Google Workspace SMTP Relay (IP-based):**
| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp-relay.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_FROM` | `noreply@fields-iq.com` |

Leave `SMTP_USER` and `SMTP_PASS` empty for IP-based auth.

**For Mailtrap (Testing):**
| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.mailtrap.io` |
| `SMTP_PORT` | `2525` |
| `SMTP_USER` | Your Mailtrap username |
| `SMTP_PASS` | Your Mailtrap password |
| `SMTP_FROM` | `dev@fields-iq.com` |

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the configuration
5. Add environment variables in project settings
6. Deploy

#### Option C: Using Git Integration

1. Connect your repository to Vercel
2. Push to your main branch
3. Vercel will automatically deploy

### 4. Test the Deployment

After deployment, your API endpoints will be available at:

- `https://your-domain.vercel.app/api/early-access`
- `https://your-domain.vercel.app/api/contact`

Test with curl:

```bash
# Test early access endpoint
curl -X POST https://your-domain.vercel.app/api/early-access \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Corp",
    "role": "franchise_owner",
    "locations": 5
  }'

# Test contact endpoint
curl -X POST https://your-domain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "support",
    "message": "This is a test message"
  }'
```

## How It Works

### Serverless Functions

Vercel automatically converts files in the `/api` directory into serverless functions:

- `api/early-access.js` → `/api/early-access` endpoint
- `api/contact.js` → `/api/contact` endpoint

Each function:
1. Receives HTTP requests
2. Validates form data
3. Sends emails via SMTP
4. Returns JSON response

### Frontend Integration

The frontend (`qsrpro/script.js`) makes fetch requests to these endpoints:

```javascript
fetch('/api/early-access', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

Since the API is on the same domain, no CORS issues occur.

## Differences from Express Backend

| Feature | Express Backend | Vercel Serverless |
|---------|----------------|-------------------|
| Architecture | Always-on server | On-demand functions |
| Scaling | Manual | Automatic |
| Cost | Fixed (server cost) | Pay-per-execution |
| Rate Limiting | Built-in middleware | Use Vercel Edge Config |
| Logging | Winston to files | Console logs to Vercel |
| State | Can maintain state | Stateless |

## Monitoring

### View Logs

```bash
vercel logs your-deployment-url
```

Or view in Vercel Dashboard → Your Project → Logs

### Monitor Function Executions

Go to Vercel Dashboard → Your Project → Analytics to see:
- Function invocations
- Execution duration
- Error rates
- Bandwidth usage

## Troubleshooting

### Emails not sending

1. Check environment variables in Vercel dashboard
2. View function logs: `vercel logs`
3. Test SMTP credentials locally first
4. Verify `ADMIN_EMAIL` is set

### CORS errors

The serverless functions include CORS headers. If you still see errors:
1. Check browser console for specific error
2. Verify the request is going to the correct domain
3. Ensure you're not mixing http/https

### Function timeout

Vercel has a 10-second timeout for Hobby plan, 60 seconds for Pro.
If emails take too long:
1. Check SMTP server response time
2. Consider using a faster SMTP provider
3. Upgrade to Vercel Pro if needed

### Rate limiting

Vercel doesn't have built-in rate limiting. To add it:
1. Use Vercel Edge Config
2. Or use a third-party service like Upstash
3. Or implement simple in-memory rate limiting (resets on cold start)

## Local Development

Test serverless functions locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run dev server
vercel dev
```

This starts a local server at `http://localhost:3000` that mimics Vercel's environment.

## Custom Domain

To use a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `fields-iq.com`)
3. Update DNS records as instructed
4. Vercel will automatically provision SSL certificate

## Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use Vercel environment variables for secrets
3. ✅ Enable "Automatically expose System Environment Variables" in Vercel
4. ✅ Use different SMTP credentials for production vs development
5. ✅ Monitor function logs for suspicious activity
6. ✅ Consider adding Vercel's Web Application Firewall (Pro plan)

## Cost Estimation

Vercel Hobby Plan (Free):
- 100 GB bandwidth/month
- 100 hours serverless function execution/month
- Unlimited API requests

Typical usage for form submissions:
- ~100ms per function execution
- ~2 emails per submission (notification + confirmation)
- Can handle ~36,000 form submissions/month on free plan

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test both forms
4. ✅ Monitor logs for first few submissions
5. ✅ Set up custom domain (optional)
6. ✅ Configure email alerts for function errors (Vercel Integrations)

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Nodemailer Documentation: https://nodemailer.com/

## Rollback

If something goes wrong:

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

Or use Vercel Dashboard → Deployments → Click on previous deployment → Promote to Production
