const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

const flights = [
    {
        id: 1,
        callsign: 'SP-KOK',
        departure: 'EPKK',
        destination: 'EPKP',
        ete: '00:45',
    },
    {
        id: 2,
        callsign: 'SP-REL',
        departure: 'EPKP',
        destination: 'EPML',
        ete: '00:45',
    },
];

function sendJson(res, statusCode, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname.replace(/\/+$/g, '') || '/';
    const method = req.method.toUpperCase();

    if (method === 'GET' && pathname === '/api/flights') {
        return sendJson(res, 200, flights);
    }

});

server.listen(PORT, () => {
    console.log(`Flight Planner API listening on http://localhost:${PORT}`);
});

module.exports = server;
