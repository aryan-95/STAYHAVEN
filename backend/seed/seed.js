const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stayhaven';

const SAMPLE_IMAGES = {
  beach: [
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', publicId: 'beach1' },
    { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', publicId: 'beach2' },
    { url: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800', publicId: 'beach3' }
  ],
  mountain: [
    { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', publicId: 'mtn1' },
    { url: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800', publicId: 'mtn2' },
    { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', publicId: 'mtn3' }
  ],
  city: [
    { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', publicId: 'city1' },
    { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', publicId: 'city2' },
    { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', publicId: 'city3' }
  ],
  cabin: [
    { url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800', publicId: 'cabin1' },
    { url: 'https://images.unsplash.com/photo-1542718610-a1a5acea6b10?w=800', publicId: 'cabin2' },
    { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800', publicId: 'cabin3' }
  ],
  villa: [
    { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', publicId: 'villa1' },
    { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', publicId: 'villa2' },
    { url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800', publicId: 'villa3' }
  ],
  treehouse: [
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', publicId: 'tree1' },
    { url: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=800', publicId: 'tree2' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', publicId: 'tree3' }
  ]
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@stayhaven.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Platform administrator'
    });

    const hosts = await User.create([
      {
        name: 'Sarah Chen',
        email: 'sarah@stayhaven.com',
        password: 'host123',
        role: 'host',
        avatar: 'https://i.pravatar.cc/150?img=5',
        bio: 'Travel enthusiast and superhost. I love welcoming guests from around the world!',
        phone: '+1-555-0101',
        address: { city: 'Malibu', country: 'USA' }
      },
      {
        name: 'Marco Rossi',
        email: 'marco@stayhaven.com',
        password: 'host123',
        role: 'host',
        avatar: 'https://i.pravatar.cc/150?img=8',
        bio: 'Architecture lover with a passion for unique stays.',
        phone: '+39-555-0102',
        address: { city: 'Tuscany', country: 'Italy' }
      },
      {
        name: 'Yuki Tanaka',
        email: 'yuki@stayhaven.com',
        password: 'host123',
        role: 'host',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: 'Mountain guide and outdoor adventure host.',
        phone: '+81-555-0103',
        address: { city: 'Hokkaido', country: 'Japan' }
      }
    ]);

    const guests = await User.create([
      {
        name: 'James Wilson',
        email: 'james@example.com',
        password: 'guest123',
        role: 'guest',
        avatar: 'https://i.pravatar.cc/150?img=15',
        address: { city: 'New York', country: 'USA' }
      },
      {
        name: 'Emma Thompson',
        email: 'emma@example.com',
        password: 'guest123',
        role: 'guest',
        avatar: 'https://i.pravatar.cc/150?img=20',
        address: { city: 'London', country: 'UK' }
      },
      {
        name: 'Raj Patel',
        email: 'raj@example.com',
        password: 'guest123',
        role: 'guest',
        avatar: 'https://i.pravatar.cc/150?img=25',
        address: { city: 'Mumbai', country: 'India' }
      }
    ]);

    console.log('Users created');

    // Create properties
    const properties = await Property.create([
      {
        title: 'Sunset Beachfront Villa with Private Pool',
        description: 'Experience luxury at its finest in this stunning beachfront villa. Wake up to breathtaking ocean views and fall asleep to the sound of waves. The private pool overlooks the Pacific, and the fully equipped kitchen means you can cook gourmet meals whenever you like. Perfect for couples or families seeking a paradise escape.',
        category: 'beach',
        images: SAMPLE_IMAGES.beach,
        host: hosts[0]._id,
        location: { address: '123 Ocean Drive', city: 'Malibu', state: 'California', country: 'USA', coordinates: { lat: 34.0259, lng: -118.7798 } },
        pricePerNight: 450,
        cleaningFee: 80,
        guests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        amenities: ['WiFi', 'Pool', 'Kitchen', 'AC', 'Free Parking', 'BBQ Grill', 'Beach Access', 'Washer', 'Dryer'],
        rating: 4.9,
        reviewCount: 47,
        isFeatured: true,
        houseRules: { checkIn: '15:00', checkOut: '11:00', noSmoking: true, noPets: false, selfCheckIn: true }
      },
      {
        title: 'Cozy Mountain Cabin with Hot Tub & Fireplace',
        description: 'Escape to this charming mountain cabin nestled in the Rockies. With a wood-burning fireplace, private hot tub, and stunning mountain views, this is the perfect retreat for nature lovers. Hike directly from the property or simply relax and enjoy the serene wilderness.',
        category: 'cabin',
        images: SAMPLE_IMAGES.cabin,
        host: hosts[2]._id,
        location: { address: '456 Pine Ridge Rd', city: 'Aspen', state: 'Colorado', country: 'USA', coordinates: { lat: 39.1911, lng: -106.8175 } },
        pricePerNight: 280,
        cleaningFee: 60,
        guests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Kitchen', 'Free Parking', 'Ski Access', 'Heating', 'BBQ Grill'],
        rating: 4.8,
        reviewCount: 32,
        isFeatured: true
      },
      {
        title: 'Luxury Tuscan Villa with Vineyard Views',
        description: 'Live the Italian dream in this authentic Tuscan villa surrounded by rolling vineyards and olive groves. The property features a private pool, a fully equipped country kitchen, and stunning panoramic views of the Chianti hills. Complimentary wine tasting from the estate vineyard included.',
        category: 'villa',
        images: SAMPLE_IMAGES.villa,
        host: hosts[1]._id,
        location: { address: 'Via del Chianti 89', city: 'Greve in Chianti', state: 'Tuscany', country: 'Italy', coordinates: { lat: 43.5852, lng: 11.3186 } },
        pricePerNight: 520,
        cleaningFee: 100,
        guests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 3,
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Free Parking', 'Garden', 'BBQ Grill', 'Breakfast Included', 'Workspace'],
        rating: 4.95,
        reviewCount: 28,
        isFeatured: true
      },
      {
        title: 'Modern Manhattan Loft in Heart of SoHo',
        description: 'Stay in a sleek, modern loft in the vibrant SoHo neighborhood. This sun-filled space features exposed brick walls, 12-foot ceilings, and designer furnishings. Walking distance to top restaurants, galleries, and shopping. Perfect for business travelers and culture enthusiasts.',
        category: 'city',
        images: SAMPLE_IMAGES.city,
        host: hosts[0]._id,
        location: { address: '789 Broadway', city: 'New York', state: 'New York', country: 'USA', coordinates: { lat: 40.7230, lng: -74.0030 } },
        pricePerNight: 320,
        cleaningFee: 50,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'AC', 'Heating', 'Washer', 'Dryer', 'Workspace', 'TV', 'Gym'],
        rating: 4.7,
        reviewCount: 64,
        isFeatured: true
      },
      {
        title: 'Enchanted Forest Treehouse Retreat',
        description: 'Sleep among the treetops in this magical treehouse built 25 feet up in a 200-year-old oak tree. Completely off-grid with solar power and rainwater collection, yet all modern comforts are provided. A rope bridge connects to the observation deck with 360° forest views.',
        category: 'treehouse',
        images: SAMPLE_IMAGES.treehouse,
        host: hosts[2]._id,
        location: { address: '22 Forest Glen', city: 'Asheville', state: 'North Carolina', country: 'USA', coordinates: { lat: 35.5951, lng: -82.5515 } },
        pricePerNight: 195,
        cleaningFee: 40,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'Kitchen', 'Heating', 'Pet Friendly', 'Garden', 'BBQ Grill'],
        rating: 4.97,
        reviewCount: 89,
        isFeatured: true
      },
      {
        title: 'Japanese Alpine Ryokan with Mountain Onsen',
        description: 'Experience traditional Japanese hospitality in this authentic ryokan style mountain retreat. Featuring tatami rooms, a private onsen hot spring bath, and sweeping Hokkaido mountain views. Traditional multi-course kaiseki dinner and breakfast included with every stay.',
        category: 'mountain',
        images: SAMPLE_IMAGES.mountain,
        host: hosts[2]._id,
        location: { address: '15 Yuki-no-michi', city: 'Niseko', state: 'Hokkaido', country: 'Japan', coordinates: { lat: 42.8044, lng: 140.6870 } },
        pricePerNight: 380,
        cleaningFee: 70,
        guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        amenities: ['Hot Tub', 'Breakfast Included', 'Heating', 'Ski Access', 'WiFi', 'Workspace'],
        rating: 4.92,
        reviewCount: 41
      },
      {
        title: 'Oceanfront Bali-Style Villa with Infinity Pool',
        description: 'This breathtaking villa blends Balinese craftsmanship with modern luxury. The infinity pool appears to merge with the Indian Ocean horizon. Open-air living pavilions, lush tropical gardens, and a dedicated villa butler ensure an unforgettable experience.',
        category: 'villa',
        images: SAMPLE_IMAGES.villa,
        host: hosts[1]._id,
        location: { address: 'Jl. Pantai Seseh', city: 'Canggu', state: 'Bali', country: 'Indonesia', coordinates: { lat: -8.6500, lng: 115.1300 } },
        pricePerNight: 290,
        cleaningFee: 65,
        guests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 3,
        amenities: ['Pool', 'WiFi', 'Kitchen', 'AC', 'Garden', 'Breakfast Included', 'Beach Access', 'Workspace'],
        rating: 4.85,
        reviewCount: 56
      },
      {
        title: 'Historic Parisian Apartment Near the Louvre',
        description: 'Step into Paris from this elegant Haussmann-style apartment on the Île de la Cité. Original parquet floors, ornate moldings, and a private balcony overlooking the Seine. All major landmarks within walking distance — the Louvre, Notre-Dame, and the best boulangeries in the city.',
        category: 'city',
        images: SAMPLE_IMAGES.city,
        host: hosts[1]._id,
        location: { address: '4 Rue de la Cité', city: 'Paris', state: 'Île-de-France', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
        pricePerNight: 210,
        cleaningFee: 45,
        guests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating', 'Washer', 'TV', 'Workspace'],
        rating: 4.75,
        reviewCount: 73
      }
    ]);

    console.log('Properties created');

    // Create bookings (past, so reviews can be written)
    const pastCheckIn = new Date();
    pastCheckIn.setMonth(pastCheckIn.getMonth() - 2);
    const pastCheckOut = new Date(pastCheckIn);
    pastCheckOut.setDate(pastCheckIn.getDate() + 5);

    const booking1 = await Booking.create({
      property: properties[0]._id,
      guest: guests[0]._id,
      host: hosts[0]._id,
      checkIn: pastCheckIn,
      checkOut: pastCheckOut,
      guests: { adults: 2, children: 0, infants: 0, pets: 0 },
      totalGuests: 2,
      nights: 5,
      pricePerNight: 450,
      subtotal: 2250,
      cleaningFee: 80,
      serviceFee: 270,
      taxes: 180,
      totalPrice: 2780,
      status: 'completed',
      hasReview: true
    });

    const booking2 = await Booking.create({
      property: properties[1]._id,
      guest: guests[1]._id,
      host: hosts[2]._id,
      checkIn: pastCheckIn,
      checkOut: pastCheckOut,
      guests: { adults: 2, children: 1, infants: 0, pets: 0 },
      totalGuests: 3,
      nights: 5,
      pricePerNight: 280,
      subtotal: 1400,
      cleaningFee: 60,
      serviceFee: 168,
      taxes: 112,
      totalPrice: 1740,
      status: 'completed',
      hasReview: true
    });

    // Upcoming bookings
    const futureCheckIn = new Date();
    futureCheckIn.setMonth(futureCheckIn.getMonth() + 1);
    const futureCheckOut = new Date(futureCheckIn);
    futureCheckOut.setDate(futureCheckIn.getDate() + 3);

    await Booking.create({
      property: properties[2]._id,
      guest: guests[2]._id,
      host: hosts[1]._id,
      checkIn: futureCheckIn,
      checkOut: futureCheckOut,
      guests: { adults: 4, children: 0, infants: 0, pets: 0 },
      totalGuests: 4,
      nights: 3,
      pricePerNight: 520,
      subtotal: 1560,
      cleaningFee: 100,
      serviceFee: 187,
      taxes: 125,
      totalPrice: 1972,
      status: 'confirmed'
    });

    console.log('Bookings created');

    // Create reviews
    await Review.create([
      {
        property: properties[0]._id,
        guest: guests[0]._id,
        booking: booking1._id,
        ratings: { overall: 5, cleanliness: 5, accuracy: 5, checkin: 5, communication: 5, location: 5, value: 4 },
        comment: 'Absolutely stunning property! The views are even better than the photos. Sarah was an incredibly attentive host who left local restaurant recommendations and welcome gifts. We\'ll definitely be back next summer!'
      },
      {
        property: properties[1]._id,
        guest: guests[1]._id,
        booking: booking2._id,
        ratings: { overall: 5, cleanliness: 5, accuracy: 5, checkin: 4, communication: 5, location: 5, value: 5 },
        comment: 'The cabin exceeded all our expectations. Waking up to snow-capped mountains and relaxing in the hot tub under the stars was magical. The fireplace created the perfect cozy atmosphere. Highly recommend!'
      }
    ]);

    console.log('Reviews created');
    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test accounts:');
    console.log('  Admin:  admin@stayhaven.com / admin123');
    console.log('  Host:   sarah@stayhaven.com / host123');
    console.log('  Host:   marco@stayhaven.com / host123');
    console.log('  Guest:  james@example.com / guest123');
    console.log('  Guest:  emma@example.com / guest123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
