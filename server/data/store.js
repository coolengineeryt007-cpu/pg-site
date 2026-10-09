import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  "users": [
    {
      "id": "usr-super-1",
      "name": "Vikramaditya Singhania",
      "email": "superadmin@luxurypg.com",
      "password": "Super@123",
      "role": "superadmin",
      "phone": "+91 99999 11111",
      "createdAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "id": "usr-super-2",
      "name": "Ananya Deshmukh",
      "email": "admin2@luxurypg.com",
      "password": "Super@123",
      "role": "superadmin",
      "phone": "+91 99999 22222",
      "createdAt": "2025-01-05T10:00:00.000Z"
    },
    {
      "id": "usr-owner-1",
      "name": "Rajesh Sharma",
      "email": "rajesh@royalpg.com",
      "password": "Owner@123",
      "role": "owner",
      "phone": "+91 98765 43210",
      "createdAt": "2025-01-10T10:00:00.000Z"
    },
    {
      "id": "usr-owner-2",
      "name": "Priya Malhotra",
      "email": "priya@elitepg.com",
      "password": "Owner@123",
      "role": "owner",
      "phone": "+91 98111 87654",
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": "usr-tenant-1",
      "name": "Aakash Mehta",
      "email": "aakash@gmail.com",
      "password": "User@123",
      "role": "tenant",
      "phone": "+91 91234 56789",
      "createdAt": "2025-02-01T10:00:00.000Z"
    }
  ],
  "pgs": [
    {
      "id": "pg-pride-classic-rajkot",
      "name": "Pride Classic Luxury PG",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "gender": "Co-ed",
      "status": "approved",
      "featured": true,
      "rating": 4.98,
      "reviewsCount": 38,
      "rent": 12500,
      "deposit": 18000,
      "noticePeriodDays": 30,
      "description": "Ultra-luxury executive coliving at Pride Classic, Yogi Nagar, Rajkot. Specially curated for professionals and scholars with 3-time Gujarati & Kathiyawadi homestyle meals, ultra high-speed fiber internet, private gym, and 24x7 biometric security.",
      "photos": [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Pride Classic",
        "addressLine1": "Yogi Nagar Main Road, Raiya Area",
        "addressLine2": "Near 150 Feet Ring Road",
        "area": "Yogi Nagar",
        "city": "Rajkot",
        "district": "Rajkot",
        "state": "Gujarat",
        "pincode": "360005",
        "lat": 22.2934,
        "lng": 70.7549
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Private Suite",
          "beds": 1,
          "rent": 18000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Executive",
          "beds": 2,
          "rent": 12500,
          "available": 4,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r3",
          "type": "Triple Sharing Comfort",
          "beds": 3,
          "rent": 8500,
          "available": 3,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "High-Speed Fiber WiFi (300 Mbps)",
        "3-Time Gourmet Buffet (Pure Veg & Jain)",
        "Air Conditioning (AC)",
        "Daily Housekeeping",
        "24x7 Power Backup",
        "RO Purified Water",
        "Biometric Smart Lock",
        "CCTV Security Coverage",
        "Fitness Gym & Yoga Zone",
        "Automatic Laundry & Ironing",
        "Attached Balcony & Geyser"
      ],
      "rules": [
        "Gate closes at 11:30 PM (biometric access after)",
        "Pure vegetarian and hygienic premises",
        "Lobby guest visiting allowed until 9:00 PM"
      ],
      "createdAt": "2026-10-08T07:00:00.000Z",
      "statusUpdatedAt": "2026-10-08T07:00:00.000Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Students & Working Professionals"
    },
    {
      "id": "pg-1791400226514",
      "name": "The Grand Sapphire Suites",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "gender": "Co-ed",
      "status": "approved",
      "featured": false,
      "rating": 5,
      "reviewsCount": 0,
      "rent": 17000,
      "deposit": 25000,
      "noticePeriodDays": 30,
      "description": "Modern luxury PG accommodation.",
      "photos": [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Sapphire Heights",
        "addressLine1": "Indiranagar 100ft Road",
        "addressLine2": "Near Metro",
        "area": "Indiranagar",
        "city": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "pincode": "560038",
        "lat": 12.9784,
        "lng": 77.6408
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Luxury Suite",
          "beds": 1,
          "rent": 22100,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Room",
          "beds": 2,
          "rent": 17000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "High-Speed WiFi",
        "Daily Housekeeping",
        "Air Conditioning",
        "RO Drinking Water",
        "24x7 Power Backup"
      ],
      "rules": [
        "Gate closes at 11:30 PM",
        "No smoking in bedrooms"
      ],
      "createdAt": "2026-10-07T19:10:26.514Z",
      "statusUpdatedAt": "2026-10-07T19:10:26.522Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Students & Working Professionals"
    },
    {
      "id": "pg-101",
      "name": "The Imperial Crown Luxury Coliving",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "gender": "Co-ed",
      "status": "approved",
      "featured": true,
      "rating": 4.9,
      "reviewsCount": 42,
      "rent": 16500,
      "deposit": 25000,
      "noticePeriodDays": 30,
      "description": "Ultra-luxury executive living curated for tech professionals and students. Offers chef-curated 3-time meals, high-speed fiber internet, private gym, gaming lounge, and automated biometric surveillance.",
      "photos": [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Imperial Heights, Tower B",
        "addressLine1": "Plot 88, Mindspace IT Park Road",
        "addressLine2": "Beside Inorbit Mall, Madhapur",
        "area": "Madhapur",
        "city": "Hyderabad",
        "district": "Rangareddy",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4375,
        "lng": 78.3812
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Private Suite",
          "beds": 1,
          "rent": 24000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Luxury",
          "beds": 2,
          "rent": 16500,
          "available": 5,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r3",
          "type": "Triple Sharing Standard",
          "beds": 3,
          "rent": 11500,
          "available": 3,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "High-Speed Fiber WiFi",
        "3-Time Gourmet Buffet",
        "Air Conditioning (AC)",
        "Daily Housekeeping",
        "24x7 Power Backup",
        "RO Purified Water",
        "Biometric Smart Lock",
        "CCTV Security Coverage",
        "Fitness Gym & Yoga Deck",
        "Recreation & PS5 Lounge",
        "Automatic Laundry & Ironing",
        "Attached Balcony & Geyser"
      ],
      "rules": [
        "Gate closes at 11:30 PM (biometric pass after)",
        "Strictly non-smoking interior zones",
        "Guests allowed in ground floor luxury lounge until 9:00 PM"
      ],
      "createdAt": "2025-01-12T10:00:00.000Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Students & Working Professionals"
    },
    {
      "id": "pg-102",
      "name": "The Royal Mirage Women's Palace",
      "ownerId": "usr-owner-2",
      "ownerName": "Priya Malhotra",
      "ownerPhone": "+91 98111 87654",
      "ownerWhatsapp": "+919811187654",
      "gender": "Girls",
      "status": "approved",
      "featured": true,
      "rating": 4.95,
      "reviewsCount": 56,
      "rent": 14000,
      "deposit": 20000,
      "noticePeriodDays": 30,
      "description": "Dedicated safe haven for female scholars and working women. Features 3-tier security, biometric facial recognition, nutritious dietitian-approved meals, and lavish interiors.",
      "photos": [
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Mirage Crest Villa No. 12",
        "addressLine1": "100 Feet Road, 4th Block",
        "addressLine2": "Opposite Sony World Signal, Koramangala",
        "area": "Koramangala",
        "city": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "pincode": "560034",
        "lat": 12.9352,
        "lng": 77.6245
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Elite Suite",
          "beds": 1,
          "rent": 22000,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Executive",
          "beds": 2,
          "rent": 14000,
          "available": 3,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        },
        {
          "id": "r3",
          "type": "Triple Sharing Cozy",
          "beds": 3,
          "rent": 10000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "24x7 Female Security & CCTV",
        "High-Speed Fiber WiFi",
        "Fresh Homestyle Vegetarian & Egg Meals",
        "Air Conditioning (AC)",
        "Daily Room Cleaning",
        "Power Backup & Inverter",
        "RO Drinking Water",
        "Washing Machine & Drying Terrace",
        "Study Desks with LED Lamps",
        "Cafeteria & Terrace Garden"
      ],
      "rules": [
        "Female visitors only inside living corridors",
        "Gate closes at 11:00 PM (Prior notification required)",
        "Alcohol and smoking strictly banned"
      ],
      "createdAt": "2025-01-18T10:00:00.000Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Female Students & Working Women"
    },
    {
      "id": "pg-103",
      "name": "The Monarch Suites for Gentlemen",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "gender": "Boys",
      "status": "approved",
      "featured": false,
      "rating": 4.8,
      "reviewsCount": 29,
      "rent": 13500,
      "deposit": 18000,
      "noticePeriodDays": 30,
      "description": "Sophisticated bachelor residence adjacent to DLF Cyber City. Tailored for corporate executives and aspiring interns with private workstation setups, healthy buffet food, and superfast connectivity.",
      "photos": [
        "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Monarch Residency, Tower 4",
        "addressLine1": "Golf Course Extension Road, Sector 54",
        "addressLine2": "Near Rapid Metro Station",
        "area": "Sector 54",
        "city": "Gurugram",
        "district": "Gurugram",
        "state": "Haryana",
        "pincode": "122002",
        "lat": 28.4385,
        "lng": 77.1082
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Deluxe Room",
          "beds": 1,
          "rent": 20000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Room",
          "beds": 2,
          "rent": 13500,
          "available": 6,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "High-Speed Fiber WiFi",
        "3 Meals (North & South Indian)",
        "Air Conditioning (AC)",
        "Biometric Security Entry",
        "24x7 Power Backup",
        "Car & Bike Reserved Parking",
        "Modern Gymnasium",
        "Attached Geyser & Solar Water"
      ],
      "rules": [
        "Biometric entry allows 24/7 flexible access",
        "Quiet hours 11:00 PM to 6:00 AM",
        "Zero drug policy"
      ],
      "createdAt": "2025-01-20T10:00:00.000Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Bachelors & Students"
    },
    {
      "id": "pg-104",
      "name": "Aura Royale Premier Living",
      "ownerId": "usr-owner-2",
      "ownerName": "Priya Malhotra",
      "ownerPhone": "+91 98111 87654",
      "ownerWhatsapp": "+919811187654",
      "gender": "Co-ed",
      "status": "approved",
      "featured": true,
      "rating": 4.88,
      "reviewsCount": 33,
      "rent": 15500,
      "deposit": 22000,
      "noticePeriodDays": 30,
      "description": "Designer co-living sanctuary in Hinjewadi Phase 1 with co-working pods, infinity terrace lounge, and gourmet pantry services.",
      "photos": [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Aura Signature Enclave",
        "addressLine1": "Hinjewadi Tech Corridor, Phase 1",
        "addressLine2": "Opposite Wipro Circle",
        "area": "Hinjewadi",
        "city": "Pune",
        "district": "Pune",
        "state": "Maharashtra",
        "pincode": "411057",
        "lat": 18.5912,
        "lng": 73.7389
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Penthouse Suite",
          "beds": 1,
          "rent": 23500,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Luxury",
          "beds": 2,
          "rent": 15500,
          "available": 4,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r3",
          "type": "Triple Sharing Cozy",
          "beds": 3,
          "rent": 11000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "High-Speed WiFi (300 Mbps)",
        "3 Meals Buffet + Evening High Tea",
        "Smart TV in Common Lounge",
        "Daily Housekeeping & Linen Change",
        "Power Backup 24 Hours",
        "Table Tennis & Board Games",
        "RO Water Dispenser",
        "Biometric Security"
      ],
      "rules": [
        "Maintain decorum in co-working common spaces",
        "Gate closes at 12:00 AM",
        "Visitors welcome till 8:30 PM"
      ],
      "createdAt": "2025-01-25T10:00:00.000Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Students & Working Professionals"
    },
    {
      "id": "pg-105",
      "name": "The Golden Crest Executive PG",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "gender": "Co-ed",
      "status": "approved",
      "featured": false,
      "rating": 4.7,
      "reviewsCount": 12,
      "rent": 14500,
      "deposit": 20000,
      "noticePeriodDays": 30,
      "description": "Brand-new property submitted by Rajesh Sharma currently awaiting Super Admin verification. Equipped with acoustic sound-proofing and ergonomic workstations.",
      "photos": [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Golden Crest Residency, Flat 301",
        "addressLine1": "Outer Ring Road, Marathahalli",
        "addressLine2": "Behind Prestige Tech Park",
        "area": "Marathahalli",
        "city": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "pincode": "560037",
        "lat": 12.9569,
        "lng": 77.7011
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Twin Sharing Room",
          "beds": 2,
          "rent": 14500,
          "available": 6,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        }
      ],
      "facilities": [
        "High-Speed Fiber WiFi",
        "Food Included (Breakfast & Dinner)",
        "Air Conditioning (AC)",
        "Daily Housekeeping",
        "Power Backup",
        "RO Purified Water",
        "CCTV Surveillance"
      ],
      "rules": [
        "No smoking indoors",
        "Gate closes 11:30 PM"
      ],
      "createdAt": "2025-02-05T14:30:00.000Z",
      "statusReason": "",
      "statusUpdatedAt": "2026-10-07T19:43:45.985Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Students & Working Professionals"
    },
    {
      "id": "pg-106",
      "name": "The Velvet Horizon Luxury Stays",
      "ownerId": "usr-owner-2",
      "ownerName": "Priya Malhotra",
      "ownerPhone": "+91 98111 87654",
      "ownerWhatsapp": "+919811187654",
      "gender": "Girls",
      "status": "approved",
      "featured": false,
      "rating": 4.85,
      "reviewsCount": 8,
      "rent": 16000,
      "deposit": 25000,
      "noticePeriodDays": 30,
      "description": "Sophisticated boutique ladies PG in Bandra West with Scandinavian modern finishings and 24x7 security warden.",
      "photos": [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Velvet Horizon Building",
        "addressLine1": "Hill Road, Near Bandra Station",
        "addressLine2": "Opposite St. Peter's Church",
        "area": "Bandra West",
        "city": "Mumbai",
        "district": "Mumbai Suburban",
        "state": "Maharashtra",
        "pincode": "400050",
        "lat": 19.0553,
        "lng": 72.8301
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Single Private Studio",
          "beds": 1,
          "rent": 26000,
          "available": 2,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Twin Sharing Deluxe",
          "beds": 2,
          "rent": 16000,
          "available": 4,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        }
      ],
      "facilities": [
        "24x7 CCTV & Warden",
        "High-Speed Fiber WiFi",
        "Pure Vegetarian & Jain Meals Available",
        "Air Conditioning (AC)",
        "Daily Housekeeping",
        "Washing Machine & Steam Iron"
      ],
      "rules": [
        "Strictly ladies only",
        "Gate closes at 11:00 PM"
      ],
      "createdAt": "2025-02-06T09:15:00.000Z",
      "statusReason": "",
      "statusUpdatedAt": "2026-10-07T19:43:47.591Z",
      "propertyType": "pg",
      "propertyTypeLabel": "Luxury PG & Coliving",
      "bhk": "Single / Shared",
      "furnishing": "Fully Furnished",
      "suitableFor": "Female Students & Working Women"
    },
    {
      "id": "house-rajkot-harmony",
      "name": "Harmony Heights 2BHK Family Flat",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "propertyType": "house",
      "propertyTypeLabel": "Rental House / Flat",
      "bhk": "2BHK",
      "furnishing": "Semi-Furnished",
      "suitableFor": "Families & Working Professionals",
      "gender": "Family",
      "status": "approved",
      "featured": true,
      "rating": 4.95,
      "reviewsCount": 22,
      "rent": 18500,
      "deposit": 35000,
      "noticePeriodDays": 30,
      "description": "Spacious and well-ventilated 2BHK flat in prime Yogi Nagar / Kalawad Road, Rajkot. Perfect for families and working executives with modular kitchen, private balconies, 24-hr water supply, lift, and covered parking.",
      "photos": [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Harmony Heights Flat 402",
        "addressLine1": "Kalawad Road, Near Swaminarayan Temple",
        "addressLine2": "Beside 150 Feet Ring Road",
        "area": "Yogi Nagar",
        "city": "Rajkot",
        "district": "Rajkot",
        "state": "Gujarat",
        "pincode": "360005",
        "lat": 22.289,
        "lng": 70.761
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Master Bedroom + Attached Bath",
          "beds": 1,
          "rent": 18500,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "Children / Guest Bedroom",
          "beds": 1,
          "rent": 0,
          "available": 1,
          "washroom": "Common",
          "ac": false,
          "balcony": true
        }
      ],
      "facilities": [
        "Reserved Covered Car Parking",
        "24x7 Municipal & Borewell Water",
        "Elevator (Lift) with Inverter Backup",
        "Modular Kitchen with Piped Gas",
        "2 Spacious Balconies with Open View",
        "Gated Society with CCTV Security",
        "Children Play Area & Society Garden"
      ],
      "rules": [
        "Family or working corporate tenants preferred",
        "Society maintenance due on 5th of each month",
        "Quiet residential community decorum"
      ],
      "createdAt": "2026-10-09T08:00:00.000Z"
    },
    {
      "id": "room-rajkot-greenview",
      "name": "Greenview 1RK Furnished Rental Room",
      "ownerId": "usr-owner-1",
      "ownerName": "Rajesh Sharma",
      "ownerPhone": "+91 98765 43210",
      "ownerWhatsapp": "+919876543210",
      "propertyType": "room",
      "propertyTypeLabel": "Private Rental Room",
      "bhk": "1RK Studio",
      "furnishing": "Fully Furnished",
      "suitableFor": "Students & Working Bachelors",
      "gender": "Co-ed",
      "status": "approved",
      "featured": true,
      "rating": 4.88,
      "reviewsCount": 16,
      "rent": 8000,
      "deposit": 15000,
      "noticePeriodDays": 30,
      "description": "Independent fully furnished 1RK studio room on Raiya Road, Rajkot. Features private entrance, attached western bathroom, comfortable wooden bed with mattress, wardrobe, study table, and high-speed WiFi.",
      "photos": [
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Greenview Residency, 2nd Floor",
        "addressLine1": "Raiya Road, Near Telephone Exchange",
        "addressLine2": "Opposite Reliance Fresh",
        "area": "Raiya Road",
        "city": "Rajkot",
        "district": "Rajkot",
        "state": "Gujarat",
        "pincode": "360007",
        "lat": 22.2965,
        "lng": 70.768
      },
      "rooms": [
        {
          "id": "r1",
          "type": "1RK Private Furnished Studio",
          "beds": 1,
          "rent": 8000,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "High-Speed Fiber WiFi (200 Mbps)",
        "Attached Western Washroom & Geyser",
        "Comfortable Bed with Orthopedic Mattress",
        "Work Desk, Chair & Wardrobe",
        "RO Purified Water Supply",
        "Two-Wheeler Dedicated Parking",
        "Independent Private Access Key"
      ],
      "rules": [
        "Single working bachelor or student",
        "Clean and hygienic upkeep of private room",
        "No loud parties post 11:00 PM"
      ],
      "createdAt": "2026-10-09T08:30:00.000Z"
    },
    {
      "id": "house-bengaluru-prestige",
      "name": "Prestige Silver Oak 3BHK Luxury Residence",
      "ownerId": "usr-owner-2",
      "ownerName": "Priya Malhotra",
      "ownerPhone": "+91 98111 87654",
      "ownerWhatsapp": "+919811187654",
      "propertyType": "house",
      "propertyTypeLabel": "Rental House / Flat",
      "bhk": "3BHK",
      "furnishing": "Fully Furnished",
      "suitableFor": "Families & Corporate Executives",
      "gender": "Family",
      "status": "approved",
      "featured": true,
      "rating": 4.97,
      "reviewsCount": 31,
      "rent": 46000,
      "deposit": 90000,
      "noticePeriodDays": 30,
      "description": "Premium fully-furnished 3BHK flat in Koramangala 4th Block, Bengaluru. Equipped with Italian marble flooring, 3 AC bedrooms, smart home lighting, modular kitchen with chimney, and 2 covered car parks.",
      "photos": [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Prestige Silver Oak Tower C",
        "addressLine1": "80 Feet Road, 4th Block",
        "addressLine2": "Near Maharaja Signal",
        "area": "Koramangala",
        "city": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "pincode": "560034",
        "lat": 12.934,
        "lng": 77.629
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Master Suite + Bathtub",
          "beds": 1,
          "rent": 46000,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r2",
          "type": "2nd Bedroom + Attached Bath",
          "beds": 1,
          "rent": 0,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        },
        {
          "id": "r3",
          "type": "3rd Guest/Study Room",
          "beds": 1,
          "rent": 0,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": false
        }
      ],
      "facilities": [
        "2 Covered Car Parking Slots",
        "Clubhouse, Swimming Pool & Gym Access",
        "100% Full Power Backup (Generators)",
        "High-Speed Fiber WiFi Ready",
        "Modular Kitchen with Chimney & Piped Gas",
        "3 Attached Balconies with Skyline View",
        "24x7 Security Guards & Intercom"
      ],
      "rules": [
        "Family or corporate working executives preferred",
        "Standard agreement with 1-month notice",
        "Gated community bylaws apply"
      ],
      "createdAt": "2026-10-09T08:45:00.000Z"
    },
    {
      "id": "room-pune-studio",
      "name": "Tech Hub 1RK Executive Studio",
      "ownerId": "usr-owner-2",
      "ownerName": "Priya Malhotra",
      "ownerPhone": "+91 98111 87654",
      "ownerWhatsapp": "+919811187654",
      "propertyType": "room",
      "propertyTypeLabel": "Private Rental Room",
      "bhk": "1RK Studio",
      "furnishing": "Fully Furnished",
      "suitableFor": "Working Professionals & IT Executives",
      "gender": "Co-ed",
      "status": "approved",
      "featured": false,
      "rating": 4.84,
      "reviewsCount": 14,
      "rent": 11500,
      "deposit": 20000,
      "noticePeriodDays": 30,
      "description": "Modern independent 1RK studio room in Hinjewadi Phase 1, Pune. Custom designed for IT professionals working at Wipro, Infosys, and TCS. Includes high-speed Wi-Fi, air conditioning, microwave, mini-fridge, and daily maintenance.",
      "photos": [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80"
      ],
      "address": {
        "apartment": "Tech Horizon Suites",
        "addressLine1": "Hinjewadi IT Park Road, Phase 1",
        "addressLine2": "Opposite Cognizant Campus",
        "area": "Hinjewadi",
        "city": "Pune",
        "district": "Pune",
        "state": "Maharashtra",
        "pincode": "411057",
        "lat": 18.594,
        "lng": 73.735
      },
      "rooms": [
        {
          "id": "r1",
          "type": "Executive 1RK Furnished Studio",
          "beds": 1,
          "rent": 11500,
          "available": 1,
          "washroom": "Attached",
          "ac": true,
          "balcony": true
        }
      ],
      "facilities": [
        "High-Speed Fiber Internet (300 Mbps)",
        "Air Conditioning (AC)",
        "Work Desk & Ergonomic Chair",
        "Mini Fridge & Microwave Access",
        "Attached Western Washroom & Geyser",
        "Power Backup & Inverter",
        "Reserved Two-Wheeler Parking"
      ],
      "rules": [
        "Working IT / Corporate professionals",
        "No loud noise during night hours",
        "Visitor entry allowed during daytime"
      ],
      "createdAt": "2026-10-09T09:00:00.000Z"
    }
  ],
  "blogs": [
    {
      "id": "blog-1",
      "slug": "ultimate-guide-finding-luxury-pg-hyderabad-bengaluru",
      "title": "The Ultimate Guide to Finding a Luxury PG in 2025: Tech Parks, Amenities & Pricing",
      "excerpt": "Everything you need to evaluate before signing a PG agreement: from hidden electricity tariffs to food menus and commute distances.",
      "content": "### Why Modern Professionals Prefer Luxury Coliving Over Traditional PGs\nFor decades, paying guest accommodations were synonymous with cramped shared rooms, lukewarm food, and rigid restrictions. However, the rise of tech hubs like Hyderabad's Hitec City and Bengaluru's Koramangala has sparked a luxury coliving revolution.\n\n#### 1. Zero Deposit Traps & Transparent Contracts\nIn traditional rentals, landlords frequently deduct exorbitant amounts from security deposits. Modern premium platforms mandate standardized deposit refund rules (typically capped at 1-2 months rent with 30-day notice periods).\n\n#### 2. High-Speed Internet & Dedicated Workstations\nWith hybrid working models now the industry benchmark, having dual-band fiber internet with power backup is non-negotiable. Top luxury PGs now offer dedicated ergonomics in each room along with quiet co-working lounges.\n\n#### 3. Nutrition-First Chef Menus\nSay goodbye to repetitive menus. Modern luxury PGs employ qualified kitchen teams serving varied breakfast buffets, wholesome regional dinners, and hygienic RO water setups.\n\n#### 4. Safety & Biometric Automation\nFacial recognition and digital entry codes guarantee that unauthorized individuals cannot enter your living floors while granting you 24/7 entry autonomy without worrying about curfew interrogations.",
      "coverImage": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "author": "Vikramaditya Singhania",
      "authorRole": "Founder & CEO",
      "readTime": "5 min read",
      "tags": [
        "PG Living",
        "Student Guide",
        "Coliving Trends",
        "Tech Hubs"
      ],
      "publishedAt": "2025-01-20"
    },
    {
      "id": "blog-2",
      "slug": "single-vs-twin-sharing-pg-cost-benefit-breakdown",
      "title": "Single Room vs. Twin Sharing: A Comprehensive Cost & Privacy Breakdown",
      "excerpt": "Deciding between private solitude and budget savings? Here is an analytical comparison of total monthly expenses and lifestyle impact.",
      "content": "### Balancing Personal Space with Your Monthly Budget\nWhen searching for accommodation near universities or offices, one of the biggest questions is whether to spend extra for a private single room or opt for a twin-sharing arrangement.\n\n#### Financial Overview\n- **Single Room:** Typically ranges from ₹18,000 to ₹25,000/month. You get uninterrupted focus, private washroom usage, and personal sleep schedule freedom.\n- **Twin Sharing:** Ranges from ₹12,000 to ₹16,000/month. You save up to 40% on rent and shared electricity bills, leaving more disposable income for hobbies and savings.\n\n#### Social Synergy\nSharing a room often provides immediate companionship when relocating to a new city, making networking and city exploration much easier for new college students or junior associates.",
      "coverImage": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "author": "Aanya Verma",
      "authorRole": "Head of Community",
      "readTime": "4 min read",
      "tags": [
        "Budgeting",
        "Coliving",
        "Lifestyle"
      ],
      "publishedAt": "2025-01-28"
    },
    {
      "id": "blog-3",
      "slug": "10-essential-things-to-check-during-pg-inspection",
      "title": "10 Critical Things to Verify During Your In-Person PG Visit",
      "excerpt": "Do not finalize your room based solely on online photos. Use this bulletproof inspection checklist before paying the token advance.",
      "content": "### The Golden Inspection Checklist\nPhotos online can be beautifully staged with wide-angle lenses. Here are the 10 crucial parameters you must physically verify:\n\n1. **Water Pressure & Geyser Functionality:** Run the taps in the washroom to ensure steady pressure and no drainage clogs.\n2. **Cellular Signal Strength:** Check mobile reception for Airtel and Jio inside the specific room corner.\n3. **Mattress Quality:** Confirm high-density orthopedic or foam mattresses rather than worn spring units.\n4. **Window Ventilation:** Ensure proper cross-ventilation and mosquito mesh on balconies.\n5. **Kitchen Hygiene:** Request a quick peek at the culinary preparation area and storage cleanliness.\n6. **Washing Machine Ratio:** Ensure at least 1 washing machine for every 10-12 residents.\n7. **Emergency Power Backup:** Ask whether air conditioning or only ceiling fans run during power cuts.\n8. **Visitor Rules:** Clarify policy regarding siblings, parents, and friends.\n9. **Notice Period Clarity:** Confirm written agreement terms for departure notice.\n10. **Surrounding Neighborhood Safety:** Walk around the street at 8 PM to gauge street lighting and accessibility.",
      "coverImage": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "author": "Priya Malhotra",
      "authorRole": "Co-Founder & Operations Lead",
      "readTime": "6 min read",
      "tags": [
        "Inspection Checklist",
        "Tenant Rights",
        "Safety"
      ],
      "publishedAt": "2025-02-02"
    }
  ],
  "inquiries": [
    {
      "id": "inq-1",
      "pgId": "pg-101",
      "pgName": "The Imperial Crown Luxury Coliving",
      "ownerId": "usr-owner-1",
      "userName": "Karan Johar",
      "userPhone": "+91 98888 77777",
      "userEmail": "karan@example.com",
      "sharingType": "Single Private Suite",
      "visitDate": "2025-02-15",
      "message": "Looking to move in next week. Please confirm single room availability.",
      "status": "new",
      "createdAt": "2025-02-07T11:00:00.000Z"
    }
  ],
  "reviews": [
    {
      "id": "rev-1",
      "pgId": "pg-101",
      "userName": "Siddharth Rao",
      "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      "rating": 5,
      "date": "February 2025",
      "role": "Software Engineer at Google",
      "comment": "Living at Imperial Crown feels like an all-inclusive 5-star hotel. The food variety is outstanding and the high-speed fiber internet has never stuttered once during my night deployments."
    },
    {
      "id": "rev-2",
      "pgId": "pg-102",
      "userName": "Shruti Sen",
      "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      "rating": 5,
      "date": "January 2025",
      "role": "MBA Scholar",
      "comment": "Unmatched safety and serenity. The female warden is polite and cooperative, and the proximity to Koramangala cafes makes it the best decision of my student life."
    }
  ]
};

// Ensure db.json exists in target location (copy from bundled db.json if running on Vercel)
if (!fs.existsSync(DB_FILE)) {
  const bundledDB = path.join(__dirname, 'db.json');
  if (fs.existsSync(bundledDB)) {
    try {
      fs.copyFileSync(bundledDB, DB_FILE);
    } catch (e) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    }
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  }
}

export const readDB = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB file, reinitializing default data:', err);
    return INITIAL_DATA;
  }
};

export const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to DB file:', err);
    return false;
  }
};

// Haversine formula to compute distance between two lat/lng in kilometers
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place (e.g. 1.4 km)
};
