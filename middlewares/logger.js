/**
 * Global Request/Response Logger Middleware
 * Logs incoming requests and outgoing responses to the terminal
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toLocaleString();

    // Log Request
    console.log(`\n[${timestamp}] >>> ${req.method} ${req.originalUrl}`);

    // Optional: Log headers/body for deeper debugging (uncomment if needed)
    // console.log('Headers:', JSON.stringify(req.headers, null, 2));
    // if (Object.keys(req.body).length) console.log('Body:', JSON.stringify(req.body, null, 2));

    // Capture Response
    const originalSend = res.send;
    res.send = function (content) {
        const duration = Date.now() - start;
        console.log(`[${new Date().toLocaleString()}] <<< ${res.statusCode} (${duration}ms)`);
        return originalSend.apply(this, arguments);
    };

    next();
};

export default requestLogger;
