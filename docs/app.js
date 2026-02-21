// === ITINERARY DATA ===

const DAYS = [
  {
    id: 'day-1',
    day: 1,
    date: 'Aug 11 (Tue)',
    title: 'Arrive Seoul + Afternoon Exploring',
    country: 'korea',
    summary: 'Cheonggyecheon Stream, DDP, Ikseon-dong',
    notes: 'Gyeongbokgung closed Tuesdays \u2014 no conflict. Half day: settled by noon, explore 12:30\u201320:00.',
    badges: [],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Tosokchon+Samgyetang+Seoul/Cheonggyecheon+Stream+Plaza+Seoul/Dongdaemun+Design+Plaza+Seoul/Ikseon-dong+Seoul' }
    ],
    schedule: [
      { time: '9:00', activity: 'Land at Incheon (ICN). Buy <strong>T-money card</strong> at convenience store, load ~50,000 KRW.', price: '' },
      { time: '9:30', activity: '<strong>Airport Express (AREX)</strong> to Seoul (~43 min direct / ~55 min all-stop).', price: '4,150\u201c9,500 KRW' },
      { time: '11:00', activity: 'Check in hotel, drop bags, freshen up.', price: '' },
      { time: '12:30', activity: 'Lunch: <strong><a href="https://www.google.com/maps/search/Tosokchon+Samgyetang+Seoul" target="_blank">Tosokchon Samgyetang</a></strong> \u2014 Famous ginseng chicken soup. Restorative after a long flight. Always a queue but moves fast.', price: '~16,000 KRW' },
      { time: '14:00', activity: '<strong><a href="https://www.google.com/maps/search/Cheonggyecheon+Stream+Seoul" target="_blank">Cheonggyecheon Stream</a></strong> \u2014 10.9km restored urban stream. Shaded, a few degrees cooler. Start at Cheonggye Plaza waterfall.', price: 'Free' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Dongdaemun+Design+Plaza+Seoul" target="_blank">Dongdaemun Design Plaza (DDP)</a></strong> \u2014 Zaha Hadid\u2019s silver spaceship. LED Rose Garden (4,000+ roses). Kids love the architecture.', price: 'Free' },
      { time: '16:00', activity: 'Browse <strong>Dongdaemun</strong> area \u2014 Doota Mall, Hyundai City Outlet, street markets.', price: '' },
      { time: '17:00', activity: 'Walk to <strong><a href="https://www.google.com/maps/search/Ikseon-dong+Seoul" target="_blank">Ikseon-dong</a></strong> (10 min) \u2014 Seoul\u2019s oldest hanok village turned hip cafe district.', price: '' },
      { time: '17:30', activity: 'Cafe: <strong><a href="https://www.google.com/maps/search/Cheong+Su+Dang+Ikseon-dong+Seoul" target="_blank">Cheong Su Dang</a></strong> (stepping stones over water) or <strong><a href="https://www.google.com/maps/search/Seoul+Coffee+Ikseon-dong" target="_blank">Seoul Coffee</a></strong> (squid-ink butter bread).', price: '' },
      { time: '19:00', activity: 'Dinner in Ikseon-dong hanok restaurants \u2014 swirl omelet rice or tteokbokki carbonara.', price: '' }
    ]
  },
  {
    id: 'day-2',
    day: 2,
    date: 'Aug 12 (Wed)',
    title: 'Palaces + Seochon + Insadong + Gwangjang',
    country: 'korea',
    summary: 'Gyeongbokgung, Bukchon, Insadong, Gwangjang Market',
    notes: 'The big traditional Seoul day. Everything open on Wednesdays.',
    badges: [],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Gyeongbokgung+Palace+Seoul/Tongin+Market+Seoul/Changdeokgung+Palace+Seoul/Bukchon+Hanok+Village+Seoul/Insadong-gil+Seoul/Gwangjang+Market+Seoul' }
    ],
    schedule: [
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/Gyeongbokgung+Palace+Seoul" target="_blank">Gyeongbokgung Palace</a></strong> \u2014 Rent hanbok nearby (~15,000\u201320,000 KRW) = FREE palace entry. Guard ceremony at 10:00 & 14:00.', price: 'Free w/hanbok' },
      { time: '11:00', activity: '<strong><a href="https://www.google.com/maps/search/National+Folk+Museum+Korea+Seoul" target="_blank">National Folk Museum</a></strong> \u2014 Inside Gyeongbokgung grounds. Interactive daily life exhibits.', price: 'Free' },
      { time: '12:00', activity: '<strong><a href="https://www.google.com/maps/search/Tongin+Market+Seoul" target="_blank">Tongin Market coin lunchbox</a></strong> \u2014 Pay 5,000 KRW, get brass coins, pick side dishes. Kids love this!', price: '5,000 KRW' },
      { time: '13:00', activity: '<strong><a href="https://www.google.com/maps/search/Hyoja+Bakery+Seochon+Seoul" target="_blank">Hyoja Bakery</a></strong> \u2014 Supplied the Blue House for 26 years. Donuts, chestnut pastries.', price: '' },
      { time: '13:30', activity: '<strong><a href="https://www.google.com/maps/search/Changdeokgung+Palace+Seoul" target="_blank">Changdeokgung Palace + Secret Garden</a></strong> \u2014 UNESCO World Heritage. Book a guided Secret Garden tour.', price: '3,000 + 5,000 KRW' },
      { time: '15:30', activity: '<strong><a href="https://www.google.com/maps/search/Bukchon+Hanok+Village+Seoul" target="_blank">Bukchon Hanok Village</a></strong> \u2014 600+ traditional houses. Photo-friendly hillside streets.', price: 'Free' },
      { time: '16:30', activity: '<strong>Samcheong-dong</strong> \u2014 <a href="https://www.google.com/maps/search/Cafe+Onion+Anguk+Seoul" target="_blank">Cafe Onion Anguk</a> (100-year-old hanok, salt bread). Browse galleries.', price: '' },
      { time: '17:30', activity: '<strong><a href="https://www.google.com/maps/search/Insadong-gil+Seoul" target="_blank">Insadong</a></strong> \u2014 Ssamziegil spiral complex, name stamp carving, craft shops.', price: 'Stamp ~10\u201320k KRW' },
      { time: '19:00', activity: 'Dinner: <strong><a href="https://www.google.com/maps/search/Gwangjang+Market+Seoul" target="_blank">Gwangjang Market</a></strong> \u2014 Bindaetteok, mayak gimbap, yukhoe. <strong>BRING CASH.</strong>', price: '~15,000 KRW/person' }
    ]
  },
  {
    id: 'day-3',
    day: 3,
    date: 'Aug 13 (Thu)',
    title: 'DMZ Tour + War Memorial + Itaewon',
    country: 'korea',
    summary: 'DMZ morning, War Memorial, National Museum, Itaewon/Hannam',
    notes: '',
    badges: [],
    maps: [
      { label: 'Afternoon route', url: 'https://www.google.com/maps/dir/War+Memorial+of+Korea+Seoul/National+Museum+of+Korea+Seoul/Itaewon+Seoul' }
    ],
    schedule: [
      { time: '7:30', activity: '<strong>DMZ Tour pickup</strong> from hotel. Half-day tour (returns ~14:00). Imjingak Peace Park, 3rd Infiltration Tunnel, Dora Observatory, Dorasan Station. <strong>Passports required.</strong>', price: '~65\u201380k KRW' },
      { time: '14:30', activity: '<strong><a href="https://www.google.com/maps/search/War+Memorial+Korea+Seoul" target="_blank">War Memorial of Korea</a></strong> \u2014 Kids climb on real tanks, planes, ships outdoors.', price: 'Free' },
      { time: '16:00', activity: '<strong><a href="https://www.google.com/maps/search/National+Museum+Korea+Seoul" target="_blank">National Museum of Korea</a></strong> \u2014 Children\u2019s Museum excellent for 9-year-olds. Beautiful grounds.', price: 'Free' },
      { time: '18:00', activity: 'Cafe: <a href="https://www.google.com/maps/search/Dotori+cafe+Haebangchon+Seoul" target="_blank">Dotori</a> (Studio Ghibli vibes) or <a href="https://www.google.com/maps/search/Anthracite+Hannam+Seoul" target="_blank">Anthracite</a> (industrial-chic roastery).', price: '' },
      { time: '19:00', activity: 'Dinner: <a href="https://www.google.com/maps/search/Vatos+Urban+Tacos+Itaewon+Seoul" target="_blank">Vatos Urban Tacos</a> (Korean-Mexican fusion) or <a href="https://www.google.com/maps/search/Chompi+Hannam+Seoul" target="_blank">Chompi</a> (BTS SUGA\u2019s brother\u2019s place).', price: '' }
    ]
  },
  {
    id: 'day-4',
    day: 4,
    date: 'Aug 14 (Fri)',
    title: 'Hongdae + Yeonnam + Mangwon',
    country: 'korea',
    summary: 'Animal cafes, weird ice cream, escape room, street busking',
    notes: '',
    badges: [],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Mangwon+Market+Seoul/Gyeongui+Line+Forest+Park+Seoul/943+Kings+Cross+Hongdae+Seoul/Hongdae+Street+Seoul/KEYESCAPE+Hongdae+Seoul' }
    ],
    schedule: [
      { time: '10:00', activity: '<strong><a href="https://www.google.com/maps/search/Mangwon+Market+Seoul" target="_blank">Mangwon Market</a></strong> breakfast \u2014 Tteokbokki, hotteok, dakgangjeong. Less touristy than Gwangjang.', price: '~5\u201310k KRW' },
      { time: '11:00', activity: 'Walk <strong><a href="https://www.google.com/maps/search/Gyeongui+Line+Forest+Park+Seoul" target="_blank">Gyeongui Line Forest Park</a></strong> \u2014 Beautiful linear park on old railway.', price: '' },
      { time: '12:00', activity: '<strong><a href="https://www.google.com/maps/search/943+Kings+Cross+Hongdae+Seoul" target="_blank">943 Kings Cross (Harry Potter Cafe)</a></strong> \u2014 7 floors of Hogwarts! Butterbeer.', price: '~10\u201315k KRW' },
      { time: '13:30', activity: '<strong>Animal cafe</strong> \u2014 <a href="https://www.google.com/maps/search/Table+A+Animal+Cafe+Hongdae+Seoul" target="_blank">Table A</a> (raccoons + meerkats) or <a href="https://www.google.com/maps/search/Thanks+Nature+Sheep+Cafe+Seoul" target="_blank">Thanks Nature</a> (sheep).', price: '~10,000 KRW' },
      { time: '15:00', activity: '<strong>Ice cream crawl</strong> \u2014 <a href="https://www.google.com/maps/search/Fell+Cole+Hongdae+Seoul" target="_blank">Fell + Cole</a> (makgeolli, perilla leaf), <a href="https://www.google.com/maps/search/Mollys+Pops+Hongdae+Seoul" target="_blank">Molly\u2019s Pops</a> (wasabi!), <a href="https://www.google.com/maps/search/SOBOK+Hongdae+Seoul" target="_blank">SOBOK</a> (injeolmi soft serve).', price: '~5\u20138k each' },
      { time: '16:30', activity: '<strong>Hongdae shopping</strong> \u2014 Vintage stores, indie records, K-pop merch.', price: '' },
      { time: '17:30', activity: '<strong><a href="https://www.google.com/maps/search/KEYESCAPE+Hongdae+Seoul" target="_blank">KEYESCAPE</a></strong> escape room \u2014 Award-winning, English-friendly. Book ahead!', price: '~20\u201330k KRW/person' },
      { time: '19:00', activity: 'Dinner: <a href="https://www.google.com/maps/search/Pungcheon+Eel+Hongdae+Seoul" target="_blank">Pungcheon Eel</a> (grilled eel) or <a href="https://www.google.com/maps/search/Honkaz+Hongdae+Seoul" target="_blank">Honkaz</a> (cheese-stuffed tonkatsu).', price: '' },
      { time: '20:00', activity: '<strong>Hongdae street busking</strong> \u2014 Free performances (Fri = yes!).', price: '' }
    ]
  },
  {
    id: 'day-5',
    day: 5,
    date: 'Aug 15 (Sat)',
    title: 'Nami Island + Gapyeong',
    country: 'korea',
    summary: 'Liberation Day! Zip-line, rail bike, Garden of Morning Calm',
    notes: 'National holiday (Gwangbokjeol). Get out of the city \u2014 nature day with kid-friendly activities.',
    badges: [{ type: 'holiday', text: 'Liberation Day' }],
    maps: [
      { label: 'Route', url: 'https://www.google.com/maps/dir/Nami+Island+Gapyeong/Gangchon+Rail+Bike+Gapyeong/Garden+of+Morning+Calm+Gapyeong' }
    ],
    schedule: [
      { time: '8:00', activity: '<strong>ITX train</strong> from Yongsan Station \u2192 Gapyeong (~50 min).', price: '~6,000 KRW' },
      { time: '9:30', activity: '<strong><a href="https://www.google.com/maps/search/Nami+Island+Gapyeong" target="_blank">Nami Island</a></strong> \u2014 Enter by <strong>ZIP-LINE across the river</strong> (thrilling for kids 9+!). Metasequoia Alley, bike rental, craft workshops. Free-roaming ostriches, peacocks, rabbits.', price: '16k + zip 44k KRW' },
      { time: '13:00', activity: 'Lunch on Nami Island.', price: '' },
      { time: '14:30', activity: '<strong><a href="https://www.google.com/maps/search/Gangchon+Rail+Bike+Gapyeong" target="_blank">Gangchon Rail Bike</a></strong> \u2014 8km pedal-powered rail cars through valleys & tunnels.', price: '~35k KRW/car' },
      { time: '16:30', activity: '<strong><a href="https://www.google.com/maps/search/Garden+of+Morning+Calm+Gapyeong" target="_blank">Garden of Morning Calm</a></strong> \u2014 Beautiful botanical garden.', price: '~11,000 KRW' },
      { time: '18:00', activity: 'Train back to Seoul.', price: '' },
      { time: '19:30', activity: 'Light dinner near hotel.', price: '' }
    ]
  },
  {
    id: 'day-6',
    day: 6,
    date: 'Aug 16 (Sun)',
    title: 'Myeongdong + Namsan + Namdaemun + Euljiro',
    country: 'korea',
    summary: 'N Seoul Tower, K-beauty, Namdaemun Market, night market',
    notes: '',
    badges: [{ type: 'pass', text: 'Activate Seoul Pass 48h' }],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Namsan+Cable+Car+Seoul/N+Seoul+Tower/Myeongdong+Kyoja+Seoul/Namdaemun+Market+Seoul/Coffee+Hanyakbang+Euljiro+Seoul/Myeongdong+Seoul' }
    ],
    schedule: [
      { time: '9:30', activity: 'Hike up <strong>Namsan Mountain</strong> or take <strong><a href="https://www.google.com/maps/search/Namsan+Cable+Car+Seoul" target="_blank">Namsan Cable Car</a></strong>.', price: 'Pass or ~15k KRW' },
      { time: '10:30', activity: '<strong><a href="https://www.google.com/maps/search/Namsan+Tower+Seoul" target="_blank">N Seoul Tower</a></strong> \u2014 Digital observatory, love lock terrace. Views over all of Seoul.', price: 'Pass or 16k KRW' },
      { time: '12:30', activity: 'Lunch: <strong><a href="https://www.google.com/maps/search/Myeongdong+Kyoja+Seoul" target="_blank">Myeongdong Kyoja</a></strong> \u2014 Since 1966. Legendary dumplings. Michelin Bib Gourmand.', price: '~10,000 KRW' },
      { time: '14:00', activity: '<strong>Myeongdong K-beauty shopping</strong> \u2014 Olive Young flagship, Innisfree, Laneige.', price: '' },
      { time: '15:30', activity: '<strong><a href="https://www.google.com/maps/search/Namdaemun+Market+Seoul" target="_blank">Namdaemun Market</a></strong> \u2014 Korea\u2019s largest traditional market (since 1400s). Namdaemun Hotteok varieties.', price: '' },
      { time: '17:00', activity: '<strong>Euljiro</strong> \u2014 <a href="https://www.google.com/maps/search/Coffee+Hanyakbang+Euljiro+Seoul" target="_blank">Coffee Hanyakbang</a> (herbal medicine cafe), <a href="https://www.google.com/maps/search/Sewoon+Sangga+Seoul" target="_blank">Sewoon Sangga</a> rooftop views.', price: '' },
      { time: '19:00', activity: '<strong>Myeongdong Night Market</strong> \u2014 100+ stalls. Cheesy lobster tail, grilled squid, egg bread.', price: '' },
      { time: '20:00', activity: 'Desserts: <a href="https://www.google.com/maps/search/SOFTREE+Myeongdong+Seoul" target="_blank">SOFTREE</a> (honeycomb ice cream), tanghulu, Dragon\u2019s Beard Candy.', price: '' }
    ]
  },
  {
    id: 'day-7',
    day: 7,
    date: 'Aug 17 (Mon)',
    title: 'Lotte World Day',
    country: 'korea',
    summary: 'Lotte World, Seoul Sky 500m, Songnidan-gil',
    notes: 'Changdeokgung, War Memorial, Leeum, SeMoCA, MMCA all closed on Mondays \u2014 perfect day for the theme park.',
    badges: [{ type: 'pass', text: 'Seoul Pass still active' }, { type: 'closed', text: 'Museums closed Mon' }],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Lotte+World+Adventure+Seoul/Lotte+World+Tower+Seoul/Seokchon+Lake+Seoul/Songnidan-gil+Seoul' }
    ],
    schedule: [
      { time: '10:00', activity: '<strong><a href="https://www.google.com/maps/search/Lotte+World+Adventure+Seoul" target="_blank">Lotte World Adventure</a></strong> \u2014 World\u2019s largest indoor park! Great for August heat. Then outdoor rides.', price: 'Pass or ~55k KRW' },
      { time: '13:00', activity: 'Lunch inside Lotte World.', price: '' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Lotte+World+Tower+Seoul" target="_blank">Seoul Sky</a></strong> \u2014 Glass-floor observatory at 500m. Floors 117\u2013123. Highest in Korea.', price: '~29,000 KRW' },
      { time: '17:00', activity: 'Walk around <strong><a href="https://www.google.com/maps/search/Seokchon+Lake+Seoul" target="_blank">Seokchon Lake</a></strong>.', price: '' },
      { time: '18:30', activity: 'Cafe: <a href="https://www.google.com/maps/search/Mountain+Nook+cafe+Songpa+Seoul" target="_blank">Mountain Nook</a> (forest-themed) or <a href="https://www.google.com/maps/search/Bontemps+Songnidan+Seoul" target="_blank">Bontemps</a> (twisted donuts).', price: '' },
      { time: '19:30', activity: 'Dinner: <a href="https://www.google.com/maps/search/Motor+City+pizza+Songnidan+Seoul" target="_blank">Motor City</a> (Detroit-style pizza) or <a href="https://www.google.com/maps/search/Pizzeria+Lago+Songnidan+Seoul" target="_blank">Pizzeria Lago</a>.', price: '' }
    ]
  },
  {
    id: 'day-8',
    day: 8,
    date: 'Aug 18 (Tue)',
    title: 'Morning Seoul \u2192 KTX to Busan',
    country: 'korea',
    summary: 'Seoul Forest, Seongsu, COEX, KTX, Haeundae Beach',
    notes: 'Gyeongbokgung closed Tuesdays \u2014 no conflict.',
    badges: [],
    maps: [
      { label: 'Seoul morning', url: 'https://www.google.com/maps/dir/Seoul+Forest+Seoul/Common+Ground+Seoul/Starfield+Library+COEX+Seoul' },
      { label: 'Busan evening', url: 'https://www.google.com/maps/dir/Haeundae+Beach+Busan/Haeundae+Pojangmacha+Busan' }
    ],
    schedule: [
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/Seoul+Forest+Seoul" target="_blank">Seoul Forest Park</a></strong> \u2014 Deer feeding, butterfly garden. Then <strong><a href="https://www.google.com/maps/search/Common+Ground+Seoul" target="_blank">Common Ground</a></strong> shipping container mall.', price: 'Free' },
      { time: '10:30', activity: '<strong>Seongsu warehouse cafes</strong> \u2014 Industrial-chic cafes. Or <a href="https://www.google.com/maps/search/Olive+Young+Seongsu+Seoul" target="_blank">Olive Young N Seongsu</a> 5-floor K-beauty flagship.', price: '' },
      { time: '11:30', activity: '<strong><a href="https://www.google.com/maps/search/Starfield+Library+COEX+Seoul" target="_blank">Starfield Library (COEX)</a></strong> \u2014 Stunning towering bookshelves.', price: 'Free' },
      { time: '12:30', activity: 'Lunch near COEX or grab food for the train.', price: '' },
      { time: '14:00', activity: '<strong>KTX Seoul \u2192 Busan</strong> (~2h15).', price: '~59,800 KRW' },
      { time: '16:15', activity: 'Arrive Busan. Check in hotel (<strong>Haeundae area</strong> recommended).', price: '' },
      { time: '17:30', activity: '<strong><a href="https://www.google.com/maps/search/Haeundae+Beach+Busan" target="_blank">Haeundae Beach</a></strong> \u2014 Swim! Water is 24\u201326\u00b0C. Lifeguards until ~6pm.', price: 'Free' },
      { time: '19:00', activity: 'Dinner: <strong>Haeundae Pojangmacha-chon</strong> \u2014 Seafood stalls on the beach. Or <a href="https://www.google.com/maps/search/Haeundae+Milmyeon+Busan" target="_blank">Haeundae Milmyeon</a> (cold wheat noodles).', price: '' }
    ]
  },
  {
    id: 'day-9',
    day: 9,
    date: 'Aug 19 (Wed)',
    title: 'Busan Full Day',
    country: 'korea',
    summary: 'Temple, Blueline Park, Gamcheon, Jagalchi, markets',
    notes: 'Wednesday: Jagalchi open, Gukje open, Oryukdo open. All clear.',
    badges: [{ type: 'pass', text: 'Activate Busan Pass 24h' }],
    maps: [
      { label: 'Full day route', url: 'https://www.google.com/maps/dir/Haedong+Yonggungsa+Temple+Busan/Haeundae+Blueline+Park+Busan/Gamcheon+Culture+Village+Busan/Jagalchi+Fish+Market+Busan/BIFF+Square+Busan/Busan+Tower+Yongdusan+Park/Bupyeong+Kkangtong+Night+Market+Busan' }
    ],
    schedule: [
      { time: '7:00', activity: '<strong><a href="https://www.google.com/maps/search/Haedong+Yonggungsa+Temple+Busan" target="_blank">Haedong Yonggungsa Temple</a></strong> \u2014 Oceanside temple, 108 stone steps. Go early before tour buses!', price: 'Free' },
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/Haeundae+Blueline+Park+Busan" target="_blank">Blueline Park Sky Capsule</a></strong> \u2014 Colorful pods on elevated rail along the coast. <strong>BOOK 14 DAYS AHEAD.</strong>', price: 'Pass (train) / 35\u201344k (capsule)' },
      { time: '11:00', activity: '<strong><a href="https://www.google.com/maps/search/Gamcheon+Culture+Village+Busan" target="_blank">Gamcheon Culture Village</a></strong> \u2014 \u201cMachu Picchu of Korea.\u201d Get the <strong>Stamp Tour map</strong> = scavenger hunt for kids!', price: 'Free (map 2k KRW)' },
      { time: '11:30', activity: 'Cafe: <a href="https://www.google.com/maps/search/Coffee+It+House+Gamcheon+Busan" target="_blank">Coffee It House</a> rooftop (best panoramic view).', price: '' },
      { time: '14:00', activity: '<strong><a href="https://www.google.com/maps/search/Jagalchi+Fish+Market+Busan" target="_blank">Jagalchi Fish Market</a></strong> \u2014 Korea\u2019s largest. Buy fish downstairs, cook upstairs. Live octopus!', price: '' },
      { time: '15:30', activity: '<strong>BIFF Square</strong> \u2014 Ssiat Hotteok (Busan\u2019s signature pancakes with seeds & nuts).', price: '~1\u20132k KRW' },
      { time: '16:00', activity: '<strong><a href="https://www.google.com/maps/search/Gukje+Market+Busan" target="_blank">Gukje Market</a></strong> \u2014 Massive market. Souvenirs, food, Korean goods.', price: '' },
      { time: '17:00', activity: '<strong><a href="https://www.google.com/maps/search/Busan+Tower+Yongdusan+Park" target="_blank">Busan Tower</a></strong> \u2014 Sunset views over harbor from 120m.', price: 'Pass or ~12k KRW' },
      { time: '19:00', activity: '<strong><a href="https://www.google.com/maps/search/Bupyeong+Kkangtong+Night+Market+Busan" target="_blank">Bupyeong Night Market</a></strong> \u2014 Korea\u2019s first permanent night market.', price: '~10\u201320k KRW' }
    ]
  },
  {
    id: 'day-10',
    day: 10,
    date: 'Aug 20 (Thu)',
    title: 'Busan Morning \u2192 Fly to Taipei',
    country: 'korea',
    summary: 'Songdo Cable Car or Aquarium, fly PUS\u2192TPE',
    notes: '',
    badges: [],
    maps: [],
    schedule: [
      { time: '9:00', activity: 'Pick one: <strong><a href="https://www.google.com/maps/search/Songdo+Marine+Cable+Car+Busan" target="_blank">Songdo Cable Car</a></strong> (1.62km over ocean, glass floor!) or <strong><a href="https://www.google.com/maps/search/SEA+LIFE+Busan+Aquarium" target="_blank">SEA LIFE Aquarium</a></strong> (250 species) or <strong><a href="https://www.google.com/maps/search/Shinsegae+Centum+City+Busan" target="_blank">Spa Land</a></strong> (22 themed saunas).', price: '~20\u201329k KRW' },
      { time: '12:00', activity: 'Lunch in Busan.', price: '' },
      { time: '13:30', activity: 'Head to <strong>Gimhae Airport</strong>.', price: '' },
      { time: '17:00', activity: '<strong>Flight PUS \u2192 TPE</strong> (~2.5 hours).', price: 'Booked ahead' },
      { time: '20:00', activity: 'Arrive <strong>Taipei Taoyuan Airport</strong>. Airport MRT to Taipei Main Station (~40 min). Buy <strong>EasyCard</strong>.', price: 'NT$160' },
      { time: '21:00', activity: 'Check in hotel. Late dinner from convenience store or nearby night market.', price: '' }
    ]
  },
  {
    id: 'day-11',
    day: 11,
    date: 'Aug 21 (Fri)',
    title: 'Taipei Day 1: Old Taipei + Weird Ice Cream',
    country: 'taiwan',
    summary: 'Longshan Temple, Snow King, Ximending, Dihua St, Ningxia',
    notes: '',
    badges: [{ type: 'pass', text: 'Activate Taipei Fun Pass 2-day' }],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Longshan+Temple+Taipei/Bopiliao+Historic+Block+Taipei/Chiang+Kai-shek+Memorial+Hall+Taipei/Snow+King+Ice+Cream+Taipei/Ximending+Taipei/Dihua+Street+Taipei/Ningxia+Night+Market+Taipei' }
    ],
    schedule: [
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/Longshan+Temple+Taipei" target="_blank">Longshan Temple</a></strong> \u2014 Taipei\u2019s oldest (1738). Ornately carved, alive with incense.', price: 'Free' },
      { time: '10:00', activity: '<strong><a href="https://www.google.com/maps/search/Bopiliao+Historic+Block+Taipei" target="_blank">Bopiliao Historic Block</a></strong> \u2014 Best-preserved old street. Qing + Japanese architecture.', price: 'Free' },
      { time: '11:00', activity: '<strong><a href="https://www.google.com/maps/search/Chiang+Kai-shek+Memorial+Hall+Taipei" target="_blank">Chiang Kai-shek Memorial Hall</a></strong> \u2014 Guard-changing ceremony on the hour (9am\u20135pm).', price: 'Free' },
      { time: '12:30', activity: '<strong><a href="https://www.google.com/maps/search/Snow+King+Ice+Cream+Taipei" target="_blank">Snow King Ice Cream</a></strong> \u2014 Since 1947. Flavors: <strong>PORK FLOSS, pig\u2019s knuckle, wasabi, curry, beer, chili!</strong>', price: '' },
      { time: '14:00', activity: '<strong>Ximending</strong> pedestrian area \u2014 Youth culture, street performers, graffiti, Don Don Donki.', price: '' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Modern+Toilet+Restaurant+Ximending+Taipei" target="_blank">Modern Toilet Restaurant</a></strong> \u2014 Sit on toilet seats. Food in toilet bowls. Chocolate \u201cpoop\u201d ice cream. Kids love it.', price: '' },
      { time: '16:30', activity: '<strong><a href="https://www.google.com/maps/search/Dihua+Street+Taipei" target="_blank">Dihua Street</a></strong> \u2014 Taipei\u2019s oldest commercial street (1850s). Baroque facades. Tea, herbs.', price: '' },
      { time: '18:30', activity: '<strong><a href="https://www.google.com/maps/search/Ningxia+Night+Market+Taipei" target="_blank">Ningxia Night Market</a></strong> dinner \u2014 Most local-feeling market. Liu Yu Zi fried taro balls, oyster omelette.', price: '~NT$200\u2013400' }
    ]
  },
  {
    id: 'day-12',
    day: 12,
    date: 'Aug 22 (Sat)',
    title: 'Taipei Day 2: NPM + Beitou + Taipei 101',
    country: 'taiwan',
    summary: 'National Palace Museum, hot springs, Elephant Mountain, Raohe',
    notes: '',
    badges: [{ type: 'pass', text: 'Taipei Fun Pass day 2' }],
    maps: [
      { label: 'Route', url: 'https://www.google.com/maps/dir/National+Palace+Museum+Taipei/Beitou+Hot+Spring+Museum+Taipei/Thermal+Valley+Beitou+Taipei/Elephant+Mountain+Taipei/Taipei+101/Raohe+Night+Market+Taipei' }
    ],
    schedule: [
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/National+Palace+Museum+Taipei" target="_blank">National Palace Museum</a></strong> \u2014 World\u2019s greatest Chinese art. Children\u2019s Gallery. Free for under 17.', price: 'Pass or NT$350' },
      { time: '12:00', activity: '<strong><a href="https://www.google.com/maps/search/Beitou+Hot+Spring+Museum+Taipei" target="_blank">Beitou Hot Spring Museum</a></strong> \u2014 Restored 1913 Japanese bathhouse.', price: 'Free' },
      { time: '12:30', activity: '<strong><a href="https://www.google.com/maps/search/Thermal+Valley+Beitou+Taipei" target="_blank">Thermal Valley (Hell Valley)</a></strong> \u2014 Steaming vivid green sulfurous lake (80\u2013100\u00b0C).', price: 'Free' },
      { time: '13:00', activity: '<strong><a href="https://www.google.com/maps/search/Spring+City+Resort+Beitou+Taipei" target="_blank">Spring City Resort</a></strong> \u2014 Best public hot spring for families. Multiple pools.', price: '~NT$350\u2013600' },
      { time: '16:00', activity: '<strong><a href="https://www.google.com/maps/search/Elephant+Mountain+Xiangshan+Taipei" target="_blank">Elephant Mountain</a></strong> \u2014 Short steep hike (10\u201320 min). THE iconic Taipei 101 photo.', price: 'Free' },
      { time: '17:30', activity: '<strong><a href="https://www.google.com/maps/search/Taipei+101" target="_blank">Taipei 101 Observatory</a></strong> \u2014 Floors 88\u201389 + outdoor deck. Golden hour \u2192 sunset \u2192 night.', price: 'Pass or NT$600' },
      { time: '19:30', activity: '<strong><a href="https://www.google.com/maps/search/Raohe+Night+Market+Taipei" target="_blank">Raohe Night Market</a></strong> \u2014 6 Michelin stalls. <strong>Fuzhou Black Pepper Buns</strong> at entrance.', price: '~NT$200\u2013400' }
    ]
  },
  {
    id: 'day-13',
    day: 13,
    date: 'Aug 23 (Sun)',
    title: 'Northeast Coast: Yehliu + Shifen + Jiufen',
    country: 'taiwan',
    summary: 'Alien rocks, sky lanterns, Spirited Away vibes',
    notes: 'NPM closed (Sun) \u2014 perfect day for the coast.',
    badges: [{ type: 'closed', text: 'NPM closed Sun' }],
    maps: [
      { label: 'Route', url: 'https://www.google.com/maps/dir/Yehliu+Geopark+Taiwan/Shifen+Old+Street+Taiwan/Shifen+Waterfall+Taiwan/Jiufen+Old+Street+Taiwan' }
    ],
    schedule: [
      { time: '8:00', activity: 'Depart Taipei. Book a tour (Klook/KKday ~NT$1,500\u20132,000) or go independently.', price: '' },
      { time: '9:30', activity: '<strong><a href="https://www.google.com/maps/search/Yehliu+Geopark+Taiwan" target="_blank">Yehliu Geopark</a></strong> \u2014 Alien-landscape rock formations. The Queen\u2019s Head. Kids love it.', price: 'NT$120' },
      { time: '11:30', activity: '<strong><a href="https://www.google.com/maps/search/Shifen+Old+Street+Taiwan" target="_blank">Shifen Old Street</a></strong> \u2014 Trains pass inches from stalls! <strong>Sky Lantern Release</strong> \u2014 Write wishes, release. Magical for kids.', price: 'Lantern ~NT$150\u2013200' },
      { time: '12:30', activity: '<strong><a href="https://www.google.com/maps/search/Shifen+Waterfall+Taiwan" target="_blank">Shifen Waterfall</a></strong> \u2014 Taiwan\u2019s widest, \u201cLittle Niagara.\u201d', price: 'Free' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Jiufen+Old+Street+Taiwan" target="_blank">Jiufen Old Street</a></strong> \u2014 Red lanterns, Spirited Away vibes. <strong>Lai Ah Po Taro Balls</strong>. Peanut Ice Cream Roll (strange & delicious).', price: '' },
      { time: '17:00', activity: '<strong><a href="https://www.google.com/maps/search/A-Mei+Tea+House+Jiufen" target="_blank">A-Mei Tea House</a></strong> \u2014 3 floors, views over Keelung Bay. Red lanterns at dusk.', price: '~NT$300/person' },
      { time: '19:00', activity: 'Return to Taipei.', price: '' }
    ]
  },
  {
    id: 'day-14',
    day: 14,
    date: 'Aug 24 (Mon)',
    title: 'Taipei Day 3: Kids\u2019 Science Day',
    country: 'taiwan',
    summary: 'Amusement park, science center, planetarium, Shilin Night Market',
    notes: 'Monday: Maokong Gondola closed, NPM closed, Beitou Museum closed. But Shilin science complex is open (summer vacation).',
    badges: [{ type: 'closed', text: 'Maokong & NPM closed Mon' }],
    maps: [
      { label: 'Walking route', url: 'https://www.google.com/maps/dir/Taipei+Childrens+Amusement+Park/National+Taiwan+Science+Education+Center+Taipei/Taipei+Astronomical+Museum/Shilin+Night+Market+Taipei' }
    ],
    schedule: [
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/Taipei+Childrens+Amusement+Park" target="_blank">Taipei Children\u2019s Amusement Park</a></strong> \u2014 Roller coaster, drop tower, pirate ship, bumper cars. All-day pass NT$200!', price: 'NT$200' },
      { time: '12:00', activity: 'Lunch nearby.', price: '' },
      { time: '13:00', activity: '<strong><a href="https://www.google.com/maps/search/National+Taiwan+Science+Education+Center+Taipei" target="_blank">Science Education Center</a></strong> \u2014 Interactive exhibits. Great for 9-year-olds.', price: 'NT$100' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Taipei+Astronomical+Museum" target="_blank">Astronomical Museum</a></strong> \u2014 Planetarium, IMAX theater, space exhibits.', price: 'NT$40 + IMAX NT$100' },
      { time: '17:00', activity: '<a href="https://www.google.com/maps/search/Pokemon+Center+Taipei" target="_blank">Pok\u00e9mon Center Taipei</a> or <a href="https://www.google.com/maps/search/Donguri+Republic+Shin+Kong+Taipei" target="_blank">Donguri Republic (Ghibli Store)</a> \u2014 Huge Totoro cat bus!', price: '' },
      { time: '18:30', activity: '<strong><a href="https://www.google.com/maps/search/Shilin+Night+Market+Taipei" target="_blank">Shilin Night Market</a></strong> \u2014 Taiwan\u2019s largest. 500+ vendors. Giant chicken cutlets, salt-crisp fried chicken.', price: '~NT$200\u2013400' }
    ]
  },
  {
    id: 'day-15',
    day: 15,
    date: 'Aug 25 (Tue)',
    title: 'HSR to Taichung \u2192 Tainan',
    country: 'taiwan',
    summary: 'Rainbow Village, Miyahara, Fort Zeelandia, Anping, Dadong',
    notes: '',
    badges: [{ type: 'pass', text: 'HSR Pass day 1 of 2' }],
    maps: [
      { label: 'Taichung', url: 'https://www.google.com/maps/dir/Rainbow+Village+Taichung/Miyahara+Ice+Cream+Taichung/National+Taichung+Theater/Taichung+Second+Market' },
      { label: 'Tainan', url: 'https://www.google.com/maps/dir/Fort+Zeelandia+Tainan/Anping+Treehouse+Tainan/Shennong+Street+Tainan/Dadong+Night+Market+Tainan' }
    ],
    schedule: [
      { time: '8:00', activity: '<strong>HSR Taipei \u2192 Taichung</strong> (47 min).', price: 'HSR Pass' },
      { time: '9:00', activity: '<strong><a href="https://www.google.com/maps/search/Rainbow+Village+Taichung" target="_blank">Rainbow Village</a></strong> \u2014 Every surface hand-painted by \u201cGrandpa Rainbow.\u201d Arrive early.', price: 'Free' },
      { time: '10:30', activity: '<strong><a href="https://www.google.com/maps/search/Miyahara+Ice+Cream+Taichung" target="_blank">Miyahara Ice Cream</a></strong> \u2014 Former 1940s eye clinic. Harry Potter interior. Incredible gelato + souvenir packaging.', price: '' },
      { time: '11:30', activity: '<strong><a href="https://www.google.com/maps/search/National+Taichung+Theater" target="_blank">National Taichung Theater</a></strong> \u2014 Toyo Ito\u2019s stunning curved concrete. Rooftop garden.', price: 'Free' },
      { time: '12:30', activity: 'Lunch: <strong><a href="https://www.google.com/maps/search/Taichung+Second+Market" target="_blank">Taichung Second Market</a></strong> \u2014 Century-old braised pork rice.', price: '' },
      { time: '13:30', activity: '<strong>HSR Taichung \u2192 Tainan</strong> (~45 min).', price: 'HSR Pass' },
      { time: '15:30', activity: '<strong>Anping:</strong> <a href="https://www.google.com/maps/search/Fort+Zeelandia+Tainan" target="_blank">Fort Zeelandia</a> (Dutch 1624) \u2192 <a href="https://www.google.com/maps/search/Anping+Treehouse+Tainan" target="_blank">Anping Treehouse</a> (banyan roots consuming a warehouse!) \u2192 Zhou\u2019s Shrimp Rolls.', price: '~NT$140' },
      { time: '18:00', activity: '<strong><a href="https://www.google.com/maps/search/Shennong+Street+Tainan" target="_blank">Shennong Street</a></strong> \u2014 Qing Dynasty-era. Beautiful cafes in century-old buildings.', price: '' },
      { time: '19:00', activity: '<strong><a href="https://www.google.com/maps/search/Dadong+Night+Market+Tainan" target="_blank">Dadong Night Market</a></strong> \u2014 ~300 stalls. Ancient Scallion Pancake truck.', price: '~NT$200\u2013400' }
    ]
  },
  {
    id: 'day-16',
    day: 16,
    date: 'Aug 26 (Wed)',
    title: 'Tainan Morning \u2192 Kaohsiung',
    country: 'taiwan',
    summary: 'Beef soup breakfast, Chihkan Tower, Pier-2, Cijin Island',
    notes: '',
    badges: [],
    maps: [
      { label: 'Tainan morning', url: 'https://www.google.com/maps/dir/Six+Thousand+Beef+Soup+Tainan/Guohua+Street+Tainan/Chihkan+Tower+Tainan/Hayashi+Department+Store+Tainan' },
      { label: 'Kaohsiung', url: 'https://www.google.com/maps/dir/Formosa+Boulevard+MRT+Kaohsiung/Pier-2+Art+Center+Kaohsiung/Cijin+Island+Kaohsiung/Liuhe+Night+Market+Kaohsiung' }
    ],
    schedule: [
      { time: '7:00', activity: '<strong><a href="https://www.google.com/maps/search/Six+Thousand+Beef+Soup+Tainan" target="_blank">Six Thousand Beef Soup</a></strong> \u2014 Tainan BREAKFAST food. Go early morning. Incredible.', price: '' },
      { time: '8:30', activity: '<strong><a href="https://www.google.com/maps/search/Guohua+Street+Tainan" target="_blank">Guohua Street</a></strong> food crawl \u2014 Tainan\u2019s main food artery. Minced pork rice.', price: '' },
      { time: '9:30', activity: '<strong><a href="https://www.google.com/maps/search/Chihkan+Tower+Tainan" target="_blank">Chihkan Tower</a></strong> \u2014 Dutch-built 1653.', price: 'NT$70' },
      { time: '10:30', activity: '<strong><a href="https://www.google.com/maps/search/Du+Hsiao+Yueh+Tainan" target="_blank">Du Hsiao Yueh</a></strong> \u2014 Danzai noodles since 1895. Broth pot never fully cleaned in 130+ years.', price: '~NT$100' },
      { time: '11:30', activity: '<strong><a href="https://www.google.com/maps/search/Hayashi+Department+Store+Tainan" target="_blank">Hayashi Department Store</a></strong> \u2014 1932 building. Rooftop Shinto shrine (only one in Taiwan).', price: 'Free' },
      { time: '12:30', activity: '<strong>Snail Alley</strong> \u2014 Hidden neighborhood with snail statues. Scavenger hunt for kids!', price: '' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Formosa+Boulevard+MRT+Kaohsiung" target="_blank">Formosa Boulevard / Dome of Light</a></strong> \u2014 World\u2019s largest glass art. 4,000+ pieces. Light show at 3pm.', price: 'Free' },
      { time: '15:30', activity: '<strong><a href="https://www.google.com/maps/search/Pier-2+Art+Center+Kaohsiung" target="_blank">Pier-2 Art Center</a></strong> \u2014 Harbor warehouses turned galleries. Outdoor murals, quirky sculptures.', price: 'Free' },
      { time: '17:00', activity: '<strong>Ferry to <a href="https://www.google.com/maps/search/Cijin+Island+Kaohsiung" target="_blank">Cijin Island</a></strong> (5 min). Seafood, Black Sand Beach, Lighthouse, Rainbow Church. Rent bikes.', price: 'Ferry ~NT$40' },
      { time: '19:30', activity: '<strong><a href="https://www.google.com/maps/search/Liuhe+Night+Market+Kaohsiung" target="_blank">Liuhe Night Market</a></strong> dinner \u2014 Tourist-friendly, strong on seafood.', price: '~NT$200\u2013400' }
    ]
  },
  {
    id: 'day-17',
    day: 17,
    date: 'Aug 27 (Thu)',
    title: 'Kaohsiung \u2192 HSR to Taipei \u2192 Maokong',
    country: 'taiwan',
    summary: 'Lotus Pond, HSR back, Maokong Gondola, Yongkang St, Tonghua',
    notes: '',
    badges: [{ type: 'pass', text: 'HSR Pass day 2 of 2' }],
    maps: [
      { label: 'Kaohsiung', url: 'https://www.google.com/maps/dir/Lotus+Pond+Kaohsiung/British+Consulate+Takow+Kaohsiung/Love+River+Kaohsiung' },
      { label: 'Taipei evening', url: 'https://www.google.com/maps/dir/Maokong+Gondola+Taipei/Yongkang+Street+Taipei/Tonghua+Night+Market+Taipei' }
    ],
    schedule: [
      { time: '7:30', activity: '<strong><a href="https://www.google.com/maps/search/Lotus+Pond+Kaohsiung" target="_blank">Lotus Pond</a></strong> \u2014 Enter <strong>Dragon & Tiger Pagodas</strong> (dragon\u2019s mouth in, tiger\u2019s out = good luck!).', price: 'Free' },
      { time: '9:30', activity: '<strong><a href="https://www.google.com/maps/search/British+Consulate+Takow+Kaohsiung" target="_blank">British Consulate at Takow</a></strong> \u2014 1865 red-brick. Stunning views over Sizihwan Bay.', price: '' },
      { time: '10:30', activity: '<strong><a href="https://www.google.com/maps/search/Love+River+Kaohsiung" target="_blank">Love River</a></strong> area walk.', price: '' },
      { time: '11:30', activity: 'Lunch in Kaohsiung (papaya milk \u2014 Kaohsiung specialty!).', price: '' },
      { time: '12:30', activity: '<strong>HSR Zuoying \u2192 Taipei</strong> (1h35).', price: 'HSR Pass' },
      { time: '15:00', activity: '<strong><a href="https://www.google.com/maps/search/Maokong+Gondola+Taipei" target="_blank">Maokong Gondola</a></strong> \u2014 30-min ride over tea plantations. <strong>Glass-floor Crystal Cabin!</strong> Open Thu.', price: 'NT$180 or NT$300 day' },
      { time: '16:00', activity: '<strong>Teahouses at Maokong</strong> \u2014 Sip tea overlooking the valley.', price: '' },
      { time: '19:00', activity: 'Farewell dinner: <strong><a href="https://www.google.com/maps/search/Yongkang+Street+Taipei" target="_blank">Yongkang Street</a></strong> \u2014 <a href="https://www.google.com/maps/search/Yongkang+Beef+Noodles+Taipei" target="_blank">Yongkang Beef Noodles</a> (since 1963).', price: '' },
      { time: '20:30', activity: '<strong><a href="https://www.google.com/maps/search/Tonghua+Night+Market+Taipei" target="_blank">Tonghua Night Market</a></strong> \u2014 Last night market of the trip!', price: '' }
    ]
  },
  {
    id: 'day-18',
    day: 18,
    date: 'Aug 28 (Fri)',
    title: 'Last Taipei Day + Airport',
    country: 'taiwan',
    summary: 'Cat Village or Pineapple Cake class, last shopping, airport hotel',
    notes: 'Flight is 6:55 AM on Aug 29. Must be at TPE by ~4:30 AM. Stay near the airport tonight.',
    badges: [],
    maps: [],
    schedule: [
      { time: '9:00', activity: 'Pick one: <strong><a href="https://www.google.com/maps/search/Houtong+Cat+Village+Taiwan" target="_blank">Houtong Cat Village</a></strong> (hundreds of cats!) or <strong><a href="https://www.google.com/maps/search/Treasure+Hill+Artist+Village+Taipei" target="_blank">Treasure Hill</a></strong> (artists\u2019 colony, murals) or <strong><a href="https://www.google.com/maps/search/Kuo+Yuan+Ye+Museum+Cake+Taipei" target="_blank">Pineapple Cake Baking Class</a></strong> (great souvenir!).', price: '' },
      { time: '12:00', activity: 'Last lunch in Taipei.', price: '' },
      { time: '13:00', activity: 'Last shopping: <a href="https://www.google.com/maps/search/Chifeng+Street+Taipei" target="_blank">Chifeng Street</a> or buy pineapple cakes (essential Taiwan souvenir).', price: '' },
      { time: '15:00', activity: 'Pick up luggage.', price: '' },
      { time: '16:00', activity: '<strong>Taoyuan Airport MRT</strong> from Taipei Main Station (~40 min).', price: 'NT$160' },
      { time: '17:00', activity: 'Check into <strong>airport hotel</strong> (Novotel Taipei Taoyuan or similar).', price: '' },
      { time: 'Evening', activity: 'Relax, pack, explore airport terminal shops.', price: '' }
    ]
  },
  {
    id: 'day-19',
    day: 19,
    date: 'Aug 29 (Sat)',
    title: 'Fly Home',
    country: 'taiwan',
    summary: '6:55 AM departure from TPE',
    notes: '',
    badges: [],
    maps: [],
    schedule: [
      { time: '4:00', activity: 'Head to TPE terminal.', price: '' },
      { time: '4:30', activity: 'Check in and security.', price: '' },
      { time: '6:55', activity: '<strong>Departure. \u2708\ufe0f</strong>', price: '' }
    ]
  }
];

const CHECKLIST = [
  { id: 'ktx', category: 'Book 30+ days ahead', text: '<strong>KTX Seoul \u2192 Busan</strong> (Aug 18, ~14:00) \u2014 letskorail.com or Korail Talk app. ~59,800 KRW/person.' },
  { id: 'dmz', category: 'Book 30+ days ahead', text: '<strong>DMZ Tour</strong> (Aug 13) \u2014 Klook, KKday, or VIPTravel. ~65\u201380k KRW/person. Bring passports.' },
  { id: 'flight-pus-tpe', category: 'Book 30+ days ahead', text: '<strong>Flight Busan \u2192 Taipei</strong> (Aug 20) \u2014 Tigerair or Jeju Air, ~$70\u2013130/person.' },
  { id: 'lotte-tickets', category: 'Book 30+ days ahead', text: '<strong>Lotte World tickets</strong> (Aug 17) \u2014 10\u201320% cheaper online.' },
  { id: 'blueline', category: 'Book 14 days ahead', text: '<strong>Blueline Park Sky Capsule</strong> (Aug 19) \u2014 bluelinepark.com. Sells out in minutes in August!' },
  { id: 'keyescape', category: 'Book 14 days ahead', text: '<strong>KEYESCAPE escape room</strong> (Aug 14 evening) \u2014 keyescape.co.kr. English-friendly.' },
  { id: 'esim', category: 'Buy before departure', text: '<strong>eSIM</strong> \u2014 Airalo, Saily, or Holafly. Korea + Taiwan coverage.' },
  { id: 'insurance', category: 'Buy before departure', text: '<strong>Travel insurance</strong> \u2014 August = typhoon season in Taiwan.' },
  { id: 'tmoney', category: 'Buy on arrival', text: '<strong>T-money card</strong> (Korea) \u2014 Convenience store at Incheon Airport. Load ~50,000 KRW.' },
  { id: 'easycard', category: 'Buy on arrival', text: '<strong>EasyCard</strong> (Taiwan) \u2014 Convenience store at Taoyuan Airport. Load ~NT$500.' },
  { id: 'seoul-pass', category: 'Passes', text: '<strong>Discover Seoul Pass 48h</strong> (69,000 KRW) \u2014 activate Aug 16.' },
  { id: 'busan-pass', category: 'Passes', text: '<strong>Visit Busan Pass 24h</strong> (49,000 KRW) \u2014 activate Aug 19.' },
  { id: 'taipei-pass', category: 'Passes', text: '<strong>Taipei Fun Pass 2-day</strong> (~NT$1,700) \u2014 activate Aug 21.' },
  { id: 'hsr-pass', category: 'Passes', text: '<strong>Taiwan HSR 2-day Pass</strong> (NT$2,500) \u2014 for Aug 25 + Aug 27.' }
];

const PASSES = [
  {
    name: 'Discover Seoul Pass (48h)',
    price: '69,000 KRW',
    activate: 'Aug 16 morning (covers Aug 16\u201317)',
    includes: [
      'N Seoul Tower Observatory (16,000 KRW value)',
      'Lotte World Adventure (~55,000 KRW value)',
      'Alive Museum, Trick Eye Museum, and more'
    ],
    value: 'Value: ~71,000+ KRW from Namsan + Lotte World alone',
    buy: 'Klook, KKday, or Discover Seoul Pass website'
  },
  {
    name: 'Visit Busan Pass (24h)',
    price: '49,000 KRW',
    activate: 'Aug 19 morning',
    includes: [
      'Blueline Park Beach Train (7\u201311k KRW)',
      'Busan Tower (12,000 KRW)',
      'SEA LIFE Aquarium (29,000 KRW)',
      'Songdo Cable Car (17\u201322k KRW)',
      'Spa Land (20,000 KRW)'
    ],
    value: 'Note: Sky Capsule typically NOT included (Beach Train only)',
    buy: 'Klook or Visit Busan Pass app'
  },
  {
    name: 'Taipei Fun Pass Unlimited (2-day)',
    price: '~NT$1,700',
    activate: 'Aug 21 morning (covers Aug 21\u201322)',
    includes: [
      'Taipei 101 Observatory (NT$600)',
      'National Palace Museum (NT$350)',
      '30+ attractions',
      'Unlimited MRT + bus rides (~NT$100\u2013200/day saved)'
    ],
    value: 'Value: NT$950+ from just Taipei 101 + NPM + transit',
    buy: 'Klook, KKday, or Taipei Fun Pass website'
  },
  {
    name: 'Taiwan HSR Flexible 2-day Pass',
    price: 'NT$2,500',
    activate: 'Any 2 days within 7 days (foreigners only, show passport)',
    includes: [
      'Aug 25: Taipei \u2192 Taichung + Taichung \u2192 Tainan = NT$1,350',
      'Aug 27: Kaohsiung \u2192 Taipei = NT$1,490'
    ],
    value: 'Total regular price: NT$2,840. Saves NT$340 + unlimited rides those days',
    buy: 'Klook, KKday, or at THSR stations with passport'
  }
];

// === MAP ICON SVG ===
const MAP_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
const ARROW_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';

// === FIREBASE SYNC ===
let db = null;
let checklistState = {};

function initFirebase() {
  if (typeof window.FIREBASE_CONFIG !== 'undefined' && window.FIREBASE_CONFIG.apiKey) {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js';
    script.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js';
      script2.onload = () => {
        firebase.initializeApp(window.FIREBASE_CONFIG);
        db = firebase.database();
        db.ref('checklist').on('value', (snap) => {
          checklistState = snap.val() || {};
          updateChecklistUI();
        });
        updateSyncStatus(true);
      };
      document.head.appendChild(script2);
    };
    document.head.appendChild(script);
  } else {
    // Fall back to localStorage
    try {
      checklistState = JSON.parse(localStorage.getItem('trip-checklist') || '{}');
    } catch (e) {
      checklistState = {};
    }
    updateSyncStatus(false);
  }
}

function toggleCheckItem(id) {
  checklistState[id] = !checklistState[id];
  if (db) {
    db.ref('checklist/' + id).set(checklistState[id]);
  } else {
    localStorage.setItem('trip-checklist', JSON.stringify(checklistState));
    updateChecklistUI();
  }
}

function updateChecklistUI() {
  document.querySelectorAll('.checklist-item').forEach(el => {
    const id = el.dataset.id;
    const checked = !!checklistState[id];
    el.classList.toggle('checked', checked);
    const cb = el.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = checked;
  });
}

function updateSyncStatus(connected) {
  const el = document.querySelector('.sync-status');
  if (!el) return;
  const dot = el.querySelector('.sync-dot');
  const text = el.querySelector('.sync-text');
  if (connected) {
    dot.classList.add('connected');
    text.textContent = 'Synced across devices';
  } else {
    dot.classList.remove('connected');
    text.textContent = 'Local only (configure Firebase for shared sync)';
  }
}

// === TAB NAVIGATION ===
let activeTab = 'overview';

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  renderContent();
  // Scroll tab into view
  const activeBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === RENDER FUNCTIONS ===

function renderContent() {
  const main = document.getElementById('content');
  if (activeTab === 'overview') {
    main.innerHTML = renderOverview();
  } else if (activeTab === 'passes') {
    main.innerHTML = renderPasses();
  } else if (activeTab === 'packing') {
    main.innerHTML = renderPacking();
  } else {
    const day = DAYS.find(d => d.id === activeTab);
    if (day) main.innerHTML = renderDay(day);
  }
  // Re-bind checklist events
  document.querySelectorAll('.checklist-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      toggleCheckItem(el.dataset.id);
    });
  });
  // Re-bind day card clicks
  document.querySelectorAll('.day-card').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.tab));
  });
  updateChecklistUI();
}

