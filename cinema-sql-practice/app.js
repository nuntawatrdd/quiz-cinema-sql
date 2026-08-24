// ==================== CONFIGURATION ====================
const MOTIVATIONS = [
    "เก่งมากกก", "ทำด้ายยยย", "อย่าลืมน้ำำ", "นั่่งหลงงตรง ฤ ป่าววว",
    "กอด ๆๆ", "ไม่ง่ายทำดึ้ยยย", "สู้วว ๆ", "เก่งทีสุดด", "สิบนิ้วป้วง", "มห้ล纪委书记"
];

const TABLE_NAMES = [
    'cinema', 'screen', 'seat', 'movie', 'genre', 'movie_genre',
    'actor', 'movie_actor', 'showtime', 'booking', 'ticket',
    'crew', 'employee', 'manager'
];

// ==================== STATE ====================
let db = null;
let currentIndex = 0;
let userResults = {};
let timerInterval = null;
let seconds = 0;

// ==================== QUESTIONS DATA (35 Questions) ====================
// ระดับปกติ (12 ข้อ): SELECT, WHERE, Basic Filter
// ระดับกลาง (18 ข้อ): Aggregate, GROUP BY, HAVING, Basic JOIN
// ระดับยาก (5 ข้อ): Multi-Table JOIN, Subquery, Complex Logic

