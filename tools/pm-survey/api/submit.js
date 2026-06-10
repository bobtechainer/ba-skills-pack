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
    const response = req.body;

    // Store response as JSON string
    await redis.set(`pm_response:${response.id}`, JSON.stringify(response));

    // Add ID to the list
    await redis.lpush('pm_response_ids', response.id);

    return res.status(200).json({ success: true, id: response.id });
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: 'Failed to save', detail: error.message });
  }
}
