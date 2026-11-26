window.SasyTix = window.SasyTix || {};

/**
 * Structured Seed Data for Sasy.Tix Maritime Portal.
 * Designed as a clean, normalized dataset so it can be swapped
 * directly with REST/GraphQL/SQL database endpoints later.
 */
window.SasyTix.MOCK_DATA = {
  users: [
    {
      id: 'usr-buyer-1',
      name: 'Hendra Wijaya',
      email: 'hendra.wijaya@gmail.com',
      password: 'demo123',
      role: 'buyer',
      phone: '+62 812-7700-1122',
      status: 'active',
      savedPassengers: [
        {
          fullName: 'Hendra Wijaya',
          gender: 'Male',
          dob: '1992-06-15',
          nationality: 'Indonesia',
          passportNumber: 'C8842190',
          passportExpiry: '2030-04-12',
          email: 'hendra.wijaya@gmail.com',
          phone: '+62 812-7700-1122'
        }
      ],
      notifications: { email: true, whatsapp: true, promo: false }
    },
    {
      id: 'usr-admin-1',
      name: 'Fajar Pratama',
      email: 'admin@demo.com',
      password: 'demo123',
      role: 'admin',
      phone: '+62 811-7000-4455',
      status: 'active',
      department: 'Operations & Ticketing'
    },
    {
      id: 'usr-owner-1',
      name: 'Hendra Wijaya',
      email: 'owner@demo.com',
      password: 'demo123',
      role: 'owner',
      phone: '+62 811-7777-9900',
      status: 'active',
      title: 'Managing Director'
    }
  ],

  routes: [
    {
      id: 'rt-btm-sin-hf',
      originCity: 'Batam',
      originCountry: 'Indonesia',
      originTerminal: 'Batam Centre International Ferry Terminal',
      destinationCity: 'Singapura',
      destinationCountry: 'Singapore',
      destinationTerminal: 'HarbourFront Centre',
      durationMinutes: 50,
      basePrice: 430000,
      status: 'active',
      corridor: 'Batam - Singapura'
    },
    {
      id: 'rt-sin-btm-hf',
      originCity: 'Singapura',
      originCountry: 'Singapore',
      originTerminal: 'HarbourFront Centre',
      destinationCity: 'Batam',
      destinationCountry: 'Indonesia',
      destinationTerminal: 'Batam Centre International Ferry Terminal',
      durationMinutes: 50,
      basePrice: 450000,
      status: 'active',
      corridor: 'Batam - Singapura'
    },
    {
      id: 'rt-btm-sin-tm',
      originCity: 'Batam',
      originCountry: 'Indonesia',
      originTerminal: 'Nongsapura Ferry Terminal',
      destinationCity: 'Singapura',
      destinationCountry: 'Singapore',
      destinationTerminal: 'Tanah Merah Ferry Terminal',
      durationMinutes: 45,
      basePrice: 440000,
      status: 'active',
      corridor: 'Batam - Singapura'
    },
    {
      id: 'rt-sin-btm-tm',
      originCity: 'Singapura',
      originCountry: 'Singapore',
      originTerminal: 'Tanah Merah Ferry Terminal',
      destinationCity: 'Batam',
      destinationCountry: 'Indonesia',
      destinationTerminal: 'Nongsapura Ferry Terminal',
      durationMinutes: 45,
      basePrice: 445000,
      status: 'active',
      corridor: 'Batam - Singapura'
    },
    {
      id: 'rt-btm-sin-hb',
      originCity: 'Batam',
      originCountry: 'Indonesia',
      originTerminal: 'Harbour Bay Ferry Terminal',
      destinationCity: 'Singapura',
      destinationCountry: 'Singapore',
      destinationTerminal: 'HarbourFront Centre',
      durationMinutes: 55,
      basePrice: 435000,
      status: 'active',
      corridor: 'Batam - Singapura'
    },
    {
      id: 'rt-btm-my-ph',
      originCity: 'Batam',
      originCountry: 'Indonesia',
      originTerminal: 'Harbour Bay Ferry Terminal',
      destinationCity: 'Malaysia',
      destinationCountry: 'Malaysia',
      destinationTerminal: 'Puteri Harbour International Ferry Terminal',
      durationMinutes: 90,
      basePrice: 490000,
      status: 'active',
      corridor: 'Batam - Malaysia'
    },
    {
      id: 'rt-my-btm-ph',
      originCity: 'Malaysia',
      originCountry: 'Malaysia',
      originTerminal: 'Puteri Harbour International Ferry Terminal',
      destinationCity: 'Batam',
      destinationCountry: 'Indonesia',
      destinationTerminal: 'Harbour Bay Ferry Terminal',
      durationMinutes: 90,
      basePrice: 510000,
      status: 'active',
      corridor: 'Batam - Malaysia'
    },
    {
      id: 'rt-btm-my-sl',
      originCity: 'Batam',
      originCountry: 'Indonesia',
      originTerminal: 'Batam Centre International Ferry Terminal',
      destinationCity: 'Malaysia',
      destinationCountry: 'Malaysia',
      destinationTerminal: 'Stulang Laut Berjaya Waterfront',
      durationMinutes: 105,
      basePrice: 480000,
      status: 'active',
      corridor: 'Batam - Malaysia'
    },
    {
      id: 'rt-my-btm-sl',
      originCity: 'Malaysia',
      originCountry: 'Malaysia',
      originTerminal: 'Stulang Laut Berjaya Waterfront',
      destinationCity: 'Batam',
      destinationCountry: 'Indonesia',
      destinationTerminal: 'Batam Centre International Ferry Terminal',
      durationMinutes: 105,
      basePrice: 495000,
      status: 'active',
      corridor: 'Batam - Malaysia'
    },
    {
      id: 'rt-btm-sin-sk',
      originCity: 'Batam',
      originCountry: 'Indonesia',
      originTerminal: 'Sekupang International Ferry Terminal',
      destinationCity: 'Singapura',
      destinationCountry: 'Singapore',
      destinationTerminal: 'HarbourFront Centre',
      durationMinutes: 55,
      basePrice: 420000,
      status: 'inactive',
      corridor: 'Batam - Singapura'
    }
  ],

  operators: [
    { id: 'op-batamfast', name: 'Batam Fast Ferry', logo: 'assets/logos/operators/batam-fast-ferry.png', vessel: 'MV Batam Fast 18' },
    { id: 'op-sindo', name: 'Sindo Ferry', logo: 'assets/logos/operators/sindo-ferry.png', vessel: 'MV Sindo Express' },
    { id: 'op-majestic', name: 'Majestic Fast Ferry', logo: 'assets/logos/operators/majestic-fast-ferry.png', vessel: 'MV Majestic Dream' },
    { id: 'op-horizon', name: 'Horizon Fast Ferry', logo: 'assets/logos/operators/horizon-fast-ferry.png', vessel: 'MV Horizon 9' }
  ],

  schedules: [
    { id: 'SCH-1001', routeId: 'rt-btm-sin-hf', operatorId: 'op-batamfast', vessel: 'MV Batam Fast 18', date: '2026-11-27', departureTime: '07:00', arrivalTime: '07:50', price: 430000, quota: 42, booked: 34, facilities: ['Air Conditioning', 'Panoramic Cabin', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1002', routeId: 'rt-btm-sin-hf', operatorId: 'op-majestic', vessel: 'MV Majestic Dream', date: '2026-11-27', departureTime: '09:30', arrivalTime: '10:20', price: 455000, quota: 50, booked: 41, facilities: ['VIP Deck Option', 'Air Conditioning', 'USB Charging'], status: 'active' },
    { id: 'SCH-1003', routeId: 'rt-btm-sin-hf', operatorId: 'op-sindo', vessel: 'MV Sindo Express', date: '2026-11-27', departureTime: '13:15', arrivalTime: '14:05', price: 425000, quota: 35, booked: 22, facilities: ['Air Conditioning', 'Luggage 20kg', 'Snack Bar'], status: 'active' },
    { id: 'SCH-1004', routeId: 'rt-sin-btm-hf', operatorId: 'op-batamfast', vessel: 'MV Batam Fast 12', date: '2026-11-27', departureTime: '10:45', arrivalTime: '11:35', price: 450000, quota: 45, booked: 28, facilities: ['Air Conditioning', 'Panoramic Cabin', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1005', routeId: 'rt-sin-btm-hf', operatorId: 'op-horizon', vessel: 'MV Horizon 9', date: '2026-11-27', departureTime: '16:30', arrivalTime: '17:20', price: 465000, quota: 40, booked: 31, facilities: ['Business Cabin', 'Air Conditioning', 'Priority Boarding'], status: 'active' },
    { id: 'SCH-1006', routeId: 'rt-btm-my-ph', operatorId: 'op-batamfast', vessel: 'MV Puteri Express', date: '2026-11-27', departureTime: '08:15', arrivalTime: '09:45', price: 490000, quota: 36, booked: 19, facilities: ['Air Conditioning', 'Luggage 20kg', 'Sea View'], status: 'active' },
    { id: 'SCH-1007', routeId: 'rt-btm-my-sl', operatorId: 'op-sindo', vessel: 'MV Stulang Star', date: '2026-11-27', departureTime: '11:00', arrivalTime: '12:45', price: 480000, quota: 30, booked: 14, facilities: ['Air Conditioning', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1008', routeId: 'rt-my-btm-ph', operatorId: 'op-batamfast', vessel: 'MV Puteri Express', date: '2026-11-27', departureTime: '14:30', arrivalTime: '16:00', price: 510000, quota: 36, booked: 17, facilities: ['Air Conditioning', 'Luggage 20kg', 'Sea View'], status: 'active' },
    { id: 'SCH-1009', routeId: 'rt-btm-sin-tm', operatorId: 'op-batamfast', vessel: 'MV Nongsa Star', date: '2026-11-27', departureTime: '08:00', arrivalTime: '08:45', price: 440000, quota: 38, booked: 25, facilities: ['Air Conditioning', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1010', routeId: 'rt-sin-btm-tm', operatorId: 'op-batamfast', vessel: 'MV Nongsa Star', date: '2026-11-27', departureTime: '12:00', arrivalTime: '12:45', price: 445000, quota: 38, booked: 20, facilities: ['Air Conditioning', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1011', routeId: 'rt-btm-sin-hb', operatorId: 'op-horizon', vessel: 'MV Horizon 7', date: '2026-11-27', departureTime: '09:00', arrivalTime: '09:55', price: 435000, quota: 44, booked: 36, facilities: ['Business Cabin', 'Air Conditioning'], status: 'active' },
    { id: 'SCH-1012', routeId: 'rt-my-btm-sl', operatorId: 'op-sindo', vessel: 'MV Stulang Star', date: '2026-11-27', departureTime: '15:15', arrivalTime: '17:00', price: 495000, quota: 30, booked: 16, facilities: ['Air Conditioning', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1013', routeId: 'rt-btm-sin-hf', operatorId: 'op-majestic', vessel: 'MV Majestic Pride', date: '2026-11-28', departureTime: '07:30', arrivalTime: '08:20', price: 455000, quota: 50, booked: 45, facilities: ['VIP Deck Option', 'USB Charging'], status: 'active' },
    { id: 'SCH-1014', routeId: 'rt-btm-sin-hf', operatorId: 'op-batamfast', vessel: 'MV Batam Fast 18', date: '2026-11-28', departureTime: '11:30', arrivalTime: '12:20', price: 430000, quota: 42, booked: 29, facilities: ['Air Conditioning', 'Luggage 20kg'], status: 'active' },
    { id: 'SCH-1015', routeId: 'rt-sin-btm-hf', operatorId: 'op-sindo', vessel: 'MV Sindo Express', date: '2026-11-28', departureTime: '14:15', arrivalTime: '15:05', price: 450000, quota: 35, booked: 24, facilities: ['Air Conditioning', 'Snack Bar'], status: 'active' },
    { id: 'SCH-1016', routeId: 'rt-btm-my-ph', operatorId: 'op-batamfast', vessel: 'MV Puteri Express', date: '2026-11-28', departureTime: '08:15', arrivalTime: '09:45', price: 490000, quota: 36, booked: 27, facilities: ['Air Conditioning', 'Sea View'], status: 'active' },
    { id: 'SCH-1017', routeId: 'rt-btm-sin-hb', operatorId: 'op-horizon', vessel: 'MV Horizon 9', date: '2026-11-28', departureTime: '17:00', arrivalTime: '17:55', price: 440000, quota: 40, booked: 15, facilities: ['Business Cabin', 'Priority Boarding'], status: 'active' },
    { id: 'SCH-1018', routeId: 'rt-btm-sin-sk', operatorId: 'op-sindo', vessel: 'MV Sindo 5', date: '2026-11-29', departureTime: '10:00', arrivalTime: '10:55', price: 420000, quota: 32, booked: 0, facilities: ['Air Conditioning'], status: 'inactive' }
  ],

  bookings: [
    {
      id: 'STX-2611-8801', userId: 'usr-buyer-1', scheduleId: 'SCH-1001', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Hendra Wijaya', gender: 'Male', dob: '1992-06-15', nationality: 'Indonesia', passportNumber: 'C8842190', passportExpiry: '2030-04-12', email: 'hendra.wijaya@gmail.com', phone: '+62 812-7700-1122', seat: 'A12' }
      ],
      ticketSubtotal: 430000, portFee: 65000, serviceFee: 15000, totalAmount: 510000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261126-8801',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8801-A', createdAt: '2026-11-25T10:15:00Z'
    },
    {
      id: 'STX-2611-8802', userId: 'usr-buyer-1', scheduleId: 'SCH-1006', routeId: 'rt-btm-my-ph',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Hendra Wijaya', gender: 'Male', dob: '1992-06-15', nationality: 'Indonesia', passportNumber: 'C8842190', passportExpiry: '2030-04-12', email: 'hendra.wijaya@gmail.com', phone: '+62 812-7700-1122', seat: 'B04' },
        { fullName: 'Andi Wijaya', gender: 'Male', dob: '1993-09-21', nationality: 'Indonesia', passportNumber: 'C7731044', passportExpiry: '2029-08-15', email: 'andi@demo.com', phone: '+62 813-6611-2233', seat: 'B05' }
      ],
      ticketSubtotal: 980000, portFee: 130000, serviceFee: 20000, totalAmount: 1130000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Payment Submitted', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-BCA-99018231',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T08:30:00Z'
    },
    {
      id: 'STX-2611-8795', userId: 'usr-buyer-2', scheduleId: 'SCH-1004', routeId: 'rt-sin-btm-hf',
      tripType: 'one_way', travelDate: '2026-11-26',
      passengers: [
        { fullName: 'Marcus Tan', gender: 'Male', dob: '1988-02-17', nationality: 'Singapore', passportNumber: 'K4519822D', passportExpiry: '2031-01-10', email: 'marcus.tan@example.com', phone: '+65 9123 4567', seat: 'C08' }
      ],
      ticketSubtotal: 450000, portFee: 65000, serviceFee: 15000, totalAmount: 530000,
      bookingStatus: 'Completed', paymentStatus: 'Verified', paymentMethod: 'Credit / Debit Card', paymentProofRef: 'CARD-4111-8892',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8795-C', createdAt: '2026-11-20T14:20:00Z'
    },
    {
      id: 'STX-2611-8799', userId: 'usr-buyer-3', scheduleId: 'SCH-1002', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Nurul Aini', gender: 'Female', dob: '1997-11-03', nationality: 'Malaysia', passportNumber: 'A55201933', passportExpiry: '2029-11-03', email: 'nurul@example.com', phone: '+60 12-345 6789', seat: 'D02' }
      ],
      ticketSubtotal: 455000, portFee: 65000, serviceFee: 15000, totalAmount: 535000,
      bookingStatus: 'Cancelled', paymentStatus: 'Rejected', paymentMethod: 'Bank Transfer', paymentProofRef: 'TRF-MANDIRI-0019',
      rejectionNote: 'Nominal transfer tidak sesuai total tagihan invoice.', ticketIssued: false, ticketCode: '', createdAt: '2026-11-24T16:40:00Z'
    },
    {
      id: 'STX-2611-8803', userId: 'usr-buyer-4', scheduleId: 'SCH-1003', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Siti Rahmawati', gender: 'Female', dob: '1995-04-11', nationality: 'Indonesia', passportNumber: 'C5129043', passportExpiry: '2030-09-01', email: 'siti.rahma@gmail.com', phone: '+62 812-3344-5566', seat: 'A03' },
        { fullName: 'Bambang Kusumo', gender: 'Male', dob: '1991-01-25', nationality: 'Indonesia', passportNumber: 'C5129044', passportExpiry: '2030-09-01', email: 'bambang.k@gmail.com', phone: '+62 812-3344-5567', seat: 'A04' }
      ],
      ticketSubtotal: 850000, portFee: 130000, serviceFee: 20000, totalAmount: 1000000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261126-8803',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8803-A', createdAt: '2026-11-25T11:20:00Z'
    },
    {
      id: 'STX-2611-8804', userId: 'usr-buyer-5', scheduleId: 'SCH-1005', routeId: 'rt-sin-btm-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Rachel Lim', gender: 'Female', dob: '1990-08-19', nationality: 'Singapore', passportNumber: 'K8812031E', passportExpiry: '2032-03-14', email: 'rachel.lim@sgmail.com', phone: '+65 9876 5432', seat: 'B09' }
      ],
      ticketSubtotal: 465000, portFee: 65000, serviceFee: 15000, totalAmount: 545000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Payment Submitted', paymentMethod: 'Bank Transfer', paymentProofRef: 'TRF-DBS-77218',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T09:10:00Z'
    },
    {
      id: 'STX-2611-8805', userId: 'usr-buyer-6', scheduleId: 'SCH-1007', routeId: 'rt-btm-my-sl',
      tripType: 'round_trip', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Ahmad Zaki', gender: 'Male', dob: '1985-12-09', nationality: 'Malaysia', passportNumber: 'A99201441', passportExpiry: '2028-12-09', email: 'ahmad.zaki@my.com', phone: '+60 13-778 9012', seat: 'C01' },
        { fullName: 'Farah Nadia', gender: 'Female', dob: '1987-05-22', nationality: 'Malaysia', passportNumber: 'A99201442', passportExpiry: '2029-05-22', email: 'farah.n@my.com', phone: '+60 13-778 9013', seat: 'C02' },
        { fullName: 'Danish Hakim', gender: 'Male', dob: '2014-03-10', nationality: 'Malaysia', passportNumber: 'A99201443', passportExpiry: '2029-03-10', email: 'ahmad.zaki@my.com', phone: '+60 13-778 9012', seat: 'C03' }
      ],
      ticketSubtotal: 1440000, portFee: 195000, serviceFee: 25000, totalAmount: 1660000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'Credit / Debit Card', paymentProofRef: 'CARD-5412-9012',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8805-C', createdAt: '2026-11-25T14:50:00Z'
    },
    {
      id: 'STX-2611-8806', userId: 'usr-buyer-7', scheduleId: 'SCH-1009', routeId: 'rt-btm-sin-tm',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Kevin Hartono', gender: 'Male', dob: '1994-07-02', nationality: 'Indonesia', passportNumber: 'C6621890', passportExpiry: '2031-07-02', email: 'kevin.h@gmail.com', phone: '+62 811-2233-4455', seat: 'D10' }
      ],
      ticketSubtotal: 440000, portFee: 65000, serviceFee: 15000, totalAmount: 520000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-BRI-4401928',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8806-D', createdAt: '2026-11-25T16:05:00Z'
    },
    {
      id: 'STX-2611-8807', userId: 'usr-buyer-8', scheduleId: 'SCH-1011', routeId: 'rt-btm-sin-hb',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Melissa Wong', gender: 'Female', dob: '1991-03-28', nationality: 'Singapore', passportNumber: 'K3310944A', passportExpiry: '2030-06-18', email: 'melissa.w@sgmail.com', phone: '+65 8112 3344', seat: 'A07' },
        { fullName: 'Darren Teo', gender: 'Male', dob: '1989-10-12', nationality: 'Singapore', passportNumber: 'K3310945B', passportExpiry: '2030-06-18', email: 'darren.teo@sgmail.com', phone: '+65 8112 3345', seat: 'A08' }
      ],
      ticketSubtotal: 870000, portFee: 130000, serviceFee: 20000, totalAmount: 1020000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Payment Submitted', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261126-8807',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T09:45:00Z'
    },
    {
      id: 'STX-2611-8808', userId: 'usr-buyer-9', scheduleId: 'SCH-1008', routeId: 'rt-my-btm-ph',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Rizky Ramadhan', gender: 'Male', dob: '1996-02-14', nationality: 'Indonesia', passportNumber: 'C4410293', passportExpiry: '2031-02-14', email: 'rizky.r@gmail.com', phone: '+62 813-9988-7766', seat: 'E04' }
      ],
      ticketSubtotal: 510000, portFee: 65000, serviceFee: 15000, totalAmount: 590000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-MANDIRI-88120',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8808-E', createdAt: '2026-11-24T19:30:00Z'
    },
    {
      id: 'STX-2611-8809', userId: 'usr-buyer-10', scheduleId: 'SCH-1010', routeId: 'rt-sin-btm-tm',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Daniel Ng', gender: 'Male', dob: '1983-11-30', nationality: 'Singapore', passportNumber: 'K7719201C', passportExpiry: '2029-11-30', email: 'daniel.ng@sgmail.com', phone: '+65 9001 2233', seat: 'B14' }
      ],
      ticketSubtotal: 445000, portFee: 65000, serviceFee: 15000, totalAmount: 525000,
      bookingStatus: 'Completed', paymentStatus: 'Verified', paymentMethod: 'Credit / Debit Card', paymentProofRef: 'CARD-4220-1122',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8809-B', createdAt: '2026-11-21T09:15:00Z'
    },
    {
      id: 'STX-2611-8810', userId: 'usr-buyer-11', scheduleId: 'SCH-1013', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Putri Ayu Lestari', gender: 'Female', dob: '1998-05-06', nationality: 'Indonesia', passportNumber: 'C9912034', passportExpiry: '2032-05-06', email: 'putri.ayu@gmail.com', phone: '+62 852-1122-3344', seat: 'A15' }
      ],
      ticketSubtotal: 455000, portFee: 65000, serviceFee: 15000, totalAmount: 535000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Pending', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-BNI-330192',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T10:12:00Z'
    },
    {
      id: 'STX-2611-8811', userId: 'usr-buyer-12', scheduleId: 'SCH-1014', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Hafizuddin Mansor', gender: 'Male', dob: '1990-01-19', nationality: 'Malaysia', passportNumber: 'A77120944', passportExpiry: '2030-01-19', email: 'hafiz.m@my.com', phone: '+60 19-223 4455', seat: 'C11' },
        { fullName: 'Aisyah Rahman', gender: 'Female', dob: '1992-08-27', nationality: 'Malaysia', passportNumber: 'A77120945', passportExpiry: '2030-08-27', email: 'aisyah.r@my.com', phone: '+60 19-223 4456', seat: 'C12' }
      ],
      ticketSubtotal: 860000, portFee: 130000, serviceFee: 20000, totalAmount: 1010000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261126-8811',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8811-C', createdAt: '2026-11-25T17:40:00Z'
    },
    {
      id: 'STX-2611-8812', userId: 'usr-buyer-13', scheduleId: 'SCH-1016', routeId: 'rt-btm-my-ph',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Yusuf Maulana', gender: 'Male', dob: '1986-04-03', nationality: 'Indonesia', passportNumber: 'C2291045', passportExpiry: '2029-04-03', email: 'yusuf.m@gmail.com', phone: '+62 815-7788-9900', seat: 'D05' }
      ],
      ticketSubtotal: 490000, portFee: 65000, serviceFee: 15000, totalAmount: 570000,
      bookingStatus: 'Cancelled', paymentStatus: 'Rejected', paymentMethod: 'Bank Transfer', paymentProofRef: 'TRF-BCA-00821',
      rejectionNote: 'Bukti transfer tidak terbaca / buram.', ticketIssued: false, ticketCode: '', createdAt: '2026-11-24T13:10:00Z'
    },
    {
      id: 'STX-2611-8813', userId: 'usr-buyer-14', scheduleId: 'SCH-1015', routeId: 'rt-sin-btm-hf',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Cheryl Koh', gender: 'Female', dob: '1993-09-14', nationality: 'Singapore', passportNumber: 'K9910234F', passportExpiry: '2031-09-14', email: 'cheryl.koh@sgmail.com', phone: '+65 9334 5566', seat: 'B02' }
      ],
      ticketSubtotal: 450000, portFee: 65000, serviceFee: 15000, totalAmount: 530000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'Credit / Debit Card', paymentProofRef: 'CARD-4556-7781',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8813-B', createdAt: '2026-11-25T20:10:00Z'
    },
    {
      id: 'STX-2611-8814', userId: 'usr-buyer-15', scheduleId: 'SCH-1012', routeId: 'rt-my-btm-sl',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Irwan Syahputra', gender: 'Male', dob: '1989-07-23', nationality: 'Indonesia', passportNumber: 'C1129045', passportExpiry: '2030-07-23', email: 'irwan.syah@gmail.com', phone: '+62 812-8899-0011', seat: 'E09' },
        { fullName: 'Maya Sari', gender: 'Female', dob: '1991-12-01', nationality: 'Indonesia', passportNumber: 'C1129046', passportExpiry: '2030-12-01', email: 'maya.sari@gmail.com', phone: '+62 812-8899-0012', seat: 'E10' }
      ],
      ticketSubtotal: 990000, portFee: 130000, serviceFee: 20000, totalAmount: 1140000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Payment Submitted', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-MANDIRI-66721',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T10:40:00Z'
    },
    {
      id: 'STX-2611-8815', userId: 'usr-buyer-16', scheduleId: 'SCH-1001', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Tommy Gunawan', gender: 'Male', dob: '1984-03-11', nationality: 'Indonesia', passportNumber: 'C5543210', passportExpiry: '2029-03-11', email: 'tommy.g@gmail.com', phone: '+62 811-5566-7788', seat: 'F01' }
      ],
      ticketSubtotal: 430000, portFee: 65000, serviceFee: 15000, totalAmount: 510000,
      bookingStatus: 'Completed', paymentStatus: 'Verified', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261123-8815',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8815-F', createdAt: '2026-11-23T08:00:00Z'
    },
    {
      id: 'STX-2611-8816', userId: 'usr-buyer-17', scheduleId: 'SCH-1017', routeId: 'rt-btm-sin-hb',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Evelyn Tan', gender: 'Female', dob: '1995-06-30', nationality: 'Singapore', passportNumber: 'K1122334G', passportExpiry: '2032-06-30', email: 'evelyn.tan@sgmail.com', phone: '+65 8223 4455', seat: 'A19' }
      ],
      ticketSubtotal: 440000, portFee: 65000, serviceFee: 15000, totalAmount: 520000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'Credit / Debit Card', paymentProofRef: 'CARD-4111-2233',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8816-A', createdAt: '2026-11-25T21:15:00Z'
    },
    {
      id: 'STX-2611-8817', userId: 'usr-buyer-18', scheduleId: 'SCH-1002', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Rina Marlina', gender: 'Female', dob: '1993-02-08', nationality: 'Indonesia', passportNumber: 'C7788990', passportExpiry: '2030-02-08', email: 'rina.m@gmail.com', phone: '+62 813-4455-6677', seat: 'D12' }
      ],
      ticketSubtotal: 455000, portFee: 65000, serviceFee: 15000, totalAmount: 535000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Payment Submitted', paymentMethod: 'Bank Transfer', paymentProofRef: 'TRF-BRI-99201',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T11:05:00Z'
    },
    {
      id: 'STX-2611-8818', userId: 'usr-buyer-19', scheduleId: 'SCH-1004', routeId: 'rt-sin-btm-hf',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Benjamin Yeo', gender: 'Male', dob: '1987-09-05', nationality: 'Singapore', passportNumber: 'K5566778H', passportExpiry: '2031-09-05', email: 'ben.yeo@sgmail.com', phone: '+65 9445 6677', seat: 'C15' }
      ],
      ticketSubtotal: 450000, portFee: 65000, serviceFee: 15000, totalAmount: 530000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261125-8818',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8818-C', createdAt: '2026-11-25T12:30:00Z'
    },
    {
      id: 'STX-2611-8819', userId: 'usr-buyer-20', scheduleId: 'SCH-1006', routeId: 'rt-btm-my-ph',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Nadia Safira', gender: 'Female', dob: '1999-01-27', nationality: 'Malaysia', passportNumber: 'A33445566', passportExpiry: '2031-01-27', email: 'nadia.s@my.com', phone: '+60 11-2233 4455', seat: 'B08' }
      ],
      ticketSubtotal: 490000, portFee: 65000, serviceFee: 15000, totalAmount: 570000,
      bookingStatus: 'Completed', paymentStatus: 'Verified', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-BCA-554321',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8819-B', createdAt: '2026-11-22T15:10:00Z'
    },
    {
      id: 'STX-2611-8820', userId: 'usr-buyer-21', scheduleId: 'SCH-1009', routeId: 'rt-btm-sin-tm',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Bagus Prasetio', gender: 'Male', dob: '1991-10-18', nationality: 'Indonesia', passportNumber: 'C8899001', passportExpiry: '2030-10-18', email: 'bagus.p@gmail.com', phone: '+62 812-3344-9988', seat: 'A21' }
      ],
      ticketSubtotal: 440000, portFee: 65000, serviceFee: 15000, totalAmount: 520000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'QRIS', paymentProofRef: 'QRIS-20261125-8820',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8820-A', createdAt: '2026-11-25T18:20:00Z'
    },
    {
      id: 'STX-2611-8821', userId: 'usr-buyer-22', scheduleId: 'SCH-1011', routeId: 'rt-btm-sin-hb',
      tripType: 'one_way', travelDate: '2026-11-27',
      passengers: [
        { fullName: 'Jason Ong', gender: 'Male', dob: '1982-04-22', nationality: 'Singapore', passportNumber: 'K2233445J', passportExpiry: '2029-04-22', email: 'jason.ong@sgmail.com', phone: '+65 9556 7788', seat: 'C06' }
      ],
      ticketSubtotal: 435000, portFee: 65000, serviceFee: 15000, totalAmount: 515000,
      bookingStatus: 'Pending Payment', paymentStatus: 'Pending', paymentMethod: 'Credit / Debit Card', paymentProofRef: 'CARD-PENDING-8821',
      rejectionNote: '', ticketIssued: false, ticketCode: '', createdAt: '2026-11-26T11:30:00Z'
    },
    {
      id: 'STX-2611-8822', userId: 'usr-buyer-23', scheduleId: 'SCH-1014', routeId: 'rt-btm-sin-hf',
      tripType: 'one_way', travelDate: '2026-11-28',
      passengers: [
        { fullName: 'Lina Marlina', gender: 'Female', dob: '1994-11-12', nationality: 'Indonesia', passportNumber: 'C1100223', passportExpiry: '2031-11-12', email: 'lina.m@gmail.com', phone: '+62 818-9900-1122', seat: 'D08' }
      ],
      ticketSubtotal: 430000, portFee: 65000, serviceFee: 15000, totalAmount: 510000,
      bookingStatus: 'Confirmed', paymentStatus: 'Verified', paymentMethod: 'Virtual Account', paymentProofRef: 'VA-BNI-778899',
      rejectionNote: '', ticketIssued: true, ticketCode: 'BP-STX-8822-D', createdAt: '2026-11-25T22:00:00Z'
    }
  ],

  admins: [
    { id: 'adm-1', name: 'Fajar Pratama', email: 'admin@demo.com', role: 'Operations Lead', permissions: ['Verify Payment', 'Manage Schedules', 'Issue Tickets'], status: 'Active', lastActive: '2026-11-26 16:10' },
    { id: 'adm-2', name: 'Dewi Anggraini', email: 'dewi.ops@sasytix.id', role: 'Ticketing Officer', permissions: ['Verify Payment', 'View Bookings'], status: 'Active', lastActive: '2026-11-26 14:45' },
    { id: 'adm-3', name: 'Budi Santoso', email: 'budi.sched@sasytix.id', role: 'Schedule Coordinator', permissions: ['Manage Schedules', 'Manage Routes'], status: 'Inactive', lastActive: '2026-11-22 09:20' },
    { id: 'adm-4', name: 'Rina Kusuma', email: 'rina.fin@sasytix.id', role: 'Finance Verifier', permissions: ['Verify Payment', 'Export Reports'], status: 'Active', lastActive: '2026-11-26 15:30' },
    { id: 'adm-5', name: 'Agus Setiawan', email: 'agus.port@sasytix.id', role: 'Port Supervisor', permissions: ['View Bookings', 'Manage Passengers'], status: 'Active', lastActive: '2026-11-26 13:15' },
    { id: 'adm-6', name: 'Sari Wulandari', email: 'sari.cs@sasytix.id', role: 'Customer Support', permissions: ['View Bookings', 'Manage Passengers'], status: 'Active', lastActive: '2026-11-26 11:50' },
    { id: 'adm-7', name: 'Dodi Kurniawan', email: 'dodi.ops@sasytix.id', role: 'Ticketing Officer', permissions: ['Verify Payment', 'Issue Tickets'], status: 'Active', lastActive: '2026-11-26 10:05' },
    { id: 'adm-8', name: 'Nia Ramadhani', email: 'nia.sched@sasytix.id', role: 'Schedule Coordinator', permissions: ['Manage Schedules', 'Manage Routes'], status: 'Active', lastActive: '2026-11-25 18:40' },
    { id: 'adm-9', name: 'Eko Prasetyo', email: 'eko.audit@sasytix.id', role: 'Finance Verifier', permissions: ['Verify Payment', 'Export Reports'], status: 'Inactive', lastActive: '2026-11-18 16:00' },
    { id: 'adm-10', name: 'Maya Putri', email: 'maya.ops@sasytix.id', role: 'Operations Lead', permissions: ['Verify Payment', 'Manage Schedules', 'Manage Routes'], status: 'Active', lastActive: '2026-11-26 15:55' },
    { id: 'adm-11', name: 'Reza Pahlevi', email: 'reza.port@sasytix.id', role: 'Port Supervisor', permissions: ['View Bookings', 'Issue Tickets'], status: 'Active', lastActive: '2026-11-26 12:20' },
    { id: 'adm-12', name: 'Tania Wijaya', email: 'tania.cs@sasytix.id', role: 'Customer Support', permissions: ['View Bookings', 'Manage Passengers'], status: 'Active', lastActive: '2026-11-26 09:40' }
  ],

  monthlyTrend: [
    { month: 'Jun', bookings: 310, revenueM: 162 },
    { month: 'Jul', bookings: 385, revenueM: 204 },
    { month: 'Aug', bookings: 420, revenueM: 228 },
    { month: 'Sep', bookings: 398, revenueM: 215 },
    { month: 'Oct', bookings: 465, revenueM: 254 },
    { month: 'Nov', bookings: 512, revenueM: 289 }
  ]
};
