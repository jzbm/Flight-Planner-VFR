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

    // Endpoint
    if (method === 'GET' && pathname === '/api/flights') {
        return sendJson(res, 200, flights);
    }

    // GET /api/flights/:id
    const flightMatch = pathname.match(/^\/api\/flights\/(.+)$/);
    if (method === 'GET' && flightMatch) {
        const rawId = flightMatch[1];
        // controlled error
        if (!/^\d+$/.test(rawId)) {
            return sendJson(res, 400, {
                error: 'Bad Request',
                message: 'Flight id must be a numeric value.',
            });
        }
        const id = Number(rawId);
        const flight = flights.find((f) => f.id === id);

        if (!flight) {
            return sendJson(res, 404, {
                error: 'Not Found',
                message: `Flight with id=${id} does not exist.`,
            });
        }

        return sendJson(res, 200, flight);
    }

    // Fallback 404
    return sendJson(res, 404, {
        error: 'Not Found',
        message: 'Endpoint is not defined.',
    });
});

server.listen(PORT, () => {
    console.log(`Flight Planner API listening on http://localhost:${PORT}`);
});

module.exports = server;
