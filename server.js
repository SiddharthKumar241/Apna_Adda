const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads/ownership_papers folder exists
const uploadDir = path.join(__dirname, 'uploads', 'ownership_papers');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads/ownership_papers folder');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error(" MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  Username: String,
  Email: String,
  Password: String
}, { timestamps: true });
const User = mongoose.model("user", userSchema, "user");


// Tenant schema and model
const tenantSchema = new mongoose.Schema({
  tenantName: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  numPeople: { type: Number, required: true },
  propertySelected: { type: String, required: true, trim: true },
  listedAmount: { type: Number, required: true },
  readyToPay: { type: Number, required: true },
  leaseTime: { type: String, required: true, trim: true },
  aadhaar: { type: String, required: true, trim: true },
  photo: { type: String, required: true }, // store uploaded photo filename
}, { timestamps: true });

const Tenant = mongoose.model('Tenant', tenantSchema, 'tenant');


const listingSchema = new mongoose.Schema({
  city: String,
  title: String,
  type: String,
  rent: Number,
  dateAdded: String,
  area: String,
  image: String
});
const Listing = mongoose.model('Listing', listingSchema);

const categorySchema = new mongoose.Schema({
  city: String,
  title: String,
  type: String,
  rent: Number,
  dateAdded: String,
  area: String,
  image: String
});
const Authority_Plots = mongoose.model('Authority_Plots', categorySchema, 'authority_plots');
const Freehold_Property = mongoose.model('Freehold_Property', categorySchema, 'freehold_property');
const Industrial_Plots = mongoose.model('Industrial_Plots', categorySchema, 'industrial_plots');
const Flats_Apartments = mongoose.model('Flats_Apartments', categorySchema, 'flats_apartments');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 5 * 60 * 1000 }
}));




