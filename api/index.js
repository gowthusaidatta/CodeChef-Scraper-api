import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  try {
    const { data } = await axios.get(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(data);

    const rating = $('.rating-number').text().trim() || '0';
    const stars = $('span.rating').text().trim() || 'Unrated';
    const problemsSolvedMatch = $('h3:contains("Total Problems Solved")').text().match(/\d+/);
    const contests = $('.contest-participated-count b').text() || '0';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      platform: 'codechef',
      username,
      problems_solved: parseInt(problemsSolvedMatch ? problemsSolvedMatch[0] : '0'),
      rating: parseInt(rating),
      stars,
      contests_participated: parseInt(contests)
    });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch CodeChef profile" });
  }
}
