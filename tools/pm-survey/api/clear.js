import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all response IDs
    const ids = await redis.lrange('pm_response_ids', 0, -1);

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
