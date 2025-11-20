const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const UserController = require('./controllers/UserController');

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

app.use('/api/users', UserController);

// Run server
app.listen(port, () => {
	console.log(`Server is listening on http://localhost:${port}`);
});
