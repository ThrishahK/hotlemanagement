create database a
use a

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