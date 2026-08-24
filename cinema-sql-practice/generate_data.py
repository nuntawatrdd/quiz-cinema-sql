import random

def generate_cinema_data():
    cinemas = [
        (1, 'BigCinema Central', '1 Ratchadamri Rd', 'Bangkok'),
        (2, 'BigCinema Ekkamai', '2 Sukhumvit Rd', 'Bangkok'),
        (3, 'BigCinema Chiang Mai', '3 Nimman Rd', 'Chiang Mai'),
        (4, 'BigCinema Phuket', '4 Beach Rd', 'Phuket'),
        (5, 'BigCinema Pattaya', '5 Beach Rd', 'Chonburi'),
        (6, 'BigCinema HatYai', '6 Nipphut Rd', 'Songkhla'),
        (7, 'BigCinema Khon Kaen', '7 Mittraphap Rd', 'Khon Kaen'),
        (8, 'BigCinema NakhonRatchasima', '8 Kasem Rd', 'Nakhon Ratchasima'),
    ]
    return cinemas

def generate_screen_data():
    screens = []
    sid = 1
    for cid in range(1, 9):
        for j in range(1, 5):
            screens.append((sid, cid, f'Screen {j}', random.randint(100, 300)))
            sid += 1
    return screens

def generate_seat_data():
    seats = []
    sid = 1
    types = ['VIP', 'Standard', 'Standard', 'Standard']
    statuses = ['Available', 'Available', 'Available', 'Available', 'Broken', 'Reserved']
    for scr in range(1, 33):
        for row in ['A', 'B', 'C', 'D', 'E']:
            for sno in range(1, 11):
                seats.append((sid, scr, row, sno, random.choice(types), random.choice(statuses)))
                sid += 1
    return seats

def generate_movie_data():
    return [
        (1, 'Space Warriors', '2025-01-10'),
        (2, 'Love in Bangkok', '2025-03-15'),
        (3, 'Thai Comedy King', '2025-05-20'),
        (4, 'Mystery Island', '2025-07-01'),
        (5, 'Dragon Legend', '2025-09-10'),
        (6, 'Summer Love', '2025-06-15'),
        (7, 'Detective Story', '2025-04-20'),
        (8, 'Animation World', '2025-08-05'),
    ]

def generate_genre_data():
    return [
        (1, 'Action'), (2, 'Romance'), (3, 'Comedy'), (4, 'Sci-Fi'),
        (5, 'Thriller'), (6, 'Animation'), (7, 'Drama'), (8, 'Horror')
    ]

def generate_movie_genre_data():
    return [
        (1, 1), (1, 4), (2, 2), (3, 3), (4, 5), (4, 8),
        (5, 1), (5, 7), (6, 2), (6, 6), (7, 5), (7, 7), (8, 6), (8, 3)
    ]

def generate_actor_data():
    return [
        (1, 'Tony Stark'), (2, 'Natasha Romanoff'), (3, 'Mike Myers'),
        (4, 'Chris Evans'), (5, 'Scarlett Johansson'), (6, 'Robert Downey Jr'),
        (7, 'Chris Hemsworth'), (8, 'Mark Ruffalo')
    ]

def generate_movie_actor_data():
    return [
        (1, 1), (1, 2), (2, 2), (3, 3), (4, 4), (4, 5),
        (5, 6), (5, 7), (6, 8), (6, 1), (7, 2), (7, 4), (8, 3), (8, 8)
    ]

def generate_showtime_data():
    times = [
        (1, 1, 1, '2025-08-01 10:00', '2025-08-01 12:30'),
        (2, 1, 2, '2025-08-01 14:00', '2025-08-01 16:30'),
        (3, 2, 5, '2025-08-02 11:00', '2025-08-02 13:00'),
        (4, 3, 9, '2025-08-02 15:00', '2025-08-02 17:00'),
        (5, 4, 13, '2025-08-03 10:00', '2025-08-03 12:00'),
        (6, 5, 17, '2025-08-03 14:00', '2025-08-03 16:30'),
        (7, 6, 21, '2025-08-04 11:00', '2025-08-04 13:00'),
        (8, 7, 25, '2025-08-04 15:00', '2025-08-04 17:30'),
        (9, 8, 29, '2025-08-05 10:00', '2025-08-05 12:00'),
        (10, 1, 1, '2025-08-05 14:00', '2025-08-05 16:30'),
        (11, 2, 5, '2025-08-06 11:00', '2025-08-06 13:00'),
        (12, 3, 9, '2025-08-06 15:00', '2025-08-06 17:00'),
    ]
    return times