const QUESTIONS = [
    // --- LEVEL 1: NORMAL (12 Questions) ---
    {
        id: 1,
        title: "Q1 - SELECT columns from crew",
        desc: "จงแสดง crew_id, name และ salary ของพนักงานทุกคน",
        example: `crew_id | name        | salary
------ | ------------ | ------
1      | John_Smith  | 25000.00`,
        answer: "SELECT crew_id, name, salary FROM crew;",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 10
    },
    {
        id: 2,
        title: "Q2 - WHERE Condition",
        desc: "จงแสดง cinema_id, name และ address ของโรงภาพยนตร์ท่ีอยู่ในรัฐ 'Bangkok'",
        example: `cinema_id | name                | address
--------- | ------------------- | -----------
1         | BigCinema_Central   | 1_Ratchadamri_Rd`,
        answer: "SELECT cinema_id, name, address FROM cinema WHERE state_region = 'Bangkok';",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 2
    },
    {
        id: 3,
        title: "Q3 - WHERE Date",
        desc: "จงแสดง movie_id, title และ release_date ของหนังท่ีฉายหลังจากปี 2024 (2025 เป็นต้นไป)",
        example: `movie_id | title            | release_date
-------- | ---------------- | ------------
1        | Space_Warriors   | 2025-01-10`,
        answer: "SELECT movie_id, title, release_date FROM movie WHERE release_date > '2024-12-31';",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 3
    },
    {
        id: 4,
        title: "Q4 - Count Data",
        desc: "จงนับจำนวนหนังทังหมดในฐานข้อมูล (ใช้ column name ว่า total_movies)",
        example: `total_movies
------------
4`,
        answer: "SELECT COUNT(*) AS total_movies FROM movie;",
        validate: (res) => res[0].columns.length === 1 && res[0].values[0][0] === 4
    },
    {
        id: 5,
        title: "Q5 - WHERE String Match",
        desc: "จงแสดง seat_id, row_label และ seat_no ของที่นั่งท่ีเสียหาย (Status เป็น 'Broken')",
        example: `seat_id | row_label | seat_no
------- | --------- | -------
3       | B         | 1`,
        answer: "SELECT seat_id, row_label, seat_no FROM seat WHERE status = 'Broken';",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 3
    },
    {
        id: 6,
        title: "Q6 - Salary Filter",
        desc: "จงแสดงชื่อและ email ของพนักงานท่ีมีเงินเดือนมากกว่า 30,000",
        example: `name         | email
----------- | ----------
Mike_Rose  | MIKE_ROSE`,
        answer: "SELECT name, email FROM crew WHERE salary > 30000;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 3
    },
    {
        id: 7,
        title: "Q7 - LIKE Pattern",
        desc: "จงแสดงชื่อหนังท่ีมีคำท่ีขึ้นต้นด้วย 'Space'",
        example: `title
-----------
Space_Warriors`,
        answer: "SELECT title FROM movie WHERE title LIKE 'Space%';",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 1
    },
    {
        id: 8,
        title: "Q8 - Distinct Values",
        desc: "จงแสดงสถานะ (status) ของที่นั่งท่ีไม่ซ้ำกัน",
        example: `status
--------
Available`,
        answer: "SELECT DISTINCT status FROM seat;",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 3
    },
    {
        id: 9,
        title: "Q9 - Order By",
        desc: "จงแสดงชื่อพนักงานเรียงตามชื่อจาก A-Z",
        example: `name
-----------
Chris_Evans`,
        answer: "SELECT name FROM crew ORDER BY name ASC;",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 10
    },
    {
        id: 10,
        title: "Q10 - Aggregation",
        desc: "จงหาค่าเงินเดือนเฉลี่ย (Average) ของพนักงาน (column name: avg_salary)",
        example: `avg_salary
----------
29600.00`,
        answer: "SELECT AVG(salary) AS avg_salary FROM crew;",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 1
    },
    {
        id: 11,
        title: "Q11 - Payment Method",
        desc: "จงแสดง booking_id และ payment_method ของการสำรองที่นั่งท่ีชำระเงินผ่าน 'Credit_Card'",
        example: `booking_id | payment_method
---------- | --------------
1          | Credit_Card`,
        answer: "SELECT booking_id, payment_method FROM booking WHERE payment_method = 'Credit_Card';",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 1
    },
    {
        id: 12,
        title: "Q12 - Limit",
        desc: "จงแสดงรายละเอียดพนักงาน 3 คนแรก",
        example: `crew_id | name
------ | -----------
1      | John_Smith`,
        answer: "SELECT * FROM crew LIMIT 3;",
        validate: (res) => res[0].columns.length === 7 && res[0].values.length === 3
    },

    // --- LEVEL 2: MEDIUM / COMPLEX (18 Questions) ---
    {
        id: 13,
        title: "Q13 - Join (Movie & Genre)",
        desc: "จงแสดงชื่อหนัง (title) และชื่อนีหนัง (genre name) โดยใช้ JOIN",
        example: `title            | name
---------------- | -------
Space_Warriors   | Action`,
        answer: "SELECT m.title, g.name FROM movie m JOIN movie_genre mg ON m.movie_id = mg.movie_id JOIN genre g ON mg.genre_id = g.genre_id;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length >= 4
    },
    {
        id: 14,
        title: "Q14 - Group By",
        desc: "จงนับจำนวนที่นั่ง (total_seats) มีวอยู่ในแต่ละสครีน (screen_id, name, total_seats) เรียงลำดับ screen_id",
        example: `screen_id | name     | total_seats
--------- | -------- | -----------
1         | Screen_1 | 200`,
        answer: "SELECT s.screen_id, s.name, COUNT(st.seat_id) AS total_seats FROM screen s JOIN seat st ON s.screen_id = st.screen_id GROUP BY s.screen_id, s.name ORDER BY s.screen_id;",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 4
    },
    {
        id: 15,
        title: "Q15 - Subquery",
        desc: "จงแสดงชื่อพนักงานท่ีมีเงินเดือนมากกว่าเงินเดือนเฉลี่ยของบริษัท",
        example: `name
-----------
Mike_Rose`,
        answer: "SELECT name FROM crew WHERE salary > (SELECT AVG(salary) FROM crew);",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length >= 1
    },
    {
        id: 16,
        title: "Q16 - Between",
        desc: "จงแสดงชื่อหนังท่ีฉายระหว่างปี 2025 ถึง 2026 (รวม)",
        example: `title
-----------
Space_Warriors`,
        answer: "SELECT title FROM movie WHERE release_date BETWEEN '2025-01-01' AND '2026-12-31';",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 3
    },
    {
        id: 17,
        title: "Q17 - Join (Employee)",
        desc: "จงแสดงชื่อพนักงาน (name), ตำแหน่ง (position) และกะงาน (shift_type)",
        example: `name         | position           | shift_type
----------- | ------------------ | ----------
John_Smith | Cashier            | Morning`,
        answer: "SELECT c.name, e.position, e.shift_type FROM crew c JOIN employee e ON c.crew_id = e.crew_id;",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 10
    },
    {
        id: 18,
        title: "Q18 - Sum Revenue",
        desc: "จงหาจำนวนเงินทังหมด (total_revenue) จากการจองทังหมด",
        example: `total_revenue
-------------
2300.00`,
        answer: "SELECT SUM(total_amount) AS total_revenue FROM booking;",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 1
    },
    {
        id: 19,
        title: "Q19 - Group By Having",
        desc: "จงนับจำนวนที่นั่งกนิส่าสินค้าแต่ละ Status โดยแสดงเฉพาะท่ีมจำนวนมากกว่า 1 ตัว (column: status, count_seats)",
        example: `status      | count_seats
---------- | -----------
Available | 5`,
        answer: "SELECT status, COUNT(*) AS count_seats FROM seat GROUP BY status HAVING COUNT(*) > 1;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 3
    },
    {
        id: 20,
        title: "Q20 - IN Clause",
        desc: "จงแสดงชื่อหนังท่ีมแนว 'Action' หรือ 'Comedy'",
        example: `title
-----------
Space_Warriors`,
        answer: "SELECT m.title FROM movie m JOIN movie_genre mg ON m.movie_id = mg.movie_id JOIN genre g ON mg.genre_id = g.genre_id WHERE g.name IN ('Action', 'Comedy');",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 2
    },
    {
        id: 21,
        title: "Q21 - Min/Max",
        desc: "จงหาค่า minimum และ maximum ของเงินเดือน (column name: min_sal, max_sal)",
        example: `min_sal  | max_sal
------- | -------
25000.0| 35000.0`,
        answer: "SELECT MIN(salary) AS min_sal, MAX(salary) AS max_sal FROM crew;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 1
    },
    {
        id: 22,
        title: "Q22 - Join (Showtime)",
        desc: "จงแสดงชื่อหนัง (title) และเวลาเริ่มฉาย (start_time) ของรอบฉายทังหมด",
        example: `title            | start_time
---------------- | ----------------
Space_Warriors   | 2025-08-01_10:00`,
        answer: "SELECT m.title, s.start_time FROM movie m JOIN showtime s ON m.movie_id = s.movie_id;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 3
    },
    {
        id: 23,
        title: "Q23 - Multi-Join",
        desc: "จงแสดงชื่อโรงหนัง (cinema name), ชื่อสครีน (screen name) และ จำนวนที่นั่งรวม (total_seats)",
        example: `name                | name     | total_seats
------------------- | -------- | -----------
BigCinema_Central | Screen_1 | 200`,
        answer: "SELECT c.name AS cinema_name, sc.name AS screen_name, sc.total_seats FROM cinema c JOIN screen sc ON c.cinema_id = sc.cinema_id;",
        validate: (res) => res[0].columns.length === 3 && res[0].values.length === 4
    },
    {
        id: 24,
        title: "Q24 - Having Salary",
        desc: "จงนับจำนวนพนักงานท่ีทำงานในแต่ละโรงหนัง (column: cinema_id, total_staff) แสดงเฉพาะท่ีมีพนักงาน 5 คนหรือมากกว่า",
        example: `cinema_id | total_staff
--------- | -----------
1         | 5`,
        answer: "SELECT cinema_id, COUNT(*) AS total_staff FROM crew GROUP BY cinema_id HAVING COUNT(*) >= 5;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 2
    },
    {
        id: 25,
        title: "Q25 - Date Functions",
        desc: "จงแสดงปี (year) และจำนวนหนังท่ีฉายในปีนัน (column: yr, count) เรียงลำดับปี",
        example: `yr    | count
----- | -----
2024 | 1`,
        answer: "SELECT SUBSTR(release_date, 1, 4) AS yr, COUNT(*) AS count FROM movie GROUP BY yr ORDER BY yr;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 2
    },
    {
        id: 26,
        title: "Q26 - Ticket Calculation",
        desc: "จงแสดง booking_id และ total_priceจากการคูณ (ticket price * จำนวนตั๋ว) ของการนมานนันๆ",
        example: `booking_id | total_price
---------- | -----------
1          | 1000.00`,
        answer: "SELECT booking_id, SUM(unit_price) AS total_price FROM ticket GROUP BY booking_id;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 2
    },
    {
        id: 27,
        title: "Q27 - Not Like",
        desc: "จงแสดงชื่อหนังท่ีไมได้มีคำว่า 'Love' ในชื่อ",
        example: `title
-----------
Space_Warriors`,
        answer: "SELECT title FROM movie WHERE title NOT LIKE '%Love%';",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 3
    },
    {
        id: 28,
        title: "Q28 - Left Join",
        desc: "จงแสดงชื่อพนักงานทุกคน และตำแหน่ง(อาจเปน Null ได้)",
        example: `name          | position
------------ | ----------
John_Smith  | Cashier`,
        answer: "SELECT c.name, e.position FROM crew c LEFT JOIN employee e ON c.crew_id = e.crew_id;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 10
    },
    {
        id: 29,
        title: "Q29 - In/Subquery",
        desc: "จงแสดงชื่อพนักงานท่ีทำงานในตำแหน่ง 'Cashier' หรือ 'Manager_Assistant'",
        example: `name
-----------
John_Smith`,
        answer: "SELECT c.name FROM crew c JOIN employee e ON c.crew_id = e.crew_id WHERE e.position IN ('Cashier', 'Manager_Assistant');",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 4
    },
    {
        id: 30,
        title: "Q30 - Concat",
        desc: "จงสร้าง column name_fullformat ท่ีนำ name & space & email มาต่อกัน",
        example: `name_fullformat
----------------
John_Smith JOHN_SMIT`,
        answer: "SELECT name || ' ' || email AS name_fullformat FROM crew;",
        validate: (res) => res[0].columns.length === 1 && res[0].values.length === 10
    },

    // --- LEVEL 3: HARD (5 Questions) ---
    {
        id: 31,
        title: "Q31 - Movie Revenue (Multi Join)",
        desc: "จงหาชื่อหนัง (title) และรายได้รวม (total_revenue) โดย JOIN Movie -> Showtime -> Booking แสดงเฉพาะท่ีมรายได",
        example: `title            | total_revenue
---------------- | -------------
Space_Warriors   | 2300.00`,
        answer: "SELECT m.title, SUM(b.total_amount) AS total_revenue FROM movie m JOIN showtime s ON m.movie_id = s.movie_id JOIN booking b ON s.showtime_id = b.showtime_id GROUP BY m.title;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 2
    },
    {
        id: 32,
        title: "Q32 - Cinema Employee Detail",
        desc: "จงแสดงชื่อโรงหนัง, ชื่่อพนักงาน, เงินเดือน และ ตำแหน่ง โดยต้องแสดงเฉพาะพนักงานท่ีมเงินเดือน 30,000 ขึ้นไป และทำงานที่ Bangkok",
        example: `name                | name      | salary | position
------------------- | --------- | ------ | ---------
BigCinema_Central | Mike_Rose | 35000.0| Manager_Assistant`,
        answer: "SELECT ci.name, c.name, c.salary, e.position FROM cinema ci JOIN crew c ON ci.cinema_id = c.cinema_id JOIN employee e ON c.crew_id = e.crew_id WHERE c.salary >= 30000 AND ci.state_region = 'Bangkok';",
        validate: (res) => res[0].columns.length === 4 && res[0].values.length >= 1
    },
    {
        id: 33,
        title: "Q33 - Most Booked Screen",
        desc: "จงหาชื่อสครีน (name) ท่ีมีการจองตั๋ว (count ของ ticket) มากที่สุด",
        example: `name
--------
Screen_1`,
        answer: "SELECT sc.name, COUNT(t.ticket_id) AS cnt FROM screen sc JOIN showtime s ON sc.screen_id = s.screen_id JOIN booking b ON s.showtime_id = b.showtime_id JOIN ticket t ON b.booking_id = t.booking_id GROUP BY sc.name ORDER BY cnt DESC LIMIT 1;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 1
    },
    {
        id: 34,
        title: "Q34 - Genre Stats",
        desc: "จงแสดงชื่แนวหนัง (genre name) และ จำนวนหนังในแนวนัน (movie_count) เรียงจากมากไปน้อย",
        example: `name      | movie_count
-------- | -----------
Action   | 1`,
        answer: "SELECT g.name, COUNT(mg.movie_id) AS movie_count FROM genre g JOIN movie_genre mg ON g.genre_id = mg.genre_id GROUP BY g.name ORDER BY movie_count DESC;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length === 3
    },
    {
        id: 35,
        title: "Q35 - Actor Filmography",
        desc: "จงแสดงชื่อผู้แสดง (actor name) และ ชื่่อหนังท่ีเขานแสดง (title) มาพร้อมกัน",
        example: `full_name        | title
-------------- | -----------
Tony_Stark     | Space_Warriors`,
        answer: "SELECT a.full_name, m.title FROM actor a JOIN movie_actor ma ON a.actor_id = ma.actor_id JOIN movie m ON ma.movie_id = m.movie_id;",
        validate: (res) => res[0].columns.length === 2 && res[0].values.length >= 1
    }
];

