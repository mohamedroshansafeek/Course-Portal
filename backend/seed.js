require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding/cleaning...');

    // Warning: Clean users collection before seeding
    await User.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      { name: 'Admin User', email: 'admin@portal.com', password, role: 'admin' },
      { name: 'Instructor One', email: 'instructor@portal.com', password, role: 'instructor' },
      { name: 'Student Bob', email: 'student@portal.com', password, role: 'student' }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully:');
    users.forEach(u => console.log(`- ${u.email} (Password: password123, Role: ${u.role})`));
    
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
