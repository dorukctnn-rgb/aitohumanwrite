const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

const newRoutes = `

app.get('/blog/how-to-get-past-turnitin-ai', (req, res) => {
  res.render('blog-past-turnitin', {});
});

app.get('/blog/ai-to-human-rewriter', (req, res) => {
  res.render('blog-rewriter', {});
});

app.get('/blog/ai-to-human-text-converter', (req, res) => {
  res.render('blog-converter', {});
});
`;

// listen'den önce ekle
c = c.replace("if (require.main === module) {", newRoutes + "\nif (require.main === module) {");

fs.writeFileSync('server.js', c);
console.log('✓ 3 blog route eklendi');