function renderOverview() {
  // Group checklist by category
  const categories = {};
  CHECKLIST.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  let checklistHTML = '<div class="sync-status"><span class="sync-dot"></span><span class="sync-text">Loading...</span></div>';
  for (const [cat, items] of Object.entries(categories)) {
    checklistHTML += `<h3>${cat}</h3><div class="checklist">`;
    items.forEach(item => {
      checklistHTML += `<div class="checklist-item" data-id="${item.id}"><input type="checkbox" tabindex="-1"><span class="checklist-text">${item.text}</span></div>`;
    });
    checklistHTML += '</div>';
  }

  let koreaCards = '';
  let taiwanCards = '';
  DAYS.forEach(day => {
    const card = `<div class="day-card" data-tab="${day.id}">
      <div class="day-card-num ${day.country}">${day.day}</div>
      <div class="day-card-info">
        <div class="day-card-title">${day.date} \u2014 ${day.title}</div>
        <div class="day-card-desc">${day.summary}</div>
      </div>
      <div class="day-card-arrow">${ARROW_ICON}</div>
    </div>`;
    if (day.country === 'korea') koreaCards += card;
    else taiwanCards += card;
  });

  return `
    <div class="overview-section">
      <h2>Booking Checklist</h2>
      ${checklistHTML}
    </div>
    <div class="overview-section">
      <h2>Day-by-Day</h2>
      <div class="country-label korea">Korea \u2014 Seoul + Busan (Aug 11\u201320)</div>
      <div class="day-cards">${koreaCards}</div>
      <div class="country-label taiwan">Taiwan \u2014 Taipei + Taichung + Tainan + Kaohsiung (Aug 20\u201329)</div>
      <div class="day-cards">${taiwanCards}</div>
    </div>`;
}

