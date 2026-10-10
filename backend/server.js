import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import flagRoutes from './routes/flagRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import mcpRoutes from './routes/mcpRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// ══════════════════════════════════════════════════════════════
// MVC ROUTE MODULES
// ══════════════════════════════════════════════════════════════
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/counselor', mcpRoutes);
app.use('/api/grades', gradeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LUNA & BK Early Warning System API (MVC Architecture)',
    database: process.env.DATABASE_URL ? 'PostgreSQL (Neon / Supabase)' : 'SQLite (bk_luna.db)',
    timestamp: new Date().toISOString()
  });
});

// Serve built frontend assets
const clientDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('LUNA & BK Early Warning API is running. Start frontend on http://localhost:5173');
    }
  });
});

// ══════════════════════════════════════════════════════════════
// DYNAMIC PORT ALLOCATION (AUTO-FALLBACK JIKA PORT SUDAH TERPAKAI)
// ══════════════════════════════════════════════════════════════

function startServer(initialPort, maxAttempts = 10) {
  let currentPort = Number(initialPort);
  let attempts = 0;

  function tryListen(port) {
    const server = app.listen(port);

    server.on('listening', () => {
      console.log(`\n==========================================================`);
      console.log(`🚀 LUNA Backend API (MVC) AKTIF di: http://localhost:${port}`);
      if (port !== Number(initialPort)) {
        console.log(`ℹ️  Info: Port ${initialPort} sedang digunakan proses lain.`);
        console.log(`    Sistem otomatis beralih dan memakai port yang tersedia: ${port}`);
      }
      console.log(`==========================================================\n`);

      try {
        const portInfo = JSON.stringify({
          port,
          url: `http://localhost:${port}/api`,
          timestamp: new Date().toISOString()
        }, null, 2);

        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(path.join(dataDir, 'active_port.json'), portInfo, 'utf-8');

        const frontendPublic = path.join(__dirname, '../frontend/public');
        if (fs.existsSync(frontendPublic)) {
          fs.writeFileSync(path.join(frontendPublic, 'active_port.json'), portInfo, 'utf-8');
        }
      } catch (err) {
        // non-fatal
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        attempts++;
        console.warn(`⚠️ Port ${port} sedang digunakan (EADDRINUSE).`);
        if (attempts < maxAttempts) {
          const nextPort = port + 1;
          console.log(`🔄 Mengalihkan dan mencoba port berikutnya: ${nextPort}...`);
          tryListen(nextPort);
        } else {
          console.error(`❌ Gagal menemukan port yang tersedia setelah ${maxAttempts} percobaan.`);
          process.exit(1);
        }
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  }

  tryListen(currentPort);
}

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ [Process] Unhandled Rejection (intercepted):', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
  console.warn('⚠️ [Process] Uncaught Exception (intercepted):', err.message);
});

startServer(PORT);
