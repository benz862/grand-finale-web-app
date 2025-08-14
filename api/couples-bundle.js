import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Stripe only if a real API key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Initialize Supabase only if URL is provided
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://your-project.supabase.co') {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Initialize SendGrid only if API key is provided
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.your_sendgrid_api_key_here') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Couples Bundle Stripe Price IDs
const couplesPriceIds = {
  lifetimeCouples: "price_1Rok3hE6oTidvpnUNU4SHFSA",
  liteCouplesMonthly: "price_1Rok5LE6oTidvpnUSQB2GMCw",
  standardCouplesMonthly: "price_1Rok6AE6oTidvpnUHjp4lPXT",
  premiumCouplesMonthly: "price_1RokFkE6oTidvpnUOd5lfhuu",
  liteCouplesYearly: "price_1RokHAE6oTidvpnUnzBNHLNn",
  standardCouplesYearly: "price_1RokJAE6oTidvpnUeqfK3JDN",
  premiumCouplesYearly: "price_1RokJtE6oTidvpnUFh8Kocvj",
};

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Couples Bundle API is running",
    timestamp: new Date().toISOString(),
    config: {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      supabase: !!supabase,
      sendgrid: !!process.env.SENDGRID_API_KEY
    }
  });
});

// ----------------------------
// 1. CREATE CUSTOMER PORTAL SESSION
// ----------------------------
app.post("/create-portal-session", async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  // Check if Stripe is configured
  if (!stripe) {
    return res.status(500).json({ 
      error: "Payment processing is not configured. Please contact support." 
    });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL || 'http://localhost:8080'}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ error: "Unable to create portal session" });
  }
});

