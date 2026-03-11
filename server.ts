import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch"; 
import dotenv from "dotenv";
import { Resend } from 'resend';

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const envResult = dotenv.config();
dotenv.config({ path: '.env.local' }); // Also try loading .env.local if it exists

// Helper to clean keys
const cleanKey = (key: string | undefined) => {
  if (!key) return '';
  return key.replace(/^["']|["']$/g, '').trim();
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  const supabaseUrl = cleanKey(process.env.VITE_SUPABASE_URL) || 'https://jgqjldxflbljmlyovdvd.supabase.co';
  const supabaseAnonKey = cleanKey(process.env.VITE_SUPABASE_ANON_KEY);
  const resendApiKey = cleanKey(process.env.RESEND_API_KEY);

  console.log('--- Environment Debug ---');
  if (envResult.error) {
    console.log('⚠️  Standard .env file not found or could not be read.');
  } else {
    console.log('✅ Standard .env file loaded successfully.');
  }
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Supabase Key: ${supabaseAnonKey ? 'Detected (starts with ' + supabaseAnonKey.substring(0, 5) + '...)' : 'MISSING'}`);
  console.log('-----------------------');

  // Initialize Clients inside startServer to ensure envs are loaded
  const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder');
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  app.use(express.json());

  // API proxy route using official SDK
  app.post("/api/submit-contact", async (req, res) => {
    const formData = req.body;

    try {
      // Use official SDK to invoke the function
      const { data: supabaseData, error: supabaseError } = await supabase.functions.invoke('smooth-endpoint', {
        body: formData,
      });

      if (supabaseError) {
        console.error('Supabase SDK Error:', supabaseError);
        return res.status(401).json({ error: supabaseError.message });
      }

      // Send email via Resend
      if (resend) {
        try {
          await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: cleanKey(process.env.VITE_CONTACT_EMAIL) || 'vansh.dev@example.com',
            subject: `New Contact Form Submission from ${formData.name}`,
            html: `
              <h1>New Contact Message</h1>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Message:</strong> ${formData.message}</p>
            `
          });
        } catch (emailError) {
          console.error('Resend error:', emailError);
        }
      }

      res.json(supabaseData || { success: true });
    } catch (error) {
      console.error('Unexpected Proxy Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();


