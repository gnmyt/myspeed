const express = require('express');
const path = require('path');

const app = express();
const port = process.env.port || 5216;

// Register middlewares
app.use(express.json());


// Enable production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Server listening on port ${port}`));