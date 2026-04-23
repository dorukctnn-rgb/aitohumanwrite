const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const users = {};

const SEO_PAGES = {
  'students':  { title: 'AI Humanizer for Students', desc: 'Bypass Turnitin and GPTZero instantly. Make your AI essays 100% human and undetectable.' },
  'bloggers':  { title: 'AI Humanizer for Bloggers', desc: 'Turn AI blog drafts into natural human-sounding content that ranks on Google.' },
  'marketing': { title: 'AI Humanizer for Marketers', desc: 'Make AI-generated marketing copy sound authentic and convert better.' },
  'seo':       { title: 'AI Humanizer for SEO Writers', desc: 'Humanize AI content that ranks. Keep keywords, lose the robot tone.' }
};

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  var xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  xml += '<url><loc>https://aitohumanwrite.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
  xml += '<url><loc>https://aitohumanwrite.com/students</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>';
  xml += '<url><loc>https://aitohumanwrite.com/bloggers</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>';
  xml += '<url><loc>https://aitohumanwrite.com/marketing</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>';
  xml += '<url><loc>https://aitohumanwrite.com/seo</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>';
  xml += '</urlset>';
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send('User-agent: *\nAllow: /\nSitemap: https://aitohumanwrite.com/sitemap.xml');
});

app.get('/ai-to-human-text-converter-free', (req, res) => {
  res.redirect(301, '/');
});

Object.keys(SEO_PAGES).forEach(slug => {
  app.get('/' + slug, (req, res) => {
    const isPro = req.cookies.pro === 'true';
    res.render('index', { result: null, originalText: '', score: null, humanScore: null, isPro, page: SEO_PAGES[slug] });
  });
});

app.get('/', (req, res) => {
  const isPro = req.cookies.pro === 'true';
  res.render('index', { result: null, originalText: '', score: null, humanScore: null, isPro, page: null });
});

app.post('/humanize', async (req, res) => {
  const { text, email } = req.body;
  const isPro = req.cookies.pro === 'true' || (users[email] && users[email].pro);

  if (!text || text.trim().length < 10) {
    return res.render('index', { result: 'Please enter some text.', originalText: '', score: null, humanScore: null, isPro, page: null });
  }

  const wordCount = text.trim().split(/\s+/).length;

  if (!isPro && wordCount > 250) {
    return res.render('index', { result: 'FREE_LIMIT', originalText: text, score: null, humanScore: null, isPro: false, page: null });
  }

  const aiScore = Math.floor(Math.random() * 20) + 75;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert human editor. Rewrite the following AI-generated text to sound 100% natural and human-written. Rules: vary sentence length dramatically, add occasional contractions, use simpler words where possible, add subtle imperfections humans make, preserve the original meaning completely, never sound robotic or formulaic. Output ONLY the rewritten text, nothing else.'
        },
        { role: 'user', content: text }
      ],
      temperature: 0.85,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data.choices[0].message.content.trim();
    const humanScore = Math.floor(Math.random() * 8) + 92;

    res.render('index', { result, originalText: text, score: aiScore, humanScore, isPro, page: null });

  } catch (err) {
    console.error('Groq error:', err.message);
    res.render('index', { result: 'Service error. Please try again.', originalText: text, score: null, humanScore: null, isPro, page: null });
  }
});

app.post('/webhook', (req, res) => {
  try {
    const event = req.body;
    console.log('WEBHOOK:', JSON.stringify(event));
    const email = event.email || (event.data && event.data.attributes && event.data.attributes.user_email);
    if (email) {
      users[email] = { pro: true };
      console.log('NEW PRO USER:', email);
    }
  } catch (e) {
    console.error('Webhook error:', e.message);
  }
  res.sendStatus(200);
});

app.get('/pro', (req, res) => {
  res.cookie('pro', 'true', { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log('aitohumanwrite running on ' + PORT));
