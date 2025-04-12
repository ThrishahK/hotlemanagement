// backend.js (using Node.js with Express framework)

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // You can choose a different port

// Enable CORS for all origins (for development; restrict in production)
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());



// Get all hotels
app.get('/api/hotels', (req, res) => {
    db.all('SELECT * FROM hotels', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve hotels' });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific hotel by ID
app.get('/api/hotels/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM hotels WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve hotel' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Hotel not found' });
        }
    });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
    db.all('SELECT * FROM bookings', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve bookings' });
        } else {
            res.json(rows);
        }
    });
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
    const { hotel_id, guest_name, check_in, check_out, room_type, num_guests } = req.body;
    if (!hotel_id || !guest_name || !check_in || !check_out || !room_type || !num_guests) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    db.run(
        'INSERT INTO bookings (hotel_id, guest_name, check_in, check_out, room_type, num_guests) VALUES (?, ?, ?, ?, ?, ?)',
        [hotel_id, guest_name, check_in, check_out, room_type, num_guests],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to create booking' });
            } else {
                res.status(201).json({ message: 'Booking created successfully', booking_id: this.lastID });
            }
        }
    );
});

// Delete a booking by ID
app.delete('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM bookings WHERE id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete booking' });
        } else if (this.changes > 0) {
            res.json({ message: 'Booking deleted successfully' });
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    });
});

// Get all dining options
app.get('/api/dining', (req, res) => {
    db.all('SELECT * FROM dining', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve dining options' });
        } else {
            res.json(rows);
        }
    });
});

// Get all takeaway items
app.get('/api/takeaway', (req, res) => {
    db.all('SELECT * FROM takeaway', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve takeaway items' });
        } else {
            res.json(rows);
        }
    });
});

// Process a payment
app.post('/api/payments', (req, res) => {
    const { booking_id, amount, payment_method, card_details } = req.body;
    if (!booking_id || !amount || !payment_method) {
        return res.status(400).json({ error: 'Missing required payment information' });
    }
    // In a real application, you would integrate with a payment gateway here
    // and handle card details securely. For this example, we'll just record it.
    db.run(
        'INSERT INTO payments (booking_id, amount, payment_method, card_details) VALUES (?, ?, ?, ?)',
        [booking_id, amount, payment_method, card_details],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to process payment' });
            } else {
                res.status(201).json({ message: 'Payment processed successfully', payment_id: this.lastID });
            }
        }
    );
});

// Get all reviews
app.get('/api/reviews', (req, res) => {
    db.all('SELECT * FROM reviews', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve reviews' });
        } else {
            res.json(rows);
        }
    });
});

// Add a new review
app.post('/api/reviews', (req, res) => {
    const { hotel_id, guest_name, rating, comment } = req.body;
    if (!hotel_id || !guest_name || !rating) {
        return res.status(400).json({ error: 'Missing required review fields' });
    }
    db.run(
        'INSERT INTO reviews (hotel_id, guest_name, rating, comment) VALUES (?, ?, ?, ?)',
        [hotel_id, guest_name, rating, comment],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to add review' });
            } else {
                res.status(201).json({ message: 'Review added successfully', review_id: this.lastID });
            }
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});