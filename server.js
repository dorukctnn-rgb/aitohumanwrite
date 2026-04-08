const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const app = express();
app.set('view engine', 'ejs');

// Webhook doğrulaması için rawBody gereklidir
app.use(bodyParser.json({
    verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(bodyParser.urlencoded({ extended: true }));

// --- AYARLAR ---
const SUPABASE_URL = 'https://rtkpezqtjwsdjfwxojyx.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const LEMON_SIGNING_SECRET = process.env.LEMON_SIGNING_SECRET; 

// --- ROUTER ---
app.get('/', (req, res) => {
    res.render('index', { result: null, originalText: null });
});

app.get('/pricing', (req, res) => {
    res.render('pricing');
});

// --- LEMON SQUEEZY WEBHOOK (ÖDEME ONAYI) ---
app.post('/webhook', async (req, res) => {
    const hmac = crypto.createHmac('sha256', LEMON_SIGNING_SECRET);
    const digest = Buffer.from(hmac.update(req.rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
        console.log("❌ Geçersiz imza denemesi!");
        return res.status(401).send('Invalid signature');
    }

    const payload = req.body;
    const email = payload.data.attributes.user_email;
    const eventName = payload.meta.event_name;

    if (eventName === 'order_created' || eventName === 'subscription_created') {
        // Kullanıcıyı Pro yap ve 9999 kredi ver
        await supabase
            .from('users')
            .update({ is_pro: true, credits: 9999 })
            .eq('email', email);
        
        console.log(`✅ BAŞARILI: ${email} ödeme yaptı ve Pro oldu!`);
    }
    res.status(200).send('OK');
});

// --- HUMANİZE MOTORU ---
app.post('/humanize', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama3-70b-8192",
            messages: [
                {role: "system", content: "You are a professional human editor. Rewrite the text to be 100% human-like, removing all AI patterns. Maintain the same meaning."},
                {role: "user", content: text}
            ]
        }, { headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` } });

        res.render('index', { 
            result: response.data.choices[0].message.content, 
            originalText: text 
        });
    } catch (e) {
        res.send("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sistem Yayında: Port ${PORT}`));