function renderDay(day) {
  let badgesHTML = day.badges.map(b => `<span class="badge badge-${b.type}">${b.text}</span>`).join('');
  badgesHTML += `<span class="badge badge-${day.country}">${day.country === 'korea' ? 'Korea' : 'Taiwan'}</span>`;

  let mapsHTML = '';
  if (day.maps.length === 1) {
    mapsHTML = `<a href="${day.maps[0].url}" target="_blank" class="map-btn">${MAP_ICON} Open route in Google Maps</a>`;
  } else if (day.maps.length > 1) {
    mapsHTML = '<div class="map-buttons">' + day.maps.map(m => `<a href="${m.url}" target="_blank" class="map-btn">${MAP_ICON} ${m.label}</a>`).join('') + '</div>';
  }

  const notesHTML = day.notes ? `<div class="day-note">${day.notes}</div>` : '';

  const scheduleHTML = day.schedule.map(s => {
    const priceHTML = s.price ? `<div class="schedule-price">${s.price}</div>` : '';
    return `<div class="schedule-item ${day.country}-accent">
      <div class="schedule-time">${s.time}</div>
      <div class="schedule-body">
        <div class="schedule-activity">${s.activity}</div>
        ${priceHTML}
      </div>
    </div>`;
  }).join('');

  // Navigation
  const prevDay = DAYS.find(d => d.day === day.day - 1);
  const nextDay = DAYS.find(d => d.day === day.day + 1);
  let navHTML = '<div style="display:flex;justify-content:space-between;margin-top:1.5rem;">';
  navHTML += prevDay ? `<button class="map-btn" onclick="switchTab('${prevDay.id}')">\u2190 Day ${prevDay.day}</button>` : '<span></span>';
  navHTML += nextDay ? `<button class="map-btn" onclick="switchTab('${nextDay.id}')">Day ${nextDay.day} \u2192</button>` : '<span></span>';
  navHTML += '</div>';

  return `
    <div class="day-header">
      <h2>${day.title}</h2>
      <div class="date">${day.date} \u2014 Day ${day.day} of 19</div>
      <div class="day-badges">${badgesHTML}</div>
    </div>
    ${notesHTML}
    ${mapsHTML}
    <div class="schedule">${scheduleHTML}</div>
    ${navHTML}`;
}

