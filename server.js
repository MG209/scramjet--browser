const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const queryObject = url.parse(req.url, true).query;
    const targetUrl = queryObject.url;

    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing target URL parameters.');
        return;
    }

    try {
        const parsedTarget = url.parse(targetUrl);
        const transport = parsedTarget.protocol === 'https:' ? https : http;

        const options = {
            hostname: parsedTarget.hostname,
            path: parsedTarget.path,
            method: req.method,
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
            }
        };

        const proxyReq = transport.request(options, (proxyRes) => {
            const safeHeaders = { ...proxyRes.headers };
            delete safeHeaders['x-frame-options'];
            delete safeHeaders['content-security-policy'];
            safeHeaders['Access-Control-Allow-Origin'] = '*';

            res.writeHead(proxyRes.statusCode, safeHeaders);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Proxy connection failed: ${err.message}`);
        });

        req.pipe(proxyReq);

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Invalid URL payload processed.');
    }
});

server.listen(PORT, () => {
    console.log(`Proxy server actively running on port ${PORT}`);
});
