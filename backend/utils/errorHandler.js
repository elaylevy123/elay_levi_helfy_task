class HttpError extends Error {

    constructor(status, message, details) {
        super(message);
        this.status = status;
        if (Array.isArray(details)) this.details = details;
    }
}

const badRequest = (message = 'Bad Request', details) =>
    new HttpError(400, message, details);

const notFound = (message = 'Not Found') =>
    new HttpError(404, message);

module.exports = {
    HttpError,
    badRequest,
    notFound,
};
