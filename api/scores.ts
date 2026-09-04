import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    // GET /api/scores → top 10 worldwide
    if (req.method === 'GET') {
      const top = await prisma.score.findMany({
        orderBy: { score: 'desc' },
        take: 10,
      });
      return res.status(200).json(top);
    }

    // POST /api/scores → save a new score
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const name = String(body.name ?? 'Anonymous').trim().slice(0, 20) || 'Anonymous';
      const score = Math.floor(Number(body.score));

      if (!Number.isFinite(score) || score <= 0 || score > 999999) {
        return res.status(400).json({ error: 'Invalid score' });
      }

      const row = await prisma.score.create({ data: { name, score } });
      return res.status(200).json(row);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}