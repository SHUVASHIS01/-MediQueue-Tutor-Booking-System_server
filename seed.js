const mongoose = require('mongoose');
require('dotenv').config();

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  subject: { type: String, required: true },
  availableDays: { type: [String], required: true },
  availableTime: { type: String, required: true },
  hourlyFee: { type: Number, required: true },
  totalSlots: { type: Number, required: true, default: 0 },
  sessionStartDate: { type: Date, required: true },
  institution: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  teachingMode: { type: String, enum: ['Online', 'Offline', 'Both'], required: true },
  createdBy: { type: String, required: true }
}, { timestamps: true });

const Tutor = mongoose.model('Tutor', tutorSchema);

const seedTutors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing for a fresh start
    await Tutor.deleteMany({});
    
    const tutors = [
      {
        name: 'Dr. Sarah Jenkins',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
        subject: 'Advanced Physics',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTime: '10:00 AM - 02:00 PM',
        hourlyFee: 85,
        totalSlots: 10,
        sessionStartDate: new Date(Date.now() - 1000000000), 
        institution: 'MIT',
        experience: '12 years of research and teaching',
        location: 'Boston, MA',
        teachingMode: 'Online',
        createdBy: 'admin@mediqueue.edu'
      },
      {
        name: 'Michael Chen',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
        subject: 'Calculus & Algebra',
        availableDays: ['Tuesday', 'Thursday'],
        availableTime: '04:00 PM - 08:00 PM',
        hourlyFee: 60,
        totalSlots: 15,
        sessionStartDate: new Date(Date.now() - 500000000),
        institution: 'Stanford University',
        experience: '5 years as TA and Private Tutor',
        location: 'Palo Alto, CA',
        teachingMode: 'Both',
        createdBy: 'admin@mediqueue.edu'
      },
      {
        name: 'Elena Rodriguez',
        image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=600&auto=format&fit=crop',
        subject: 'Computer Science (React & Node)',
        availableDays: ['Saturday', 'Sunday'],
        availableTime: '09:00 AM - 05:00 PM',
        hourlyFee: 95,
        totalSlots: 8,
        sessionStartDate: new Date(Date.now() - 200000000),
        institution: 'Google Tech Lead',
        experience: '8 years industry experience',
        location: 'San Francisco, CA',
        teachingMode: 'Online',
        createdBy: 'admin@mediqueue.edu'
      },
      {
        name: 'Dr. James Wilson',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop',
        subject: 'Organic Chemistry',
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        availableTime: '01:00 PM - 04:00 PM',
        hourlyFee: 75,
        totalSlots: 20,
        sessionStartDate: new Date(Date.now() - 800000000),
        institution: 'Harvard Medical School',
        experience: '15 years of medical tutoring',
        location: 'Cambridge, MA',
        teachingMode: 'Both',
        createdBy: 'admin@mediqueue.edu'
      }
    ];

    await Tutor.insertMany(tutors);
    console.log('Successfully seeded 4 tutors!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedTutors();
