const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

const redirects = `
// Eski olu URL'leri ana sayfaya yonlendir (404 temizligi)
app.get('/SENIN_LEMON_PREMIUM_LINKIN', (req, res) => res.redirect(301, '/'));
app.get('/humanize-ai-text-for-marketing', (req, res) => res.redirect(301, '/humanize-ai-text-for-business'));
app.get('/ai-to-human-text-converter-free', (req, res) => res.redirect(301, '/blog/ai-to-human-text-converter'));

`;

// listen blogundan once ekle
c = c.replace("if (require.main === module) {", redirects + "if (require.main === module) {");

fs.writeFileSync('server.js', c);
console.log('3 redirect eklendi');
