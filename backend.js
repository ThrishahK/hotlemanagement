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

// Set up the database connection
const db = new sqlite3.Database('./db/main.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the HotelDB database');
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
    }
});

// ---------- CUSTOMER ROUTES ----------

// Get all customers
app.get('/api/customers', (req, res) => {
    db.all('SELECT * FROM Customer', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve customers' });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific customer by phone
app.get('/api/customers/:phone', (req, res) => {
    const phone = req.params.phone;
    db.get('SELECT * FROM Customer WHERE cust_phone = ?', [phone], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve customer' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

// Create a new customer
app.post('/api/customers', (req, res) => {
    const { cust_phone, cust_name, cust_mail } = req.body;
    if (!cust_phone || !cust_name) {
        return res.status(400).json({ error: 'Phone and name are required fields' });
    }

    db.run(
        'INSERT INTO Customer (cust_phone, cust_name, cust_mail) VALUES (?, ?, ?)',
        [cust_phone, cust_name, cust_mail],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to create customer' });
            } else {
                res.status(201).json({
                    message: 'Customer created successfully',
                    phone: cust_phone
                });
            }
        }
    );
});

// Update a customer
app.put('/api/customers/:phone', (req, res) => {
    const phone = req.params.phone;
    const { cust_name, cust_mail } = req.body;
    if (!cust_name) {
        return res.status(400).json({ error: 'Customer name is required' });
    }

    db.run(
        'UPDATE Customer SET cust_name = ?, cust_mail = ? WHERE cust_phone = ?',
        [cust_name, cust_mail, phone],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update customer' });
            } else if (this.changes > 0) {
                res.json({ message: 'Customer updated successfully' });
            } else {
                res.status(404).json({ error: 'Customer not found' });
            }
        }
    );
});

// Delete a customer
app.delete('/api/customers/:phone', (req, res) => {
    const phone = req.params.phone;
    db.run('DELETE FROM Customer WHERE cust_phone = ?', [phone], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete customer' });
        } else if (this.changes > 0) {
            res.json({ message: 'Customer deleted successfully' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

// ---------- HOTEL ROUTES ----------

// Get all hotels
app.get('/api/hotels', (req, res) => {
    db.all('SELECT * FROM Hotel', (err, rows) => {
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
    db.get('SELECT * FROM Hotel WHERE hotel_id = ?', [id], (err, row) => {
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

// Create a new hotel
app.post('/api/hotels', (req, res) => {
    const { hotel_name, hotel_ratings, city, area, state } = req.body;
    if (!hotel_name) {
        return res.status(400).json({ error: 'Hotel name is required' });
    }

    db.run(
        'INSERT INTO Hotel (hotel_name, hotel_ratings, city, area, state) VALUES (?, ?, ?, ?, ?)',
        [hotel_name, hotel_ratings, city, area, state],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to create hotel' });
            } else {
                res.status(201).json({
                    message: 'Hotel created successfully',
                    hotel_id: this.lastID
                });
            }
        }
    );
});

// Update a hotel
app.put('/api/hotels/:id', (req, res) => {
    const id = req.params.id;
    const { hotel_name, hotel_ratings, city, area, state } = req.body;
    if (!hotel_name) {
        return res.status(400).json({ error: 'Hotel name is required' });
    }

    db.run(
        'UPDATE Hotel SET hotel_name = ?, hotel_ratings = ?, city = ?, area = ?, state = ? WHERE hotel_id = ?',
        [hotel_name, hotel_ratings, city, area, state, id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update hotel' });
            } else if (this.changes > 0) {
                res.json({ message: 'Hotel updated successfully' });
            } else {
                res.status(404).json({ error: 'Hotel not found' });
            }
        }
    );
});

// Delete a hotel
app.delete('/api/hotels/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Hotel WHERE hotel_id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete hotel' });
        } else if (this.changes > 0) {
            res.json({ message: 'Hotel deleted successfully' });
        } else {
            res.status(404).json({ error: 'Hotel not found' });
        }
    });
});

// ---------- BOOKING ROUTES ----------

// Get all bookings
app.get('/api/bookings', (req, res) => {
    db.all(`
    SELECT b.*, c.cust_name, h.hotel_name 
    FROM Booking b
    JOIN Customer c ON b.cust_phone = c.cust_phone
    JOIN Hotel h ON b.hotel_id = h.hotel_id
  `, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve bookings' });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific booking by ID
app.get('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    db.get(`
    SELECT b.*, c.cust_name, h.hotel_name 
    FROM Booking b
    JOIN Customer c ON b.cust_phone = c.cust_phone
    JOIN Hotel h ON b.hotel_id = h.hotel_id
    WHERE b.booking_id = ?
  `, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve booking' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    });
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
    const { cust_phone, hotel_id, check_in_date, check_out_date } = req.body;
    if (!cust_phone || !hotel_id || !check_in_date || !check_out_date) {
        return res.status(400).json({ error: 'Missing required fields for booking' });
    }

    db.run(
        'INSERT INTO Booking (cust_phone, hotel_id, check_in_date, check_out_date) VALUES (?, ?, ?, ?)',
        [cust_phone, hotel_id, check_in_date, check_out_date],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to create booking' });
            } else {
                res.status(201).json({
                    message: 'Booking created successfully',
                    booking_id: this.lastID
                });
            }
        }
    );
});

// Update a booking
app.put('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    const { check_in_date, check_out_date } = req.body;
    if (!check_in_date || !check_out_date) {
        return res.status(400).json({ error: 'Check-in and check-out dates are required' });
    }

    db.run(
        'UPDATE Booking SET check_in_date = ?, check_out_date = ? WHERE booking_id = ?',
        [check_in_date, check_out_date, id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update booking' });
            } else if (this.changes > 0) {
                res.json({ message: 'Booking updated successfully' });
            } else {
                res.status(404).json({ error: 'Booking not found' });
            }
        }
    );
});

// Delete a booking by ID
app.delete('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Booking WHERE booking_id = ?', [id], function (err) {
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

// ---------- DINING ROUTES ----------

// Get all dining options
app.get('/api/dining', (req, res) => {
    db.all('SELECT * FROM DINING', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve dining options' });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific dining option by ID
app.get('/api/dining/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM DINING WHERE dining_id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve dining option' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Dining option not found' });
        }
    });
});

// Create a new dining option
app.post('/api/dining', (req, res) => {
    const { dining_id, dining_type, dining_time, dnumber, veg, non_veg } = req.body;
    if (!dining_id || !dining_type || !dining_time) {
        return res.status(400).json({ error: 'Missing required dining fields' });
    }

    db.run(
        'INSERT INTO DINING (dining_id, dining_type, dining_time, dnumber, veg, non_veg) VALUES (?, ?, ?, ?, ?, ?)',
        [dining_id, dining_type, dining_time, dnumber, veg, non_veg],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to create dining option' });
            } else {
                res.status(201).json({
                    message: 'Dining option created successfully',
                    dining_id: dining_id
                });
            }
        }
    );
});

// Update a dining option
app.put('/api/dining/:id', (req, res) => {
    const id = req.params.id;
    const { dining_type, dining_time, dnumber, veg, non_veg } = req.body;
    if (!dining_type || !dining_time) {
        return res.status(400).json({ error: 'Dining type and time are required' });
    }

    db.run(
        'UPDATE DINING SET dining_type = ?, dining_time = ?, dnumber = ?, veg = ?, non_veg = ? WHERE dining_id = ?',
        [dining_type, dining_time, dnumber, veg, non_veg, id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update dining option' });
            } else if (this.changes > 0) {
                res.json({ message: 'Dining option updated successfully' });
            } else {
                res.status(404).json({ error: 'Dining option not found' });
            }
        }
    );
});

// Delete a dining option
app.delete('/api/dining/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM DINING WHERE dining_id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete dining option' });
        } else if (this.changes > 0) {
            res.json({ message: 'Dining option deleted successfully' });
        } else {
            res.status(404).json({ error: 'Dining option not found' });
        }
    });
});

// ---------- TAKEAWAY ROUTES ----------

// Get all takeaway items
app.get('/api/takeaways', (req, res) => {
    db.all('SELECT * FROM TAKEAWAYS', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve takeaway items' });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific takeaway item by ID
app.get('/api/takeaways/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM TAKEAWAYS WHERE order_id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve takeaway item' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Takeaway item not found' });
        }
    });
});

// Create a new takeaway item
app.post('/api/takeaways', (req, res) => {
    const { order_id, item_name, delivery_location } = req.body;
    if (!order_id || !item_name || !delivery_location) {
        return res.status(400).json({ error: 'Missing required takeaway fields' });
    }

    db.run(
        'INSERT INTO TAKEAWAYS (order_id, item_name, delivery_location) VALUES (?, ?, ?)',
        [order_id, item_name, delivery_location],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to create takeaway item' });
            } else {
                res.status(201).json({
                    message: 'Takeaway item created successfully',
                    order_id: order_id
                });
            }
        }
    );
});

// Update a takeaway item
app.put('/api/takeaways/:id', (req, res) => {
    const id = req.params.id;
    const { item_name, delivery_location } = req.body;
    if (!item_name || !delivery_location) {
        return res.status(400).json({ error: 'Item name and delivery location are required' });
    }

    db.run(
        'UPDATE TAKEAWAYS SET item_name = ?, delivery_location = ? WHERE order_id = ?',
        [item_name, delivery_location, id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update takeaway item' });
            } else if (this.changes > 0) {
                res.json({ message: 'Takeaway item updated successfully' });
            } else {
                res.status(404).json({ error: 'Takeaway item not found' });
            }
        }
    );
});

// Delete a takeaway item
app.delete('/api/takeaways/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM TAKEAWAYS WHERE order_id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete takeaway item' });
        } else if (this.changes > 0) {
            res.json({ message: 'Takeaway item deleted successfully' });
        } else {
            res.status(404).json({ error: 'Takeaway item not found' });
        }
    });
});

// ---------- PAYMENT ROUTES ----------

// Get all payments
app.get('/api/payments', (req, res) => {
    db.all('SELECT * FROM PAYMENT', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve payments' });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific payment by ID
app.get('/api/payments/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM PAYMENT WHERE payment_id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve payment' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    });
});

// Process a new payment
app.post('/api/payments', (req, res) => {
    const { payment_id, method_of_pay, transactions_detail } = req.body;
    if (!payment_id || !method_of_pay || !transactions_detail) {
        return res.status(400).json({ error: 'Missing required payment information' });
    }

    db.run(
        'INSERT INTO PAYMENT (payment_id, method_of_pay, transactions_detail) VALUES (?, ?, ?)',
        [payment_id, method_of_pay, transactions_detail],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to process payment' });
            } else {
                res.status(201).json({
                    message: 'Payment processed successfully',
                    payment_id: payment_id
                });
            }
        }
    );
});

// Update payment details
app.put('/api/payments/:id', (req, res) => {
    const id = req.params.id;
    const { method_of_pay, transactions_detail } = req.body;
    if (!method_of_pay || !transactions_detail) {
        return res.status(400).json({ error: 'Payment method and transaction details are required' });
    }

    db.run(
        'UPDATE PAYMENT SET method_of_pay = ?, transactions_detail = ? WHERE payment_id = ?',
        [method_of_pay, transactions_detail, id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update payment' });
            } else if (this.changes > 0) {
                res.json({ message: 'Payment updated successfully' });
            } else {
                res.status(404).json({ error: 'Payment not found' });
            }
        }
    );
});

// Delete a payment record
app.delete('/api/payments/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM PAYMENT WHERE payment_id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to delete payment record' });
        } else if (this.changes > 0) {
            res.json({ message: 'Payment record deleted successfully' });
        } else {
            res.status(404).json({ error: 'Payment record not found' });
        }
    });
});

// Close the database connection when the server is stopped
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection');
        process.exit(0);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});