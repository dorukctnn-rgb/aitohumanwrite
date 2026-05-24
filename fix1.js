const fs = require('fs');

// 1. ANA SAYFA - index.ejs title ve description
let idx = fs.readFileSync('views/index.ejs', 'utf8');

idx = idx.replace(
  '<title>Free AI Humanizer — Bypass GPTZero &amp; Turnitin Instantly (2026)</title>',
  '<title>Free AI Humanizer (No Signup) — Bypass GPTZero in 5 Seconds | 2026</title>'
);

idx = idx.replace(
  /<meta name="description" content="#1 Free AI humanizer\..*?250 words free\.">/,
  '<meta name="description" content="Free AI humanizer ★ No signup needed. Paste ChatGPT text, get undetectable human writing in 5 seconds. Bypasses GPTZero, Turnitin, Originality.ai. 250 words free.">'
);

fs.writeFileSync('views/index.ejs', idx);
console.log('✓ Ana sayfa title + description güncellendi');

// 2. SERVER.JS - iki SEO sayfasının title/desc
let srv = fs.readFileSync('server.js', 'utf8');

srv = srv.replace(
  "title: 'Make ChatGPT Text Undetectable',",
  "title: 'Make ChatGPT Undetectable in 5 Seconds (Free, 2026)',"
);
srv = srv.replace(
  "desc: 'Make your ChatGPT text 100% undetectable instantly. Bypass GPTZero, Turnitin and Originality.ai. Free, no signup needed.'",
  "desc: '★ #1 Free tool to make ChatGPT text 100% undetectable. Bypass GPTZero, Turnitin, Originality.ai in seconds. No signup. Try free.'"
);

srv = srv.replace(
  "title: 'Humanize AI Text for Business',",
  "title: 'Humanize AI Text for Business — Free Tool (2026)',"
);
srv = srv.replace(
  "desc: 'Make AI-generated business content sound natural and human. Perfect for marketing copy, emails and reports. Free to try.'",
  "desc: 'Free tool ★ Humanize AI marketing copy, emails, reports in 5 seconds. Sound natural, bypass AI detectors. No signup required.'"
);

fs.writeFileSync('server.js', srv);
console.log('✓ Server.js SEO sayfaları güncellendi');

console.log('\nHepsi tamam! Şimdi push edebilirsin.');
