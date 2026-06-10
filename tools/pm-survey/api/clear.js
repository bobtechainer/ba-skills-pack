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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = await getRedis();

    // Get all response IDs
    const ids = await redis.lRange('pm_response_ids', 0, -1);

    // Delete each response
    for (const id of ids) {
      await redis.del(`pm_response:${id}`);
    }

    // Delete the list itself
    await redis.del('pm_response_ids');

    return res.status(200).json({ success: true, deleted: ids.length });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to clear', detail: error.message });
  }
}
