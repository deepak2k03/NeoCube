require('dotenv').config();
const mongoose = require('mongoose');
const Technology = require('../models/Technology');
const technologies = require('./technologies.json');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing technologies
    await Technology.deleteMany({});
    console.log('Cleared existing technologies');

    // Insert new technologies
    const insertedTechnologies = await Technology.insertMany(technologies);
    console.log(`Inserted ${insertedTechnologies.length} technologies`);

    // Create indexes for better performance
    await Technology.createIndexes([
      { name: 'text', shortDescription: 'text', tags: 'text' },
      { slug: 1 },
      { category: 1 },
      { difficulty: 1 },
      { isTrending: 1 },
      { popularity: -1 }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();