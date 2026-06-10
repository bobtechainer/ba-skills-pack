import { createClient } from 'redis';

let client;

async function getRedis() {
  if (client && client.isOpen) return client;
  client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 3000,
      reconnectStrategy: (retries) => (retries > 1 ? false : 300),
    },
  });
  client.on('error', (err) => console.error('Redis error:', err));
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = await getRedis();

    // Get all response IDs
    const ids = await redis.lRange('pm_response_ids', 0, -1);

    if (!ids || ids.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch all responses
    const responses = await Promise.all(
      ids.map(async (id) => {
        const data = await redis.get(`pm_response:${id}`);
        if (!data) return null;
        return JSON.parse(data);
      })
    );

    return res.status(200).json(responses.filter(Boolean));
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch', detail: error.message });
  }
}