// ==================== DATABASE LOGIC ====================

function createSchema() {
    db.run(`
        CREATE TABLE cinema (cinema_id INT PRIMARY KEY, name TEXT, address TEXT, state_region TEXT);
        CREATE TABLE screen (screen_id INT PRIMARY KEY, cinema_id INT, name TEXT, total_seats INT);
        CREATE TABLE seat (seat_id INT PRIMARY KEY, screen_id INT, row_label TEXT, seat_no INT, seat_type TEXT, status TEXT);
        CREATE TABLE movie (movie_id INT PRIMARY KEY, title TEXT, release_date TEXT);
        CREATE TABLE genre (genre_id INT PRIMARY KEY, name TEXT);
        CREATE TABLE movie_genre (movie_id INT, genre_id INT);
        CREATE TABLE actor (actor_id INT PRIMARY KEY, full_name TEXT);
        CREATE TABLE movie_actor (movie_id INT, actor_id INT);
        CREATE TABLE showtime (showtime_id INT PRIMARY KEY, movie_id INT, screen_id INT, start_time TEXT, end_time TEXT);
        CREATE TABLE booking (booking_id INT PRIMARY KEY, showtime_id INT, purchase_date TEXT, payment_method TEXT, transaction_status TEXT, total_amount REAL);
        CREATE TABLE ticket (ticket_id INT PRIMARY KEY, booking_id INT, seat_id INT, unit_price REAL);
        CREATE TABLE crew (crew_id INT PRIMARY KEY, cinema_id INT, name TEXT, salary REAL, start_date TEXT, end_date TEXT, email TEXT);
        CREATE TABLE employee (crew_id INT PRIMARY KEY, position TEXT, shift_type TEXT);
        CREATE TABLE manager (crew_id INT PRIMARY KEY, department TEXT, bonus REAL);
    `);
}

