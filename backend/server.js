const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// --- Import Controllers ---
const UserController = require('./controllers/UserController');
const ModulesController = require('./controllers/ModulesController');
// Import Controllers yang sudah kita buat sebelumnya:
const ClassesController = require('./controllers/ClassesController'); // Controller Classes
const ClassAssignmentController = require('./controllers/ClassAsignmentControler'); // Controller Assignment
const ClassSubmissionController = require('./controllers/ClassSubmissionController'); // Controller Submission

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(cookieParser());

app.get('/api/', (req, res) => {
    res.send('Backend Server is running.');
});

// --- Register Routes ---
app.use('/api/users', UserController);
app.use('/api/modules', ModulesController);

// Daftarkan Routes yang baru:
app.use('/api/classes', ClassesController); // Rute untuk Classes & Enrolment
app.use('/api/assignments', ClassAssignmentController); // Rute untuk Class Assignment
app.use('/api/submissions', ClassSubmissionController); // Rute untuk Class Submission

// Run server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
