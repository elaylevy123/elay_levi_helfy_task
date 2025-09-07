// backend/server.js
// שרת Express: middleware תקניים, ראוטים, 404 ושגיאות — רץ על פורט 4000

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const tasksRouter = require('./routes/tasks');                // ניצור בהמשך
const { notFound } = require('./middleware/notFound');        // ניצור בהמשך
const { errorHandler } = require('./middleware/errorHandler'); // ניצור בהמשך

const PORT = 4000;
const app = express();

// --- Global middleware ---
app.use(cors());            // לאפשר קריאות מהפרונט
app.use(express.json());    // לפרסר JSON בבקשות
app.use(morgan('dev'));     // לוגים נוחים (רציני ומועיל)

// --- Health check (אופציונלי) ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- API routes ---
app.use('/api/tasks', tasksRouter);

// --- 404 + Error handling ---
app.use(notFound);
app.use(errorHandler);

// --- Start server ---
app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
});