// ----------------------------
// 2. CREATE COUPLES CHECKOUT SESSION
// ----------------------------
app.post("/create-couples-checkout-session", async (req, res) => {
  const { priceId, email } = req.body;

  // Validate price ID is a couples bundle
  if (!Object.values(couplesPriceIds).includes(priceId)) {
    return res.status(400).json({ 
      error: "Invalid price ID. Must be a couples bundle price." 
    });
  }

  // Check if Stripe is configured
  if (!stripe) {
    return res.status(500).json({ 
      error: "Payment processing is not configured. Please contact support." 
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: priceId.includes("lifetime") ? "payment" : "subscription",
      customer_email: email || undefined, // Only set if email is provided
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL || 'http://localhost:8080'}/invite-partner?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:8080'}/couples-pricing`,
      metadata: {
        bundle_type: 'couples',
        primary_user_email: email || '',
        price_id: priceId
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
});

// ----------------------------
// 2. STRIPE WEBHOOK - CREATE BUNDLE & PRIMARY USER
// ----------------------------
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  // Check if Stripe is configured
  if (!stripe) {
    return res.status(500).json({ error: "Payment processing is not configured" });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Only process couples bundles
    if (session.metadata?.bundle_type !== 'couples') {
      return res.json({ received: true });
    }

    const email = session.customer_email;
    const priceId = session.metadata?.price_id;

    // Only proceed if Supabase is configured
    if (!supabase) {
      console.log("Supabase not configured, skipping database operations");
      return res.json({ received: true });
    }

    try {
      // 1. Insert bundle purchase
      const { data: bundle, error: bundleError } = await supabase
        .from("bundle_purchases")
        .insert({
          stripe_session_id: session.id,
          primary_user_email: email,
          plan_type: priceId,
          status: "pending",
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (bundleError) {
        console.error("Supabase bundle insert error:", bundleError);
        return res.status(500).json({ error: 'Failed to create bundle purchase' });
      }

      // 2. Create primary Supabase Auth user (if not exists)
      try {
        const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
        
        if (existingUser.user) {
          // Update existing user with bundle_id
          await supabase.auth.admin.updateUserById(existingUser.user.id, {
            user_metadata: { bundle_id: bundle.id }
          });
        } else {
          // Create new user
          await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: { bundle_id: bundle.id }
          });
        }
      } catch (authError) {
        console.error("Auth user creation/update error:", authError);
      }

    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  // Handle subscription events
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    
    if (!supabase) {
      console.log("Supabase not configured, skipping subscription update");
      return res.json({ received: true });
    }

    try {
      // Find user by Stripe customer ID
      const { data: user, error } = await supabase
        .from("users")
        .select("id")
        .eq("stripe_customer_id", invoice.customer)
        .single();

      if (user) {
        // Set subscription status to past_due and add grace period (7 days)
        const graceExpires = new Date();
        graceExpires.setDate(graceExpires.getDate() + 7);

        await supabase
          .from("users")
          .update({
            subscription_status: 'past_due',
            subscription_grace_expires: graceExpires.toISOString()
          })
          .eq("id", user.id);

        console.log(`User ${user.id} subscription set to past_due, grace period until ${graceExpires.toISOString()}`);
      }
    } catch (error) {
      console.error("Error updating subscription status for payment failure:", error);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    
    if (!supabase) {
      console.log("Supabase not configured, skipping subscription update");
      return res.json({ received: true });
    }

    try {
      // Find user by Stripe customer ID
      const { data: user, error } = await supabase
        .from("users")
        .select("id")
        .eq("stripe_customer_id", subscription.customer)
        .single();

      if (user) {
        // Set subscription status to inactive (immediate lock)
        await supabase
          .from("users")
          .update({
            subscription_status: 'inactive',
            subscription_grace_expires: null
          })
          .eq("id", user.id);

        console.log(`User ${user.id} subscription set to inactive`);
      }
    } catch (error) {
      console.error("Error updating subscription status for deletion:", error);
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    
    if (!supabase) {
      console.log("Supabase not configured, skipping subscription update");
      return res.json({ received: true });
    }

    try {
      // Find user by Stripe customer ID
      const { data: user, error } = await supabase
        .from("users")
        .select("id")
        .eq("stripe_customer_id", invoice.customer)
        .single();

      if (user) {
        // Set subscription status to active and clear grace period
        await supabase
          .from("users")
          .update({
            subscription_status: 'active',
            subscription_grace_expires: null
          })
          .eq("id", user.id);

        console.log(`User ${user.id} subscription set to active`);
      }
    } catch (error) {
      console.error("Error updating subscription status for payment success:", error);
    }
  }

  res.json({ received: true });
});

// ----------------------------
// 3. SEND PARTNER INVITE
// ----------------------------
app.post("/send-partner-invite", async (req, res) => {
  const { sessionId, partnerEmail } = req.body;

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // Find bundle
  const { data: bundle, error } = await supabase
    .from("bundle_purchases")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !bundle) {
    return res.status(400).json({ error: "Bundle not found" });
  }

  // Prevent duplicate emails
  if (bundle.primary_user_email === partnerEmail) {
    return res.status(400).json({ error: "Partner email cannot match primary email" });
  }

  // Update bundle with partner email
  await supabase
    .from("bundle_purchases")
    .update({ secondary_invite_email: partnerEmail })
    .eq("id", bundle.id);

  // Send invite email (only if SendGrid is configured)
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.your_sendgrid_api_key_here') {
    const inviteLink = `${process.env.APP_URL || 'http://localhost:8080'}/register-partner?bundle=${bundle.id}`;
    const msg = {
      to: partnerEmail,
      from: process.env.FROM_EMAIL || "support@skillbinder.com",
      subject: "You've Been Invited to Join The Grand Finale",
      html: partnerInviteEmail(inviteLink),
    };
    
    try {
      await sgMail.send(msg);
    } catch (err) {
      console.error("SendGrid error:", err);
      return res.status(500).json({ error: "Failed to send invite" });
    }
  }

  res.json({ success: true });
});

// ----------------------------
// 4. RESEND PARTNER INVITE
// ----------------------------
app.post("/resend-partner-invite", async (req, res) => {
  const { sessionId, partnerEmail } = req.body;

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // Find bundle
  const { data: bundle, error } = await supabase
    .from("bundle_purchases")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !bundle) {
    return res.status(400).json({ error: "Bundle not found" });
  }

  // Send invite email (only if SendGrid is configured)
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.your_sendgrid_api_key_here') {
    const inviteLink = `${process.env.APP_URL || 'http://localhost:8080'}/register-partner?bundle=${bundle.id}`;
    const msg = {
      to: partnerEmail,
      from: process.env.FROM_EMAIL || "support@skillbinder.com",
      subject: "You've Been Invited to Join The Grand Finale",
      html: partnerInviteEmail(inviteLink),
    };
    
    try {
      await sgMail.send(msg);
      res.json({ success: true });
    } catch (err) {
      console.error("SendGrid error:", err);
      res.status(500).json({ error: "Failed to send invite" });
    }
  } else {
    res.json({ success: true });
  }
});

