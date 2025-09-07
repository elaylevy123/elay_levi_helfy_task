const express = require('express');
const {
    PRIORITIES,
    validateCreateTask,
    validateUpdateTask,
    validateIdParam,
} = require('../middleware/validate');

const router = express.Router();

let nextId = 1;
let tasks = [];

// Helpers
function notFound(message = 'Task not found') {
    const err = new Error(message);
    err.status = 404;
    return err;
}
function toBoolean(v) {
    return v === true || v === 'true';
}
function toIsoOrNull(v) {
    if (v === null || v === undefined || v === '') return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
}
const PRIORITY_ORDER = { low: 1, medium: 2, high: 3 };

router.get('/', (req, res) => {
    const {
        q,
        completed,
        priority,
        dueBefore,
        dueAfter,
        sortBy = 'createdAt',
        order = 'desc',
    } = req.query;

    let result = [...tasks];

    // חיפוש טקסטואלי
    if (typeof q === 'string' && q.trim() !== '') {
        const term = q.trim().toLowerCase();
        result = result.filter(
            t =>
                t.title.toLowerCase().includes(term) ||
                t.description.toLowerCase().includes(term)
        );
    }

    if (completed === 'true' || completed === 'false') {
        const want = completed === 'true';
        result = result.filter(t => t.completed === want);
    }

    if (typeof priority === 'string' && PRIORITIES.includes(priority)) {
        result = result.filter(t => t.priority === priority);
    }

    // סינון לפי dueDate
    const dueBeforeDate = dueBefore ? new Date(dueBefore) : null;
    const dueAfterDate = dueAfter ? new Date(dueAfter) : null;
    if (dueBeforeDate && !isNaN(dueBeforeDate.getTime())) {
        result = result.filter(t => t.dueDate && new Date(t.dueDate) <= dueBeforeDate);
    }
    if (dueAfterDate && !isNaN(dueAfterDate.getTime())) {
        result = result.filter(t => t.dueDate && new Date(t.dueDate) >= dueAfterDate);
    }

    // מיון
    const dir = order === 'asc' ? 1 : -1;
    result.sort((a, b) => {
        let A, B;
        switch (sortBy) {
            case 'title':
                A = a.title.toLowerCase();
                B = b.title.toLowerCase();
                return A < B ? -1 * dir : A > B ? 1 * dir : 0;
            case 'priority':
                A = PRIORITY_ORDER[a.priority] || 0;
                B = PRIORITY_ORDER[b.priority] || 0;
                return (A - B) * dir;
            case 'dueDate': {
                const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                return (da - db) * dir;
            }
            case 'createdAt':
            default: {
                const ca = new Date(a.createdAt).getTime();
                const cb = new Date(b.createdAt).getTime();
                return (ca - cb) * dir;
            }
        }
    });

    res.json(result);
});

router.post('/', validateCreateTask, (req, res) => {
    const {
        title,
        description = '',
        completed = false,
        priority = 'medium',
        dueDate = null,
    } = req.body;

    const task = {
        id: nextId++,
        title: title.trim(),
        description: typeof description === 'string' ? description.trim() : '',
        completed: toBoolean(completed),
        createdAt: new Date().toISOString(),
        priority: PRIORITIES.includes(priority) ? priority : 'medium',
        dueDate: toIsoOrNull(dueDate),
    };

    tasks.push(task);

    res
        .status(201)
        .location(`/api/tasks/${task.id}`)
        .json(task);
});

router.put('/:id', validateIdParam, validateUpdateTask, (req, res, next) => {
    const id = req.taskId;
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return next(notFound());

    const { title, description, completed, priority, dueDate } = req.body;

    const updated = {
        ...tasks[idx],
        title: title.trim(),
        description: description.trim(),
        completed: toBoolean(completed),
        priority,
        dueDate: toIsoOrNull(dueDate),

    };

    tasks[idx] = updated;
    res.json(updated);
});

router.delete('/:id', validateIdParam, (req, res, next) => {
    const id = req.taskId;
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return next(notFound());

    tasks.splice(idx, 1);
    return res.status(204).send(); // No Content
});

router.patch('/:id/toggle', validateIdParam, (req, res, next) => {
    const id = req.taskId;
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return next(notFound());

    tasks[idx].completed = !tasks[idx].completed;
    res.json(tasks[idx]);
});

module.exports = router;
