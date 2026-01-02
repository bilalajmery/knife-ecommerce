export default function sitemap() {
    const baseUrl = 'https://knifemaster.com'; // Replace with your actual domain

    const routes = [
        '',
        '/about',
        '/shop',
        '/contact',
        '/faq',
        '/shipping-policy',
        '/returns-exchanges',
        '/warranty-hub',
        '/track-order',
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy',
        '/signin',
        '/signup',
        '/site-map',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));
}
