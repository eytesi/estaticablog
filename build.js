const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR  = './posts';
const OUTPUT_JS  = './posts-data.js';
const OUTPUT_XML = './sitemap.xml';
const SITE_URL   = 'https://TU-SITIO.netlify.app'; // ← cambiar por tu URL

// ── Read markdown files ──
const files = fs.existsSync(POSTS_DIR)
  ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  : [];

const posts = files.map(file => {
  const raw  = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, '');
  return {
    slug,
    title:    data.title    || 'Sin título',
    date:     data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    category: data.category || 'personal',
    tags:     data.tags     || [],
    excerpt:  data.excerpt  || '',
    readTime: data.readTime || Math.max(1, Math.ceil(content.split(' ').length / 200)),
    featured: data.featured || false,
    cover:    data.cover    || null,
    content:  marked(content),
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

// ── Generate posts-data.js ──
const js = `// Auto-generado por build.js — no editar manualmente\n// Última actualización: ${new Date().toISOString()}\nwindow.POSTS_EXTERNAL = ${JSON.stringify(posts)};\n`;

fs.writeFileSync(OUTPUT_JS, js);
console.log(`✓ posts-data.js generado con ${posts.length} entradas`);

// ── Generate sitemap.xml ──
const staticPages = [
  { url: '/',             priority: '1.0' },
  { url: '/sobre.html',   priority: '0.7' },
  ...['trabajo','actualidad','lgbtq','salud','personal'].map(cat => ({
    url: `/categoria.html?cat=${cat}`,
    priority: '0.8',
  })),
];

const postPages = posts.map(p => ({
  url:      `/post.html?slug=${p.slug}`,
  lastmod:  p.date,
  priority: '0.9',
}));

const allPages = [...staticPages, ...postPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(OUTPUT_XML, xml);
console.log(`✓ sitemap.xml generado con ${allPages.length} URLs`);
