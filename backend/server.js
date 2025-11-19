const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.get('/api/', (req, res) => {
	res.send('Backend Server is running.');
});

// Run server
app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}`);
});
