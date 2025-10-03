// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

// Switch to bookmarks database
db = db.getSiblingDB('bookmarks');

// Create collections
db.createCollection('bookmarks');
db.createCollection('categories');

// Create indexes for better performance
db.bookmarks.createIndex({ userId: 1 });
db.bookmarks.createIndex({ categoryId: 1 });
db.bookmarks.createIndex({ url: 1 });
db.bookmarks.createIndex({ createdAt: -1 });

db.categories.createIndex({ userId: 1 });
db.categories.createIndex({ name: 1 });

// Insert sample categories
db.categories.insertMany([
  {
    _id: ObjectId(),
    name: 'Work',
    color: '#3b82f6',
    userId: 'sample_user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Personal',
    color: '#10b981',
    userId: 'sample_user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Dev Tools',
    color: '#f59e0b',
    userId: 'sample_user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB initialized with bookmarks database and sample data');
