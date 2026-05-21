const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
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

// JWT Middleware
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies?.token;
  let token = tokenFromCookie;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access: Token missing' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Auth API Endpoints
app.post('/api/jwt', async (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).send({ success: true, token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/api/logout', async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0
    }).send({ success: true });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Tutor Routes
app.post('/api/tutors', verifyJWT, async (req, res) => {
  try {
    const newTutorData = req.body;
    if (newTutorData.createdBy !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden access: Email mismatch' });
    }
    const newTutor = new Tutor(newTutorData);
    const savedTutor = await newTutor.save();
    res.status(201).send(savedTutor);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.get('/api/tutors', async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (startDate || endDate) {
      query.sessionStartDate = {};
      if (startDate) {
        query.sessionStartDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.sessionStartDate.$lte = new Date(endDate);
      }
    }
    
    const tutors = await Tutor.find(query).sort({ createdAt: -1 });
    res.send(tutors);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/api/tutors/featured', async (req, res) => {
  try {
    const tutors = await Tutor.find().limit(6).sort({ createdAt: -1 });
    res.send(tutors);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/api/my-tutors', verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    if (email !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden access: Email mismatch' });
    }
    const myTutors = await Tutor.find({ createdBy: email }).sort({ createdAt: -1 });
    res.send(myTutors);
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

// Update Tutor
app.put('/api/tutors/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const tutor = await Tutor.findById(id);
    
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    
    if (tutor.createdBy !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden access: You can only edit your own tutors' });
    }
    
    const updatedTutor = await Tutor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.send(updatedTutor);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Delete Tutor
app.delete('/api/tutors/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const tutor = await Tutor.findById(id);
    
    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found' });
    }
    
    if (tutor.createdBy !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden access: You can only delete your own tutors' });
    }
    
    await Tutor.findByIdAndDelete(id);
    res.send({ message: 'Tutor deleted successfully', id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Booking with slot and date checks (Atomic decrease)
app.post('/api/bookings', verifyJWT, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bookingData = req.body;
    
    if (bookingData.studentEmail !== req.user.email) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).send({ message: 'Forbidden access: Email mismatch' });
    }
    
    const tutor = await Tutor.findById(bookingData.tutorId).session(session);
    if (!tutor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ message: 'Tutor not found' });
    }
    
    if (tutor.totalSlots <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: 'No available slots left.' });
    }
    
    const currentDate = new Date();
    const sessionDate = new Date(tutor.sessionStartDate);
    if (currentDate < sessionDate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: 'Booking is not available yet for this tutor' });
    }
    
    tutor.totalSlots = tutor.totalSlots - 1;
    await tutor.save({ session });
    
    const newBooking = new Booking({
      tutorId: bookingData.tutorId,
      tutorName: bookingData.tutorName,
      studentName: bookingData.studentName,
      studentEmail: bookingData.studentEmail,
      studentPhone: bookingData.studentPhone,
      hourlyFee: tutor.hourlyFee,
      status: 'booked'
    });
    
    const savedBooking = await newBooking.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).send({
      message: 'Booking successful!',
      booking: savedBooking,
      remainingSlots: tutor.totalSlots
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ message: error.message });
  }
});

app.get('/api/my-bookings', verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    if (email !== req.user.email) {
      return res.status(403).send({ message: 'Forbidden access: Email mismatch' });
    }
    const bookings = await Booking.find({ studentEmail: email }).sort({ createdAt: -1 });
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
