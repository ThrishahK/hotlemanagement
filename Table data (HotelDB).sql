  CREATE DATABASE HotelDB;
USE HotelDB;

CREATE TABLE Customer (
    cust_phone VARCHAR(15) PRIMARY KEY,
    cust_name VARCHAR(100) NOT NULL,
    cust_mail VARCHAR(100) UNIQUE
);
INSERT INTO Customer (cust_phone, cust_name, cust_mail)
VALUES 
('1234567890', 'John Doe', 'john@example.com'),
('0987654321', 'Alice Smith', 'alice@example.com'),
('1122334455', 'Bob Johnson', 'bob@example.com'),
('2233445566', 'Charlie Brown', 'charlie@example.com'),
('3344556677', 'David Miller', 'david@example.com'),
('4455667788', 'Emma Davis', 'emma@example.com'),
('5566778899', 'Frank Wilson', 'frank@example.com'),
('6677889900', 'Grace Thompson', 'grace@example.com'),
('7788990011', 'Henry Moore', 'henry@example.com'),
('8899001122', 'Isabella Clark', 'isabella@example.com'),
('9900112233', 'Jack White', 'jack@example.com');
select * from Customer


CREATE TABLE Hotel (
    hotel_id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_name VARCHAR(255) NOT NULL,
    hotel_ratings DECIMAL(2,1),
    city VARCHAR(100),
    area VARCHAR(100),
    state VARCHAR(100)
);
INSERT INTO Hotel (hotel_name, hotel_ratings, city, area, state)
VALUES 
('Grand Palace', 4.5, 'New York', 'Manhattan', 'NY'),
('Sea View Resort', 4.2, 'Los Angeles', 'Santa Monica', 'CA'),
('Mountain Inn', 4.8, 'Denver', 'Downtown', 'CO'),
('Urban Stay', 4.3, 'Chicago', 'Loop', 'IL'),
('Sunset Retreat', 4.6, 'San Francisco', 'Golden Gate', 'CA'),
('Royal Orchid', 4.7, 'Miami', 'South Beach', 'FL'),
('Lakeview Lodge', 4.1, 'Seattle', 'Downtown', 'WA'),
('Skyline Suites', 4.4, 'Dallas', 'Uptown', 'TX'),
('Emerald Bay Resort', 4.9, 'Honolulu', 'Waikiki', 'HI'),
('Hillside Haven', 4.0, 'Atlanta', 'Midtown', 'GA'),
('Luxury Stay', 4.5, 'Las Vegas', 'The Strip', 'NV');
select * from Hotel


CREATE TABLE Booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    cust_phone VARCHAR(15),
    hotel_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    FOREIGN KEY (cust_phone) REFERENCES Customer(cust_phone) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);
INSERT INTO Booking (cust_phone, hotel_id, check_in_date, check_out_date)
VALUES 
('1234567890', 1, '2025-04-01', '2025-04-05'),
('0987654321', 2, '2025-05-10', '2025-05-15'),
('1122334455', 3, '2025-06-20', '2025-06-25'),
('2233445566', 4, '2025-07-05', '2025-07-10'),
('3344556677', 5, '2025-08-12', '2025-08-17'),
('4455667788', 6, '2025-09-25', '2025-09-30'),
('5566778899', 7, '2025-10-14', '2025-10-19'),
('6677889900', 8, '2025-11-03', '2025-11-08'),
('7788990011', 9, '2025-12-22', '2025-12-27'),
('8899001122', 10, '2026-01-15', '2026-01-20'),
('9900112233', 11, '2026-02-28', '2026-03-04');
select * from Booking


CREATE TABLE DINING (
    dining_id INT PRIMARY KEY,
    dining_type VARCHAR(20),
    dining_time TIME,
    dnumber INT, 
    veg BOOLEAN,
    non_veg BOOLEAN 
);
INSERT INTO DINING VALUES(1, 'rooftop', '19:00:00', 1, TRUE, TRUE);
INSERT INTO DINING VALUES(2, 'cafe', '10:00:00', 2, TRUE, FALSE);
INSERT INTO DINING VALUES(3, 'bar&restaurant', '21:00:00', 3, FALSE, TRUE);
INSERT INTO DINING VALUES(4, 'buffet', '13:00:00', 4, TRUE, TRUE);
INSERT INTO DINING VALUES(5, 'beachside', '18:30:00', 5, TRUE, TRUE);
INSERT INTO DINING VALUES(6, 'rooftop', '20:30:00', 6, FALSE, TRUE);
INSERT INTO DINING VALUES(7, 'cafe', '09:30:00', 7, TRUE, FALSE);
INSERT INTO DINING VALUES(8, 'bar&restaurant', '22:00:00', 8, FALSE, TRUE);
INSERT INTO DINING VALUES(9, 'buffet', '12:30:00', 9, TRUE, TRUE);
INSERT INTO DINING VALUES(10, 'beachside', '19:30:00', 10, TRUE, TRUE);
INSERT INTO DINING VALUES(11, 'rooftop', '18:00:00', 11, TRUE, TRUE);
select * from DINING


create table TAKEAWAYS(
order_id int,
item_name text,
delivery_location text,
primary key(order_id));
INSERT INTO TAKEAWAYS VALUES(1, 'Spicy Szechuan Noodles', '10, MG Road');
INSERT INTO TAKEAWAYS VALUES(2, 'Crispy Honey Glazed Chicken', '22, Linking Road');
INSERT INTO TAKEAWAYS VALUES(3, 'Creamy Tomato Basil Soup', '3/45, Park Street');
INSERT INTO TAKEAWAYS VALUES(4, 'Grilled Salmon with Lemon Dill Sauce', '4, Anna Nagar');
INSERT INTO TAKEAWAYS VALUES(5, 'Wild Mushroom Risotto', '56, Sector 17');
INSERT INTO TAKEAWAYS VALUES(6, 'Mango Avocado Salad', '7, Banjara Hills');
INSERT INTO TAKEAWAYS VALUES(7, 'Chocolate Peanut Butter Brownies', '88, Civil Lines');
INSERT INTO TAKEAWAYS VALUES(8, 'Blueberry Pancakes', '9, Kaloor');
INSERT INTO TAKEAWAYS VALUES(9, 'Vegetable Pad Thai', '101, Koregaon Park');
INSERT INTO TAKEAWAYS VALUES(10, 'Strawberry Cheesecake', '11/12, Hazratganj');
INSERT INTO TAKEAWAYS VALUES(11, 'Rustic Rosemary Roasted Potatoes', '123, Jodhpur Park');
select * from TAKEAWAYS



create table PAYMENT(
payment_id int,
method_of_pay char(20),
transactions_detail text,
primary key(payment_id));
insert into PAYMENT values(1111,'Cash','Dining');
insert into PAYMENT values(1112,'Card','Room and Dining');
insert into PAYMENT values(1113,'Cash','Room');
insert into PAYMENT values(1114,'Online','Takeaway');
insert into PAYMENT values(1115,'Cash','Room and Takeaway');
insert into PAYMENT values(1116,'Online','Dining');
insert into PAYMENT values(1117,'Card','Dining and Takeaway');
insert into PAYMENT values(1118,'Cash','Dining ');
insert into PAYMENT values(1119,'Cash','Room and Dining');
insert into PAYMENT values(1120,'Online','Takeaway');
insert into PAYMENT values(1121,'Card','Room and Dining');
select * from PAYMENT



