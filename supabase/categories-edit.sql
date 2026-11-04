-- 6. CATEGORIES SEED (AMAN)
insert into categories (id, name, icon, ramp, type, sort_order) values
  -- Pemasukan
  ('gaji','Gaji','ti-cash','green','inc',1),
  ('freelance','Side Hustle','ti-briefcase','green','inc',2),
  ('uangjajan','Uang Jajan','ti-gift-card','green','inc',3),
  ('investasi','Investasi','ti-chart-line','green','inc',4),

  -- Pengeluaran: makan
  ('makan','Makan','ti-basket','coral','exp',10),
  ('jajan','Jajan','ti-coffee','coral','exp',11),
  ('bahanmakanan','Belanja Dapur','ti-shopping-cart','coral','exp',12),

  -- Pengeluaran: jalan & tempat tinggal
  ('ojol','Transportasi','ti-moped','amber','exp',13),
  ('bensin','Bensin & Parkir','ti-gas-station','amber','exp',14),
  ('kos','Kos & Sewa','ti-home','pink','exp',15),
  ('tagihan','Listrik & Air','ti-bolt','amber','exp',16),
  ('internet','Paket Data & WiFi','ti-wifi','amber','exp',17),

  -- Pengeluaran: gaya hidup
  ('langganan','Langganan Apps','ti-device-tv','purple','exp',18),
  ('cicilan','Cicilan','ti-credit-card','amber','exp',19),
  ('nongkrong','Nongkrong','ti-glass-cocktail','purple','exp',20),
  ('fashion','Outfit','ti-hanger','pink','exp',21),
  ('skincare','Skincare & Self Care','ti-flower','teal','exp',22),
  ('selfreward','Self Reward','ti-heart','pink','exp',23),
  ('healing','Healing','ti-beach','blue','exp',24),
  ('hewan','Peliharaan','ti-dog','amber','exp',25),
  ('orangtua','Kirim ke Ortu','ti-heart-handshake','blue','exp',26),

  -- Baru
  ('gaming','Game & Top Up','ti-device-gamepad-2','purple','exp',27),
  ('kuliah','Kuliah & Kursus','ti-school','blue','exp',28),
  ('kesehatan','Kesehatan','ti-pill','teal','exp',29),

  -- Dua arah
  ('hadiah','Kado & Traktiran','ti-gift','purple','both',30),
  ('lainnya','Lainnya','ti-dots','pink','both',999)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  ramp = excluded.ramp,
  type = excluded.type,
  sort_order = excluded.sort_order;