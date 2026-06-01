const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

const hostRedirect = `
// Vercel subdomain ve www'yu ana domaine 301 yonlendir (duplicate icerik onleme)
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.includes('vercel.app') || host.startsWith('www.')) {
    return res.redirect(301, 'https://aitohumanwrite.com' + req.originalUrl);
  }
  next();
});

`;

// ilk app.get('/'den ONCE, app tanimindan SONRA ekle
c = c.replace("app.use(cookieParser());", "app.use(cookieParser());\n" + hostRedirect);

fs.writeFileSync('server.js', c);
console.log('Host redirect eklendi');
