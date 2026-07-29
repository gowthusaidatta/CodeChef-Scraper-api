import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    const { data } = await axios.get(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(data);

    const rating = $('.rating-number').text().trim() || '0';
    const stars = $('span.rating').text().trim() || 'Unrated';
    const problemsSolvedText = $('h3:contains("Total Problems Solved")').text();
    const problemsSolvedMatch = problemsSolvedText.match(/\d+/);
    const contests = $('.contest-participated-count b').text() || '0';

    res.status(200).json({
      problems_solved: parseInt(problemsSolvedMatch ? problemsSolvedMatch[0] : '0', 10),
      contest_rating: parseInt(rating, 10),
      stars,
      contests_participated: parseInt(contests, 10)
    });
  } catch (error) {
    res.status(500).json({ error: "User not found or site layout changed" });
  }
}
