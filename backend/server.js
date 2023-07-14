const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const turf = require('@turf/turf');

const app = express();
app.use(bodyParser.json());

const secretKey = 'MAPUP@123';

// Authentication middleware
const authenticate =  (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
    try {
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decoded =  jwt.verify(tokenWithoutBearer, secretKey);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = decoded; // Store the decoded token payload for future use

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Login route for generating JWT token
app.post('/login', (req, res) => {
    // Perform authentication logic, validate credentials, etc.
    const username = req.body.username;
    const password = req.body.password;

    // Dummy example of authentication
    if (username === 'admin' && password === 'password') {
        // Authentication successful, generate JWT token
        const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1day' });

        // Return the token in the response
        res.json({ token: token });
    } else {
        // Authentication failed
        res.status(401).json({ error: 'Unauthorized' });
    }
});


app.post('/intersections', authenticate, (req, res) => {
    try {
        // Check if the linestring is present and valid
        const linestring = req.body.linestring;

        if (!linestring || !isValidLinestring(linestring)) {
            return res.status(400).json({ error: 'Invalid linestring' });
        }

        // Generate random lines (start and end points)
        const lines = generateRandomLines(); // Implement this function as per your requirements

        // Perform intersection calculation using turf.js
        const intersectingLines = lines.filter((line) => {
            const lineString = turf.lineString([line.start, line.end]);
            const intersection = turf.lineIntersect(lineString, linestring);
            return intersection.features.length > 0;
        });

        // Return the intersecting lines in the response
        if (intersectingLines.length > 0) {
            res.json({ intersectingLines });
        } else {
            res.json({ intersectingLines: [] });
        }
    } catch (error) {
        // Handle any errors that occur during processing
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Check if a GeoJSON linestring is valid
function isValidLinestring(linestring) {
    // Check if it's a linestring with at least two coordinates
    return (
        linestring &&
        linestring.type === 'LineString' &&
        Array.isArray(linestring.coordinates) &&
        linestring.coordinates.length >= 2
    );
}


// Function to generate random lines (start and end points)
function generateRandomLines() {
    const lines = [];
    const numLines = 50; // Number of randomly generated lines

    for (let i = 1; i <= numLines; i++) {
        // Generate random start and end points
        const start = [getRandomCoordinate(), getRandomCoordinate()];
        const end = [getRandomCoordinate(), getRandomCoordinate()];

        // Create the line object
        const line = {
            start: start,
            end: end,
            id: `L${i.toString().padStart(2, '0')}`, // Generate line ID (L01 - L50)
        };

        lines.push(line);
    }

    return lines;
}

// Helper function to generate a random coordinate between -10 and 10
function getRandomCoordinate() {
    return Math.random() * 20 - 10;
}


// Start the server
app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
