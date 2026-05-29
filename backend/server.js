const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// डमी डेटा (इसे आप MongoDB से रिप्लेस कर सकते हैं)
let inquiries = [];
let prices = { basic: 1000, standard: 1500, premium: 2500 };
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// 1. इंक्वायरी सबमिट करने का API
app.post('/api/inquiry', (req, res) => {
    const { name, phone, packageType, hasMaterial } = req.body;
    inquiries.push({ name, phone, packageType, hasMaterial, date: new Date() });
    res.status(200).json({ message: "इंक्वायरी सफलतापूर्वक सबमिट हो गई!" });
});

// 2. एडमिन लॉगिन चेक API (सिर्फ आपके सिंगल ईमेल के लिए)
app.post('/api/admin/login', (req, res) => {
    const { email } = req.body;
    if (email === ADMIN_EMAIL) {
        res.status(200).json({ success: true, message: "लॉगिन सफल", inquiries, prices });
    } else {
        res.status(401).json({ success: false, message: "अनधिकृत ईमेल!" });
    }
});

// 3. प्राइस अपडेट करने का API
app.post('/api/admin/update-price', (req, res) => {
    const { email, newPrices } = req.body;
    if (email === ADMIN_EMAIL) {
        prices = { ...prices, ...newPrices };
        res.status(200).json({ success: true, message: "प्राइस अपडेट हो गए!", prices });
    } else {
        res.status(401).json({ success: false, message: "अनधिकृत एक्सेस!" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));