// === Routes ===
app.post("/register", async (req, res) => {
  try {
    await User.create({
      Username: req.body.username,
      Email: req.body.email,
      Password: req.body.password,
    });
    res.redirect("/login.html");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Registration Failed.<br>
      <h3>Login failed: Invalid credentials</h3><br>
      <a href="/register.html">Try Again</a> `);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ Email: email, Password: password });

    if (user) {
      req.session.user = {
        email: user.Email,
        username: user.Username
      };
      res.redirect("/Homepage.html");
    } else {
      res.status(401).send(`
        <h3>Login failed: Invalid credentials</h3>
        <a href="/login.html">Try Again</a>
      `);
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Internal server error during login.");
  }
});

app.get("/session-info", (req, res) => {
  const user = req.session.user;
  res.json({
    loggedIn: !!user,
    username: user?.username || null
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed.");
    }
    res.redirect("/Homepage.html");
  });
});

app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});
app.get('/load-data', async (req, res) => {
  try {
    const count = await Listing.countDocuments();
    if (count > 0) {
      return res.send('Data already exists in DB. No new insert.');
    }

    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    await Listing.insertMany(data);
    res.send('Data loaded into MongoDB (Apna_Adda -> listings)');
  } catch (err) {
    console.error('Error loading data:', err);
    res.status(500).send('Error loading data: ' + err);
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'Homepage.html'));
});
app.get('/load-authority-plots', async (req, res) => {
  try {
    const count = await Authority_Plots.countDocuments();
    if (count > 0) return res.send('Authority Plots data already loaded.');

    const data = JSON.parse(fs.readFileSync('./authority_plots.json', 'utf8'));
    await Authority_Plots.insertMany(data);
    res.send('Authority Plots data loaded successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load Authority Plots data.');
  }
});
app.get('/load-freehold-property', async (req, res) => {
  try {
    const count = await Freehold_Property.countDocuments();
    if (count > 0) return res.send('Freehold Property data already loaded.');

    const data = JSON.parse(fs.readFileSync('./freehold_property.json', 'utf8'));
    await Freehold_Property.insertMany(data);
    res.send('Freehold Property data loaded successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load Freehold Property data.');
  }
});
app.get('/load-industrial-plots', async (req, res) => {
  try {
    const count = await Industrial_Plots.countDocuments();
    if (count > 0) return res.send('Industrial Plots data already loaded.');

    const data = JSON.parse(fs.readFileSync('./industrial_plots.json', 'utf8'));
    await Industrial_Plots.insertMany(data);
    res.send('Industrial Plots data loaded successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load Industrial Plots data.');
  }
});
app.get('/load-flats-apartments', async (req, res) => {
  try {
    const count = await Flats_Apartments.countDocuments();
    if (count > 0) return res.send('Flats and Apartments data already loaded.');

    const data = JSON.parse(fs.readFileSync('./flats_apartment.json', 'utf8'));
    await Flats_Apartments.insertMany(data);
    res.send('Flats and Apartments data loaded successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load Flats and Apartments data.');
  }
});
app.get('/authority-plots', async (req, res) => {
  try {
    const data = await Authority_Plots.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Authority Plots' });
  }
});
app.get('/freehold-property', async (req, res) => {
  try {
    const data = await Freehold_Property.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Freehold Property' });
  }
});
app.get('/industrial-plots', async (req, res) => {
  try {
    const data = await Industrial_Plots.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Industrial Plots' });
  }
});
app.get('/flats-apartments', async (req, res) => {
  try {
    const data = await Flats_Apartments.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Flats and Apartments' });
  }
});

const categoryFileMap = {
  freehold: 'freehold.json',
  flats: 'flats.json',
  industrial: 'industrial.json',
  authority: 'authority.json',
  commercial: 'commercial.json'
};

app.post('/add-listing', (req, res) => {
  const { city, title, type, rent, area, image, category } = req.body;

  if (!city || !title || !type || !rent || !area || !image || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const filePath = categoryFileMap[category];
  if (!filePath) {
    return res.status(400).json({ message: 'Invalid category.' });
  }

  const absolutePath = path.join(__dirname, filePath);
  const newListing = {
    city,
    title,
    type,
    rent,
    dateAdded: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    area,
    image
  };

  fs.readFile(absolutePath, 'utf8', (err, data) => {
    let listings = [];
    if (!err && data) {
      try {
        listings = JSON.parse(data);
        if (!Array.isArray(listings)) listings = [];
      } catch (parseErr) {
        listings = [];
      }
    }

    listings.push(newListing);

    fs.writeFile(absolutePath, JSON.stringify(listings, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to save listing.' });
      }
      res.status(200).json({ message: 'Listing added successfully!' });
    });
  });
});

// ----------------- ADMIN AUTHENTICATION (NEW) -----------------

const bcrypt = require('bcrypt');
const multer = require('multer');

// Multer setup for ownership paper upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Admin schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  aadhaar: { type: String, required: true, unique: true, match: /^\d{12}$/ },
  ownershipPaperFileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Admin = mongoose.model('AdminDetails', adminSchema, 'admindetails');

// Admin Register Route
app.post('/admin/register', upload.single('ownershipPaper'), async (req, res) => {
  try {
    const { name, email, password, aadhaar } = req.body;
    const ownershipPaperFileName = req.file?.filename;

    if (!name || !email || !password || !aadhaar || !ownershipPaperFileName) {
      return res.status(400).send('All fields including ownership paper upload are required.');
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).send('Invalid Aadhaar number. Must be exactly 12 digits.');
    }

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { aadhaar }] });
    if (existingAdmin) {
      return res.status(400).send('Admin with given email or Aadhaar already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      passwordHash,
      aadhaar,
      ownershipPaperFileName
    });

    await newAdmin.save();

    res.redirect('/admin-login.html');
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).send('Server error during admin registration.');
  }
});

// Admin Login Route
app.post('/admin/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).send('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) {
      return res.status(401).send('Invalid email or password');
    }

    // Save admin session separately
    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };

    res.redirect('/admin.html');
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).send('Server error during admin login.');
  }
});

// Admin Logout Route
app.get('/admin/logout-admin', (req, res) => {
  req.session.admin = null;
  res.redirect('/admin-login.html');
});

// Admin Session Info Route
app.get('/admin/session-info-admin', (req, res) => {
  const admin = req.session.admin;
  res.json({
    loggedIn: !!admin,
    name: admin?.name || null,
    email: admin?.email || null
  });
});

// -----------------Tenant Authentication---------------------

// Tenant uploads folder path
const tenantUploadDir = path.join(__dirname, 'uploads', 'tenant');
if (!fs.existsSync(tenantUploadDir)) {
  fs.mkdirSync(tenantUploadDir, { recursive: true });
}

// Multer storage config for tenant uploads
const tenantStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tenantUploadDir); // save files in uploads/tenant
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const tenantUpload = multer({ storage: tenantStorage });

module.exports = tenantUpload;

app.post('/submit-details', tenantUpload.single('photo'), async (req, res) => {
  try {
    const {
      tenantName,
      age,
      email,
      phone,
      numPeople,
      propertySelected,
      listedAmount,
      readyToPay,
      leaseTime,
      aadhaar
    } = req.body;

    // The uploaded file info is in req.file
    const photoPath = req.file ? req.file.path : null;

    // Create new tenant document with Mongoose model
    const newTenant = new Tenant({
      tenantName,
      age,
      email,
      phone,
      numPeople,
      propertySelected,
      listedAmount,
      readyToPay,
      leaseTime,
      aadhaar,
      photo: photoPath,
    });

    // Save to database
    await newTenant.save();

    // Redirect or respond as you want
    res.redirect('/sucess.html');
  } catch (error) {
    console.error('Error saving tenant details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