def generate_booking_data():
    methods = ['Credit Card', 'PromptPay', 'Cash', 'QR Code']
    statuses = ['PAID', 'PAID', 'PAID', 'CANCELLED', 'PENDING']
    bookings = []
    for i in range(1, 26):
        bookings.append((i, ((i - 1) % 12) + 1, f'2025-07-{((i - 1) % 28 + 1):02d} 10:00', random.choice(methods), random.choice(statuses), random.randint(500, 3000)))
    return bookings

def generate_ticket_data():
    tickets = []
    tid = 1
    for b in range(1, 26):
        for s in range(1, 5):
            tickets.append((tid, b, s, random.choice([300, 400, 500, 600])))
            tid += 1
    return tickets

def generate_crew_data():
    return [
        (1, 1, 'สมชาย ใจดี', 25000, '2020-01-15', None),
        (2, 1, 'สมหญิง รักเรียน', 28000, '2019-06-01', None),
        (3, 2, 'ประเสริฐ เก่งกาจ', 35000, '2018-03-10', None),
        (4, 2, 'วิไล ค้าขาย', 30000, '2021-09-05', None),
        (5, 3, 'ธนกร ดีใจ', 27000, '2020-05-20', None),
        (6, 3, 'สุภาพร รักเรียน', 32000, '2019-08-15', None),
        (7, 4, 'อนุชา มีชัย', 29000, '2021-01-10', None),
        (8, 4, 'พิมพ์ใจ น่ารัก', 31000, '2020-11-05', None),
        (9, 5, 'กิตติพงศ์ เก่งกาจ', 33000, '2018-07-20', None),
        (10, 5, 'ชลธิชา ดีใจ', 26000, '2021-04-15', None),
        (11, 6, 'วราวุฒิ มีชัย', 34000, '2019-02-10', None),
        (12, 6, 'ธนากร น่ารัก', 28000, '2020-09-05', None),
        (13, 7, 'ปิยะนุช รักเรียน', 30000, '2018-12-01', None),
        (14, 7, 'ธนธัช ดีใจ', 32000, '2021-06-15', None),
        (15, 8, 'นภัสสร เก่งกาจ', 27000, '2020-03-20', None),
        (16, 8, 'กิตติชัย มีชัย', 31000, '2019-10-10', None),
    ]

def generate_employee_data():
    positions = ['Cashier', 'Usher', 'Ticketing', 'Cleaner', 'Manager Assistant']
    shifts = ['Morning', 'Evening', 'Night']
    employees = []
    for i in range(1, 17):
        employees.append((i, random.choice(positions), random.choice(shifts)))
    return employees

def generate_manager_data():
    departments = ['Operations', 'Marketing', 'Finance', 'HR']
    return [
        (3, 'Operations', 5000),
        (6, 'Marketing', 6000),
        (9, 'Finance', 7000),
        (11, 'HR', 5500),
        (14, 'Operations', 6500),
        (16, 'Marketing', 6000),
    ]

# Print all INSERT statements
print("-- CINEMA")
for c in generate_cinema_data():
    print(f"INSERT INTO cinema VALUES {c};")

print("\n-- SCREEN")
for s in generate_screen_data():
    print(f"INSERT INTO screen VALUES {s};")

print("\n-- MOVIE")
for m in generate_movie_data():
    print(f"INSERT INTO movie VALUES {m};")

print("\n-- GENRE")
for g in generate_genre_data():
    print(f"INSERT INTO genre VALUES {g};")

print("\n-- MOVIE_GENRE")
for mg in generate_movie_genre_data():
    print(f"INSERT INTO movie_genre VALUES {mg};")

print("\n-- ACTOR")
for a in generate_actor_data():
    print(f"INSERT INTO actor VALUES {a};")

print("\n-- MOVIE_ACTOR")
for ma in generate_movie_actor_data():
    print(f"INSERT INTO movie_actor VALUES {ma};")

print("\n-- SHOWTIME")
for s in generate_showtime_data():
    print(f"INSERT INTO showtime VALUES {s};")

print("\n-- BOOKING")
for b in generate_booking_data():
    print(f"INSERT INTO booking VALUES {b};")

print("\n-- TICKET")
for t in generate_ticket_data():
    print(f"INSERT INTO ticket VALUES {t};")

print("\n-- CREW")
for c in generate_crew_data():
    val = c[:-1] + ('NULL' if c[-1] is None else c[-1])
    print(f"INSERT INTO crew VALUES {val};")

print("\n-- EMPLOYEE")
for e in generate_employee_data():
    print(f"INSERT INTO employee VALUES {e};")

print("\n-- MANAGER")
for m in generate_manager_data():
    print(f"INSERT INTO manager VALUES {m};")

print("\n-- SEAT (ตัวอย่างบางส่วน)")
seats = generate_seat_data()
for s in seats[:50]:
    print(f"INSERT INTO seat VALUES {s};")
