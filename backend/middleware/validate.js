const PRIORITIES = ['low', 'medium', 'high'];


function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}
function isBoolean(v) {
    return typeof v === 'boolean';
}
function isPriority(v) {
    return typeof v === 'string' && PRIORITIES.includes(v);
}
function isIsoDateLike(v) {
    if (v === null) return true;
    if (typeof v !== 'string') return false;
    const d = new Date(v);
    return !isNaN(d.getTime());
}
function badRequest(details) {
    const err = new Error('ValidationError');
    err.status = 400;
    if (Array.isArray(details)) err.details = details;
    return err;
}

function validateCreateTask(req, res, next) {
    const { title, description, completed, priority, dueDate } = req.body || {};
    const errors = [];

    if (!isNonEmptyString(title)) errors.push('title is required (non-empty string)');
    if (description !== undefined && typeof description !== 'string') errors.push('description must be a string');
    if (completed !== undefined && !isBoolean(completed)) errors.push('completed must be boolean');
    if (priority !== undefined && !isPriority(priority)) errors.push("priority must be one of: 'low' | 'medium' | 'high'");
    if (dueDate !== undefined && !isIsoDateLike(dueDate)) errors.push('dueDate must be null or a valid date string');

    if (errors.length) return next(badRequest(errors));
    return next();
}


function validateUpdateTask(req, res, next) {
    const { title, description, completed, priority, dueDate } = req.body || {};
    const errors = [];

    if (!isNonEmptyString(title)) errors.push('title is required (non-empty string)');
    if (typeof description !== 'string') errors.push('description is required and must be a string');
    if (!isBoolean(completed)) errors.push('completed is required and must be boolean');
    if (!isPriority(priority)) errors.push("priority is required and must be one of: 'low' | 'medium' | 'high'");
    if (!isIsoDateLike(dueDate)) errors.push('dueDate is required and must be null or a valid date string');

    if (errors.length) return next(badRequest(errors));
    return next();
}


function validateIdParam(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return next(badRequest(['id param must be a positive integer']));
    }
    req.taskId = id;
    return next();
}

module.exports = {
    PRIORITIES,
    validateCreateTask,
    validateUpdateTask,
    validateIdParam,
};
