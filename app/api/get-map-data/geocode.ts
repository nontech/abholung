import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  try {
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: apiKey,
        text: address,
        'boundary.rect.min_lon': 13.088209,
        'boundary.rect.min_lat': 52.339630,
        'boundary.rect.max_lon': 13.761160,
        'boundary.rect.max_lat': 52.675454,
      },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error in geocode API:', error);
    res.status(500).json({ error: 'Failed to fetch geocode data' });
  }
};

export default handler;
