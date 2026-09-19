import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    // GET → latest 50 messages
    if (req.method === 'GET') {
      const entries = await prisma.guestbookEntry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return res.status(200).json(entries);
    }

    // POST → sign the book
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const name = String(body.name ?? 'Anonymous').trim().slice(0, 20) || 'Anonymous';
      const message = String(body.message ?? '').trim().slice(0, 200);

      if (!message) return res.status(400).json({ error: 'Message required' });

      const entry = await prisma.guestbookEntry.create({ data: { name, message } });
      return res.status(200).json(entry);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}