function insertMockData() {
    // Cinema (Bangkok 2, ChiangMai 1, Phuket 1)
    db.run(`INSERT INTO cinema VALUES (1,'BigCinema_Central','1_Ratchadamri_Rd','Bangkok'),
    (2,'BigCinema_Ekkamai','2_Sukhumvit_Rd','Bangkok'),
    (3,'BigCinema_ChiangMai','3_Nimman_Rd','ChiangMai'),
    (4,'BigCinema_Phet','4_Beach_Rd','Phuket');`);

    // Screen (4 screens)
    db.run(`INSERT INTO screen VALUES (1,1,'Screen_1',200), (2,1,'Screen_2',150), (3,2,'Screen_3',180), (4,2,'Screen_4',120);`);

    // Seat (Breaken seats: 3, 6, 10)
    db.run(`INSERT INTO seat VALUES (1,1,'A',1,'VIP','Available'), (2,1,'A',2,'Standard','Available'),
    (3,1,'B',1,'Standard','Broken'), (4,1,'B',2,'VIP','Available'),
    (5,2,'A',1,'Standard','Available'), (6,2,'A',2,'Standard','Broken'),
    (7,3,'A',1,'VIP','Available'), (8,3,'A',2,'Standard','Available'),
    (9,4,'A',1,'Standard','Reserved'), (10,4,'A',2,'Standard','Broken');`);

    // Movie (2025: 3, 2024: 1)
    db.run(`INSERT INTO movie VALUES (1,'Space_Warriors','2025-01-10'), (2,'Love_in_Bangkok','2025-03-15'), (3,'Thai_Comedy_King','2025-05-20'), (4,'Mystery_Island','2024-07-01');`);

    // Genre
    db.run(`INSERT INTO genre VALUES (1,'Action'), (2,'Romance'), (3,'Comedy'), (4,'Sci-Fi');`);

    // Movie_Genre (Space=Action,SciFi; Love=Romance; Thai=Comedy)
    db.run(`INSERT INTO movie_genre VALUES (1,1), (1,4), (2,2), (3,3);`);

    // Actor
    db.run(`INSERT INTO actor VALUES (1,'Tony_Stark'), (2,'Natasha_Romanoff'), (3,'Mike_Myers');`);

    // Movie_Actor (Space=Tony,Natasha; Love=Natasha; Thai=Mike)
    db.run(`INSERT INTO movie_actor VALUES (1,1), (1,2), (2,2), (3,3);`);

    // Showtime
    db.run(`INSERT INTO showtime VALUES (1,1,1,'2025-08-01_10:00','2025-08-01_12:30'), (2,1,2,'2025-08-01_14:00','2025-08-01_16:30'), (3,2,3,'2025-08-02_11:00','2025-08-02_13:00');`);

    // Booking
    db.run(`INSERT INTO booking VALUES (1,1,'2025-07-30_10:00','Credit_Card','PAID',1500.00), (2,2,'2025-07-30_11:00','PromptPay','PAID',800.00), (3,3,'2025-07-31_09:00','Cash','CANCELLED',0.00);`);

    // Ticket (Booking 1: Seat 1,2; Booking 2: Seat 5,6)
    db.run(`INSERT INTO ticket VALUES (1,1,1,500.00), (2,1,2,500.00), (3,2,5,400.00), (4,2,6,400.00);`);

    // Crew (10 people)
    db.run(`INSERT INTO crew VALUES (1,1,'John_Smith',25000,'2020-01-15',NULL,'JOHN_SMIT'), (2,1,'Jane_Doe',28000,'2019-06-01',NULL,'JANE_DOE'),
    (3,2,'Mike_Rose',35000,'2018-03-10',NULL,'MIKE_ROSE'), (4,2,'Sarah_Conn',32000,'2021-09-05',NULL,'SARAH_CONN'),
    (5,3,'Chris_Evans',27000,'2020-05-20',NULL,'CHRIS_EVA'), (6,3,'Emma_Watson',31000,'2019-08-15',NULL,'EMMA_WAT'),
    (7,4,'Tom_Holland',29000,'2021-01-10',NULL,'TOM_HOLL'), (8,4,'Zendaya_Chow',33000,'2020-11-05',NULL,'ZENDAYA_CH'),
    (9,1,'Robert_Downey',26000,'2018-07-20',NULL,'ROBERT_DOW'), (10,1,'Scarlett_Joh',30000,'2021-04-15',NULL,'SCARLETT_JOH');`);

    // Employee (Mapping to Crew)
    db.run(`INSERT INTO employee VALUES (1,'Cashier','Morning'), (2,'Usher','Evening'), (3,'Manager_Assistant','Morning'),
    (4,'Ticketing','Morning'), (5,'Cleaner','Night'), (6,'Marketing','Morning'), (7,'Cashier','Evening'),
    (8,'Usher','Morning'), (9,'Manager_Assistant','Morning'), (10,'Ticketing','Evening');`);

    // Manager (Subset of Crew)
    db.run(`INSERT INTO manager VALUES (3,'Operations',5000), (6,'Marketing',6000), (7,'HR',5500);`);
}

