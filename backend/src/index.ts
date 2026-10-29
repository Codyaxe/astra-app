import { app } from './app.js';
import { env } from './config/env.js';

const PORT = parseInt(env.PORT, 10) || 4000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ASTRA backend listening on http://localhost:${PORT}`);
  });
}

export default app;