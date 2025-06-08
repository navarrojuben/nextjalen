export default function handler(req, res) {
  const baseUrl = 'https://nextjalen.vercel.app'; // Replace with your actual domain

  const staticPages = [
    '',
    '/codes',
    '/dashboard',
    '/dates',
    '/home',
    '/inbox',
    '/links',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => {
    return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();
}