function renderPasses() {
  const cardsHTML = PASSES.map(p => `
    <div class="pass-card">
      <h3>${p.name}</h3>
      <div class="pass-price">${p.price}</div>
      <div class="pass-activate">${p.activate}</div>
      <ul>${p.includes.map(i => `<li>${i}</li>`).join('')}</ul>
      <div class="pass-value">${p.value}</div>
      <div class="pass-buy">Buy: ${p.buy}</div>
    </div>`).join('');

  return `
    <div class="overview-section">
      <h2>City & Transport Passes</h2>
      ${cardsHTML}
    </div>
    <div class="overview-section">
      <h2>Transit Cards</h2>
      <div class="pass-card">
        <h3>T-money Card (Korea)</h3>
        <ul>
          <li>Buy at any convenience store at Incheon Airport</li>
          <li>Load ~50,000 KRW to start</li>
          <li>Works on: all buses, subways, some taxis, convenience stores</li>
        </ul>
      </div>
      <div class="pass-card">
        <h3>EasyCard (Taiwan)</h3>
        <ul>
          <li>Buy at any convenience store or MRT station at Taoyuan Airport</li>
          <li>Load ~NT$500 to start</li>
          <li>Works on: MRT, buses, TRA trains, convenience stores, YouBike, Maokong Gondola</li>
          <li>20% discount on MRT rides</li>
        </ul>
      </div>
    </div>
    <div class="overview-section">
      <h2>Connectivity</h2>
      <div class="pass-card">
        <h3>eSIM Options</h3>
        <ul>
          <li><strong>Airalo</strong> \u2014 ~$5\u201310 for 7 days</li>
          <li><strong>Holafly</strong> \u2014 Unlimited data ~$25</li>
          <li>Or buy SIM at airport (Chunghwa Telecom in Taiwan: 10 days unlimited ~NT$700)</li>
        </ul>
      </div>
    </div>`;
}

