const fs = require('fs');

// 1. SERVER.JS - sitemap'e 3 yeni URL ekle
let srv = fs.readFileSync('server.js', 'utf8');

const newSitemapEntries = `  xml += '<url><loc>https://aitohumanwrite.com/blog/how-to-get-past-turnitin-ai</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>';
  xml += '<url><loc>https://aitohumanwrite.com/blog/ai-to-human-rewriter</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>';
  xml += '<url><loc>https://aitohumanwrite.com/blog/ai-to-human-text-converter</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>';
  xml += '</urlset>';`;

srv = srv.replace("xml += '</urlset>';", newSitemapEntries);
fs.writeFileSync('server.js', srv);
console.log('✓ Sitemap güncellendi');

// 2. BLOG INDEX - 3 yeni yazıyı ekle
let idx = fs.readFileSync('views/blog-index.ejs', 'utf8');

const newPosts = `      <a href="/blog/free-turnitin-checker">Read article &rarr;</a>
    </div>
    <div class="post">
      <div class="post-tag">Turnitin Guide</div>
      <h2>How to Get Past Turnitin AI Detection (Step-by-Step)</h2>
      <p>Worried Turnitin will flag your essay? Step-by-step proven techniques to get past AI detection in 2026.</p>
      <a href="/blog/how-to-get-past-turnitin-ai">Read article &rarr;</a>
    </div>
    <div class="post">
      <div class="post-tag">Tools</div>
      <h2>AI to Human Rewriter — Free Tool That Actually Works</h2>
      <p>The best free AI to human rewriter in 2026. Converts ChatGPT, Claude and Gemini text to natural human writing.</p>
      <a href="/blog/ai-to-human-rewriter">Read article &rarr;</a>
    </div>
    <div class="post">
      <div class="post-tag">Free Tool</div>
      <h2>AI to Human Text Converter — Free Online Tool</h2>
      <p>Paste AI text, get natural human writing in 5 seconds. Bypasses all AI detectors. No signup needed.</p>
      <a href="/blog/ai-to-human-text-converter">Read article &rarr;</a>
    </div>`;

idx = idx.replace('      <a href="/blog/free-turnitin-checker">Read article &rarr;</a>\n    </div>', newPosts);

fs.writeFileSync('views/blog-index.ejs', idx);
console.log('✓ Blog index güncellendi');

console.log('\nHazır! Şimdi git push edebilirsin.');
