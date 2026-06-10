import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all response IDs
    const ids = await redis.lrange('pm_response_ids', 0, -1);

    if (!ids || ids.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch all responses
    const responses = await Promise.all(
      ids.map(async (id) => {
        const data = await redis.get(`pm_response:${id}`);
        if (!data) return null;
        // @upstash/redis auto-deserializes JSON, but handle both cases
        return typeof data === 'string' ? JSON.parse(data) : data;
      })
    );

    return res.status(200).json(responses.filter(Boolean));
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch', detail: error.message });
  }
}
