# SendGrid Email Setup - Step by Step

## 🚀 **Step 1: Create SendGrid Account**

1. **Go to [SendGrid.com](https://sendgrid.com)**
2. **Click "Start for Free"** or "Sign Up"
3. **Create your account** with your email
4. **Verify your email address** (check your inbox)

## 🔑 **Step 2: Get Your SendGrid API Key**

1. **In SendGrid Dashboard**, go to **Settings** → **API Keys**
2. **Click "Create API Key"**
3. **Choose "Full Access"** (or "Restricted Access" with "Mail Send" permissions)
4. **Name it** "Grand Finale Support Emails"
5. **Copy the API key** (you'll only see it once!)

## 🌐 **Step 3: Verify Your Domain (Important)**

### **Option A: Domain Authentication (Recommended)**
1. **In SendGrid Dashboard**, go to **Settings** → **Sender Authentication**
2. **Click "Domain Authentication"**
3. **Enter your domain** (e.g., `skillbinder.com`)
4. **Follow the DNS setup instructions** provided by SendGrid
5. **Add the required DNS records** to your domain provider

### **Option B: Single Sender Verification (Quick Setup)**
1. **In SendGrid Dashboard**, go to **Settings** → **Sender Authentication**
2. **Click "Single Sender Verification"**
3. **Add your email** (e.g., `noreply@skillbinder.com`)
4. **Verify the email** by clicking the link sent to your inbox

## 📝 **Step 4: Set Up Environment Variables**

1. **Create a file** called `.env.local` in your project root
2. **Add this line** to the file:

```bash
VITE_SENDGRID_API_KEY=YOUR_ACTUAL_SENDGRID_API_KEY_HERE
```

3. **Replace** `YOUR_ACTUAL_SENDGRID_API_KEY_HERE` with your real API key
4. **Save the file**

## 🔧 **Step 5: Update Sender Email**

1. **Open** `src/lib/emailService.ts`
2. **Find this line** (around line 95):
   ```javascript
   email: 'noreply@skillbinder.com', // Replace with your verified sender
   ```
3. **Replace** `noreply@skillbinder.com` with your verified email address

## 🧪 **Step 6: Test the System**

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:8080`
3. **Click "Support"** button
4. **Submit a test request**
5. **Check your email** at `support@skillbinder.com`

## 📧 **Step 7: What You'll Receive**

You'll get a professional HTML email with:
- **SkillBinder branding** and colors
- **Complete request details**
- **User information**
- **Request ID for tracking**
- **Professional formatting**

## 🐛 **Troubleshooting**

### **If emails aren't sending:**
1. **Check your API key** is correct
2. **Verify your domain/sender** is authenticated
3. **Check browser console** for error messages
4. **Verify environment variable** is set correctly

### **If you see "API key not found":**
- Make sure `.env.local` file exists
- Restart your development server
- Check the API key is copied correctly

### **If emails go to spam:**
1. **Set up proper SPF/DKIM records**
2. **Use a verified sender domain**
3. **Warm up your email sending reputation**

## 🎯 **Expected Results**

After setup:
- ✅ **Real emails sent** to `support@skillbinder.com`
- ✅ **Professional HTML formatting**
- ✅ **Complete request details**
- ✅ **SkillBinder branding**
- ✅ **No more console-only logging**

## 📊 **SendGrid Dashboard**

You can monitor your email sending in SendGrid:
- **Track delivery rates**
- **Monitor bounce rates**
- **View open/click rates**
- **Set up alerts for failures**

## 🔒 **Security Notes**

- **Never commit** your API key to version control
- **Use environment variables** for sensitive data
- **Keep your API key secure**
- **Monitor your SendGrid usage**

Your support system will now send real, professional emails to `support@skillbinder.com` whenever someone submits a support request! 