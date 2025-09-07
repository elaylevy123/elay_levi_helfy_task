function errorHandler(err, req, res, next) {

    if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }


    if (err && err.status) {
        const payload = { error: err.message || 'Error' };
        if (Array.isArray(err.details)) payload.details = err.details;
        return res.status(err.status).json(payload);
    }

    return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { errorHandler };