// ----------------------------
// 5. GET BUNDLE INFO
// ----------------------------
app.get("/bundle/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { data: bundle, error } = await supabase
    .from("bundle_purchases")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !bundle) {
    return res.status(404).json({ error: "Bundle not found" });
  }

  res.json(bundle);
});

// ----------------------------
// 6. VALIDATE INVITE
// ----------------------------
app.get("/validate-invite/:bundleId/:token", async (req, res) => {
  const { bundleId, token } = req.params;

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { data: bundle, error } = await supabase
    .from("bundle_purchases")
    .select("*")
    .eq("id", bundleId)
    .eq("invite_token", token)
    .single();

  if (error || !bundle) {
    return res.status(400).json({ error: "Invalid or expired invite" });
  }

  // Check if invite is expired
  if (bundle.invite_expires_at && new Date() > new Date(bundle.invite_expires_at)) {
    return res.status(400).json({ error: "Invite has expired" });
  }

  res.json({ valid: true, bundle });
});

// ----------------------------
// 7. REGISTER PARTNER
// ----------------------------
app.post("/register-partner", async (req, res) => {
  const { bundleId, inviteToken, email, password } = req.body;

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // Validate invite
  const { data: bundle, error } = await supabase
    .from("bundle_purchases")
    .select("*")
    .eq("id", bundleId)
    .eq("invite_token", inviteToken)
    .single();

  if (error || !bundle) {
    return res.status(400).json({ error: "Invalid or expired invite" });
  }

  // Check if invite is expired
  if (bundle.invite_expires_at && new Date() > new Date(bundle.invite_expires_at)) {
    return res.status(400).json({ error: "Invite has expired" });
  }

  try {
    // Create partner user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { bundle_id: bundleId }
    });

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Update bundle status to active
    await supabase
      .from("bundle_purchases")
      .update({ 
        status: "active",
        secondary_user_id: user.user.id
      })
      .eq("id", bundleId);

    res.json({ success: true, user: user.user });
  } catch (error) {
    console.error("Partner registration error:", error);
    res.status(500).json({ error: "Failed to register partner" });
  }
});

// Partner invite email template
function partnerInviteEmail(inviteLink) {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #222;">You've Been Invited to Join <span style="color:#e4b200;">THE GRAND FINALE</span></h2>
      <p>Your partner has invited you to create your own private Grand Finale account. With this account, you can securely document your final wishes, plans, and personal legacy.</p>
      <p style="margin:20px 0;">
        <a href="${inviteLink}" style="display:inline-block;background:#e4b200;color:#000;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">
          Accept Invite & Create Account
        </a>
      </p>
      <p>If you weren't expecting this invitation, you can ignore this email.</p>
      <p>— The Grand Finale Team</p>
    </body>
    </html>
  `;
}

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Config status:`, {
    stripe: !!process.env.STRIPE_SECRET_KEY,
    supabase: !!supabase,
    sendgrid: !!process.env.SENDGRID_API_KEY
  });
}); 