const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Tutor Schema & Model
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

// Booking Schema & Model
const bookingSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  tutorName: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String, required: true },
  hourlyFee: { type: Number },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

// Basic Tutor Routes
app.post('/api/tutors', async (req, res) => {
  try {
    const newTutor = new Tutor(req.body);
    const savedTutor = await newTutor.save();
    res.status(201).send(savedTutor);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.get('/api/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find().sort({ createdAt: -1 });
    res.send(tutors);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/api/tutors/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    res.send(tutor);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Basic Booking Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).send(savedBooking);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.get('/api/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ studentEmail: req.query.email }).sort({ createdAt: -1 });
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('MediQueue Server is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