// ==================== UI & EXECUTION LOGIC ====================

function renderTables() {
    const container = document.getElementById('tables-list');
    container.innerHTML = TABLE_NAMES.map(t => `<span class="table-chip" onclick="loadTable('${t}')">${t}</span>`).join('');
}

function loadTable(tableName) {
    document.getElementById('sql-input').value = `SELECT * FROM ${tableName};`;
    executeQuery();
}

function renderQuestions() {
    const list = document.getElementById('q-list');
    const completedCount = Object.values(userResults).filter(v => v === true).length;

    list.innerHTML = QUESTIONS.map((q, i) => {
        const status = userResults[q.id] === true ? 'completed' : (userResults[q.id] === false ? 'attempted' : 'pending');
        const activeClass = i === currentIndex ? 'active' : '';
        return `
            <div class="q-item ${activeClass}" onclick="loadQuestion(${i})" id="q-item-${i}">
                <span class="q-dot ${status}" id="q-dot-${i}"></span>
                <span class="q-text">Q${i + 1}</span>
                <span class="q-pts">1</span>
            </div>
        `;
    }).join('');

    const total = QUESTIONS.length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    document.getElementById('score-val').textContent = `${completedCount} / ${total}`;
    document.getElementById('progress').textContent = `${pct}%`;
}