function renderPacking() {
  return `
    <div class="overview-section">
      <h2>Weather & Packing for August</h2>
      <div class="packing-grid">
        <div class="packing-card">
          <h3>Korea: 28\u201333\u00b0C</h3>
          <ul>
            <li>70\u201385% humidity</li>
            <li>Monsoon typically ends late July</li>
            <li>August still gets sudden heavy showers</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Taiwan: 28\u201335\u00b0C</h3>
          <ul>
            <li>Feels like 38\u201345\u00b0C with humidity</li>
            <li>Afternoon thunderstorms common</li>
            <li>Peak typhoon season</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Pack</h3>
          <ul>
            <li>Lightweight breathable clothing (linen, cotton, quick-dry)</li>
            <li>Compact rain jacket or umbrella (ESSENTIAL)</li>
            <li>SPF 50+ sunscreen, hat, sunglasses</li>
            <li>Comfortable walking shoes for wet conditions</li>
            <li>Portable fan / cooling towel</li>
            <li>Waterproof phone case</li>
            <li>Reusable water bottle</li>
          </ul>
        </div>
        <div class="packing-card">
          <h3>Strategy</h3>
          <ul>
            <li><strong>Outdoor sites:</strong> early morning before 10am</li>
            <li><strong>Indoor sites:</strong> midday heat 11am\u20133pm</li>
            <li><strong>Markets & night markets:</strong> evening</li>
            <li>Convenience stores = air-conditioned refuges everywhere</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="overview-section">
      <h2>Closed-Day Rules</h2>
      <h3>Seoul</h3>
      <table class="closed-table">
        <tr><th>Day</th><th>What\u2019s Closed</th></tr>
        <tr><td>Monday</td><td>Changdeokgung, Changgyeonggung, War Memorial, Leeum, SeMoCA, MMCA</td></tr>
        <tr><td>Tuesday</td><td>Gyeongbokgung, National Folk Museum, Jongmyo Shrine</td></tr>
        <tr><td>Hanbok tip</td><td>Wearing hanbok = free entry to all palaces</td></tr>
      </table>
      <h3>Busan</h3>
      <table class="closed-table">
        <tr><th>Day</th><th>What\u2019s Closed</th></tr>
        <tr><td>Monday</td><td>Oryukdo Skywalk, Busan Science Museum, Art Museum, Taejongdae Danubi Train</td></tr>
        <tr><td>1st & 3rd Tue</td><td>Jagalchi Fish Market</td></tr>
        <tr><td>1st & 3rd Sun</td><td>Gukje Market</td></tr>
      </table>
      <h3>Taiwan</h3>
      <table class="closed-table">
        <tr><th>Day</th><th>What\u2019s Closed</th></tr>
        <tr><td>Monday</td><td>Maokong Gondola, Beitou Hot Spring Museum, Tainan Art Museum</td></tr>
        <tr><td>Sun + Mon</td><td>National Palace Museum</td></tr>
        <tr><td>Tuesday</td><td>Fo Guang Shan Buddha Museum</td></tr>
      </table>
    </div>
    <div class="overview-section">
      <h2>Optional Swaps</h2>
      <div class="packing-card">
        <h3>Want Gyeongju?</h3>
        <ul><li>Drop Nami Island (Aug 15) or Lotte World (Aug 17). Take KTX to Busan early. Use Aug 18 for Gyeongju day trip.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Want Everland instead of Lotte World?</h3>
        <ul><li>Everland (~1h from Seoul) has T Express (steepest wooden coaster). Lotte World is more convenient + indoor for heat.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Want more Taipei?</h3>
        <ul><li>Skip Taichung (Aug 25 morning), take HSR directly to Tainan. Extra half-day for Treasure Hill or Houtong Cat Village.</li></ul>
      </div>
      <div class="packing-card">
        <h3>Want Alishan or Sun Moon Lake?</h3>
        <ul><li>Requires 1\u20132 extra days. Cut Tainan or Kaohsiung. Sun Moon Lake doable as day trip from Taichung.</li></ul>
      </div>
    </div>`;
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  // Tab click handlers
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Initial render
  renderContent();
  initFirebase();
});
