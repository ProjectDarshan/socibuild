import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // OAuth URL Endpoint
  app.get('/api/auth/url', (req, res) => {
    const { provider, origin } = req.query;
    
    if (!origin) {
        return res.status(400).json({ error: 'Origin is required' });
    }

    // Construct the redirect URI based on the client's origin
    const redirectUri = `${origin}/auth/callback`;
    
    // Encode the redirect URI in the state parameter so we can verify it in the callback
    const state = Buffer.from(redirectUri).toString('base64');
    
    let authUrl = '';

    if (provider === 'google') {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            return res.status(400).json({ error: 'Google Client ID not configured' });
        }
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'email profile',
            access_type: 'offline',
            prompt: 'consent',
            state: state
        });
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    } else {
        return res.status(400).json({ error: 'Invalid provider' });
    }

    res.json({ url: authUrl });
  });

  // OAuth Callback Handler
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.send(renderCallbackHtml({ error: String(error) }));
    }

    if (!code || !state) {
        return res.send(renderCallbackHtml({ error: 'Missing code or state' }));
    }

    try {
        // Decode the redirect URI from the state
        const redirectUri = Buffer.from(String(state), 'base64').toString();
        
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: String(code),
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('Token exchange error:', tokenData);
            return res.send(renderCallbackHtml({ error: tokenData.error_description || tokenData.error }));
        }

        // Fetch user profile
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();
        
        if (userData.error) {
             console.error('User info error:', userData);
             return res.send(renderCallbackHtml({ error: 'Failed to fetch user profile' }));
        }

        // Success! Send user data back to opener
        return res.send(renderCallbackHtml({ user: userData }));

    } catch (err) {
        console.error('OAuth callback error:', err);
        return res.send(renderCallbackHtml({ error: 'Internal server error during authentication' }));
    }
  });

  // Helper to render the callback HTML
  function renderCallbackHtml(data: { user?: any; error?: string }) {
    return `
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: ${data.error ? "'OAUTH_AUTH_ERROR'" : "'OAUTH_AUTH_SUCCESS'"}, 
                user: ${JSON.stringify(data.user || null)},
                error: ${JSON.stringify(data.error || null)}
              }, '*');
              window.close();
            } else {
              document.body.innerHTML = '<p>Authentication complete. You can close this window.</p>';
            }
          </script>
          <p>${data.error ? 'Authentication failed: ' + data.error : 'Authentication successful. Closing...'}</p>
        </body>
      </html>
    `;
  }

  // Mock Email Login
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // In a real app, verify credentials against DB
    if (email && password) {
        res.json({ 
            success: true, 
            user: { 
                name: email.split('@')[0], 
                email,
                avatar: `https://i.pravatar.cc/150?u=${email}` 
            } 
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