function loadQuestion(index) {
    currentIndex = index;
    const q = QUESTIONS[index];

    renderQuestions();

    document.getElementById('q-title').textContent = q.title;
    document.getElementById('q-desc').innerHTML = q.desc;
    document.getElementById('q-example').innerHTML = `<pre>${q.example}</pre>`;

    const msgEl = document.getElementById('result-msg');
    msgEl.textContent = '';
    msgEl.className = 'result-msg';
    document.getElementById('result-table').innerHTML = 'Results will be displayed here';

    const saved = localStorage.getItem(`sql_q_${q.id}`) || '';
    document.getElementById('sql-input').value = saved;
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `${m}:${s}`;
    }, 1000);
}

function renderResultTable(res) {
    const container = document.getElementById('result-table');
    if (!res.length) {
        container.innerHTML = '<div style="padding:10px; color:#4CAF50;">✅ Query Success (0 rows)</div>';
        return;
    }

    const cols = res[0].columns;
    const rows = res[0].values;

    let html = `<table><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
    rows.forEach(r => {
        html += `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function executeQuery() {
    const sql = document.getElementById('sql-input').value;
    const msgEl = document.getElementById('result-msg');
    msgEl.textContent = '';
    msgEl.className = 'result-msg';

    try {
        const res = db.exec(sql);
        renderResultTable(res);
        localStorage.setItem(`sql_q_${QUESTIONS[currentIndex].id}`, sql);
    } catch (e) {
        document.getElementById('result-table').innerHTML = `<div style="padding:10px; color:red;">❌ Error: ${e.message}</div>`;
    }
}

function judgeAnswer() {
    const sql = document.getElementById('sql-input').value;
    const q = QUESTIONS[currentIndex];
    const msgEl = document.getElementById('result-msg');

    try {
        const res = db.exec(sql);
        if (q.validate && q.validate(res)) {
            userResults[q.id] = true;
            const msg = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
            msgEl.textContent = `Correct! ${msg}`;
            msgEl.className = 'result-msg correct';
        } else {
            userResults[q.id] = false;
            msgEl.textContent = 'Incorrect';
            msgEl.className = 'result-msg incorrect';
        }
        renderQuestions();
    } catch (e) {
        userResults[q.id] = false;
        msgEl.textContent = `Incorrect (Syntax Error)`;
        msgEl.className = 'result-msg incorrect';
        renderQuestions();
    }
    localStorage.setItem(`sql_q_${q.id}`, sql);
}

function showAnswer() {
    const q = QUESTIONS[currentIndex];
    document.getElementById('sql-input').value = q.answer;
}

// ==================== INIT ====================
async function init() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    db = new SQL.Database();
    createSchema();
    insertMockData();

    renderTables();
    loadQuestion(0);
    startTimer();
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('btn-execute').addEventListener('click', executeQuery);
document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('sql-input').value = '';
    document.getElementById('result-msg').textContent = '';
    document.getElementById('result-table').innerHTML = 'Results will be displayed here';
});
document.getElementById('btn-judge').addEventListener('click', judgeAnswer);
document.getElementById('btn-answer').addEventListener('click', showAnswer);
document.getElementById('sql-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        executeQuery();
    }
});
