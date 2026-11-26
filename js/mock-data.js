window.SasyTix = window.SasyTix || {};

window.SasyTix.MOCK_DATA = {
  users: [
    {
      id: 'usr-buyer-1',
      name: 'Rina Kusuma',
      email: 'buyer@demo.com',
      password: 'demo123',
      role: 'buyer',
      phone: '+62 812-7700-1122',
      status: 'active',
      savedPassengers: [
        {
          fullName: 'Rina Kusuma',
          gender: 'Female',
          dob: '1995-04-12',
          nationality: 'Indonesia',
          passportNumber: 'C8842190',
          passportExpiry: '2030-04-12',
          email: 'buyer@demo.com',
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
    }
  ],

  operators: [
    { id: 'op-batamfast', name: 'Batam Fast Ferry', logo: 'assets/logos/operators/batam-fast-ferry.png', vessel: 'MV Batam Fast 18' },
    { id: 'op-sindo', name: 'Sindo Ferry', logo: 'assets/logos/operators/sindo-ferry.png', vessel: 'MV Sindo Express' },
    { id: 'op-majestic', name: 'Majestic Fast Ferry', logo: 'assets/logos/operators/majestic-fast-ferry.png', vessel: 'MV Majestic Dream' },
    { id: 'op-horizon', name: 'Horizon Fast Ferry', logo: 'assets/logos/operators/horizon-fast-ferry.png', vessel: 'MV Horizon 9' }
  ],

  schedules: [
    {
      id: 'SCH-1001',
      routeId: 'rt-btm-sin-hf',
      operatorId: 'op-batamfast',
      vessel: 'MV Batam Fast 18',
      date: '2026-11-27',
      departureTime: '07:00',
      arrivalTime: '07:50',
      price: 430000,
      quota: 42,
      booked: 18,
      facilities: ['Air Conditioning', 'Panoramic Cabin', 'Luggage 20kg', 'Life Jackets'],
      status: 'active'
    },
    {
      id: 'SCH-1002',
      routeId: 'rt-btm-sin-hf',
      operatorId: 'op-majestic',
      vessel: 'MV Majestic Dream',
      date: '2026-11-27',
      departureTime: '09:30',
      arrivalTime: '10:20',
      price: 455000,
      quota: 50,
      booked: 31,
      facilities: ['VIP Deck Option', 'Air Conditioning', 'Luggage 20kg', 'USB Charging'],
      status: 'active'
    },
    {
      id: 'SCH-1003',
      routeId: 'rt-btm-sin-hf',
      operatorId: 'op-sindo',
      vessel: 'MV Sindo Express',
      date: '2026-11-27',
      departureTime: '13:15',
      arrivalTime: '14:05',
      price: 425000,
      quota: 35,
      booked: 12,
      facilities: ['Air Conditioning', 'Luggage 20kg', 'Snack Bar'],
      status: 'active'
    },
    {
      id: 'SCH-1004',
      routeId: 'rt-sin-btm-hf',
      operatorId: 'op-batamfast',
      vessel: 'MV Batam Fast 12',
      date: '2026-11-27',
      departureTime: '10:45',
      arrivalTime: '11:35',
      price: 450000,
      quota: 45,
      booked: 22,
      facilities: ['Air Conditioning', 'Panoramic Cabin', 'Luggage 20kg'],
      status: 'active'
    },
    {
      id: 'SCH-1005',
      routeId: 'rt-sin-btm-hf',
      operatorId: 'op-horizon',
      vessel: 'MV Horizon 9',
      date: '2026-11-27',
      departureTime: '16:30',
      arrivalTime: '17:20',
      price: 465000,
      quota: 40,
      booked: 19,
      facilities: ['Business Cabin', 'Air Conditioning', 'Priority Boarding'],
      status: 'active'
    },
    {
      id: 'SCH-1006',
      routeId: 'rt-btm-my-ph',
      operatorId: 'op-batamfast',
      vessel: 'MV Puteri Express',
      date: '2026-11-27',
      departureTime: '08:15',
      arrivalTime: '09:45',
      price: 490000,
      quota: 36,
      booked: 14,
      facilities: ['Air Conditioning', 'Luggage 20kg', 'Sea View'],
      status: 'active'
    },
    {
      id: 'SCH-1007',
      routeId: 'rt-btm-my-sl',
      operatorId: 'op-sindo',
      vessel: 'MV Stulang Star',
      date: '2026-11-27',
      departureTime: '11:00',
      arrivalTime: '12:45',
      price: 480000,
      quota: 30,
      booked: 9,
      facilities: ['Air Conditioning', 'Luggage 20kg'],
      status: 'active'
    },
    {
      id: 'SCH-1008',
      routeId: 'rt-my-btm-ph',
      operatorId: 'op-batamfast',
      vessel: 'MV Puteri Express',
      date: '2026-11-27',
      departureTime: '14:30',
      arrivalTime: '16:00',
      price: 510000,
      quota: 36,
      booked: 11,
      facilities: ['Air Conditioning', 'Luggage 20kg', 'Sea View'],
      status: 'active'
    }
  ],

  bookings: [
    {
      id: 'STX-2611-8801',
      userId: 'usr-buyer-1',
      scheduleId: 'SCH-1001',
      routeId: 'rt-btm-sin-hf',
      tripType: 'one_way',
      travelDate: '2026-11-27',
      passengers: [
        {
          fullName: 'Rina Kusuma',
          gender: 'Female',
          dob: '1995-04-12',
          nationality: 'Indonesia',
          passportNumber: 'C8842190',
          passportExpiry: '2030-04-12',
          email: 'buyer@demo.com',
          phone: '+62 812-7700-1122',
          seat: 'A12'
        }
      ],
      ticketSubtotal: 430000,
      portFee: 65000,
      serviceFee: 15000,
      totalAmount: 510000,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Verified',
      paymentMethod: 'QRIS',
      paymentProofRef: 'QRIS-20261126-8801',
      rejectionNote: '',
      ticketIssued: true,
      ticketCode: 'BP-STX-8801-A',
      createdAt: '2026-11-25T10:15:00Z'
    },
    {
      id: 'STX-2611-8802',
      userId: 'usr-buyer-1',
      scheduleId: 'SCH-1006',
      routeId: 'rt-btm-my-ph',
      tripType: 'one_way',
      travelDate: '2026-11-28',
      passengers: [
        {
          fullName: 'Rina Kusuma',
          gender: 'Female',
          dob: '1995-04-12',
          nationality: 'Indonesia',
          passportNumber: 'C8842190',
          passportExpiry: '2030-04-12',
          email: 'buyer@demo.com',
          phone: '+62 812-7700-1122',
          seat: 'B04'
        },
        {
          fullName: 'Andi Wijaya',
          gender: 'Male',
          dob: '1993-09-21',
          nationality: 'Indonesia',
          passportNumber: 'C7731044',
          passportExpiry: '2029-08-15',
          email: 'andi@demo.com',
          phone: '+62 813-6611-2233',
          seat: 'B05'
        }
      ],
      ticketSubtotal: 980000,
      portFee: 130000,
      serviceFee: 20000,
      totalAmount: 1130000,
      bookingStatus: 'Pending Payment',
      paymentStatus: 'Payment Submitted',
      paymentMethod: 'Virtual Account',
      paymentProofRef: 'VA-BCA-99018231',
      rejectionNote: '',
      ticketIssued: false,
      ticketCode: '',
      createdAt: '2026-11-26T08:30:00Z'
    },
    {
      id: 'STX-2611-8795',
      userId: 'usr-buyer-2',
      scheduleId: 'SCH-1004',
      routeId: 'rt-sin-btm-hf',
      tripType: 'one_way',
      travelDate: '2026-11-26',
      passengers: [
        {
          fullName: 'Marcus Tan',
          gender: 'Male',
          dob: '1988-02-17',
          nationality: 'Singapore',
          passportNumber: 'K4519822D',
          passportExpiry: '2031-01-10',
          email: 'marcus.tan@example.com',
          phone: '+65 9123 4567',
          seat: 'C08'
        }
      ],
      ticketSubtotal: 450000,
      portFee: 65000,
      serviceFee: 15000,
      totalAmount: 530000,
      bookingStatus: 'Completed',
      paymentStatus: 'Verified',
      paymentMethod: 'Credit / Debit Card',
      paymentProofRef: 'CARD-4111-8892',
      rejectionNote: '',
      ticketIssued: true,
      ticketCode: 'BP-STX-8795-C',
      createdAt: '2026-11-20T14:20:00Z'
    },
    {
      id: 'STX-2611-8799',
      userId: 'usr-buyer-3',
      scheduleId: 'SCH-1002',
      routeId: 'rt-btm-sin-hf',
      tripType: 'one_way',
      travelDate: '2026-11-27',
      passengers: [
        {
          fullName: 'Nurul Aini',
          gender: 'Female',
          dob: '1997-11-03',
          nationality: 'Malaysia',
          passportNumber: 'A55201933',
          passportExpiry: '2029-11-03',
          email: 'nurul@example.com',
          phone: '+60 12-345 6789',
          seat: 'D02'
        }
      ],
      ticketSubtotal: 455000,
      portFee: 65000,
      serviceFee: 15000,
      totalAmount: 535000,
      bookingStatus: 'Cancelled',
      paymentStatus: 'Rejected',
      paymentMethod: 'Bank Transfer',
      paymentProofRef: 'TRF-MANDIRI-0019',
      rejectionNote: 'Nominal transfer tidak sesuai total tagihan invoice.',
      ticketIssued: false,
      ticketCode: '',
      createdAt: '2026-11-24T16:40:00Z'
    }
  ],

  admins: [
    {
      id: 'adm-1',
      name: 'Fajar Pratama',
      email: 'admin@demo.com',
      role: 'Operations Lead',
      permissions: ['Verify Payment', 'Manage Schedules', 'Issue Tickets'],
      status: 'Active',
      lastActive: '2026-11-26 16:10'
    },
    {
      id: 'adm-2',
      name: 'Dewi Anggraini',
      email: 'dewi.ops@sasytix.demo',
      role: 'Ticketing Officer',
      permissions: ['Verify Payment', 'View Bookings'],
      status: 'Active',
      lastActive: '2026-11-26 14:45'
    },
    {
      id: 'adm-3',
      name: 'Budi Santoso',
      email: 'budi.sched@sasytix.demo',
      role: 'Schedule Coordinator',
      permissions: ['Manage Schedules', 'Manage Routes'],
      status: 'Inactive',
      lastActive: '2026-11-22 09:20'
    }
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
