import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [adminData, setAdminData] = useState(null);

  // --- फॉर्म और कैलकुलेटर स्टेट्स ---
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState(''); // स्क्वायर फीट के लिए
  const [materialOption, setMaterialOption] = useState('withMaterial');
  const [packageType, setPackageType] = useState('standard');
  const [estimatedCost, setEstimatedCost] = useState(0);

  // कंस्ट्रक्शन रेट्स (प्रति स्क्वायर फीट) - आप इन्हें अपने पापा के रेट्स के हिसाब से बदल सकते हैं
  const rates = {
    labourOnly: 300,  // सिर्फ लेबर रेट
    basic: 1200,      // नॉर्मल क्वालिटी
    standard: 1500,   // मीडियम क्वालिटी
    premium: 2000     // हाई क्वालिटी
  };

  // जैसे ही यूज़र एरिया या पैकेज बदलेगा, यह कॉस्ट अपने आप कैलकुलेट करेगा
  useEffect(() => {
    if (area > 0) {
      let currentRate = 0;
      if (materialOption === 'withoutMaterial') {
        currentRate = rates.labourOnly;
      } else {
        currentRate = rates[packageType];
      }
      setEstimatedCost(area * currentRate);
    } else {
      setEstimatedCost(0);
    }
  }, [area, materialOption, packageType]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      // बैकएंड पर इंक्वायरी भेजना
      await axios.post('https://chhotan-ram-api1.onrender.com/api/inquiry', {
        name, 
        phone, 
        packageType: materialOption === 'withMaterial' ? packageType : 'Labour Only', 
        hasMaterial: materialOption === 'withMaterial',
        area,
        estimatedCost
      });
      alert(`आपकी डिटेल्स सबमिट हो गई हैं! आपका अनुमानित खर्च ₹${estimatedCost.toLocaleString('en-IN')} है। हम जल्द संपर्क करेंगे।`);
      setName('');
      setPhone('');
      setArea('');
      setEstimatedCost(0);
    } catch (err) {
      console.error(err);
      alert('कुछ तकनीकी समस्या आ गई है, कृपया बाद में प्रयास करें।');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://chhotan-ram-api1.onrender.com/api/admin/login', { email });
      if (res.data.success) setAdminData(res.data);
    } catch (err) {
      alert('सिर्फ एडमिन ईमेल अलाउड है!');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2>🏗️ छोटन राम कंस्ट्रक्शन</h2>
        <button className="btn-nav" onClick={() => setIsAdminPanel(!isAdminPanel)}>
          {isAdminPanel ? "वेबसाइट पर जाएं" : "एडमिन पैनल"}
        </button>
      </nav>

      {!isAdminPanel ? (
        // --- User View ---
        <div>
          <div className="hero">
            <h1>मजबूत घर, भरोसेमंद काम</h1>
            <p>हम आपके सपनों का घर पूरी ईमानदारी, सही कीमत और बेहतरीन क्वालिटी के साथ बनाते हैं। आज ही कोटेशन प्राप्त करें।</p>
          </div>

          <div className="container">
            <div className="card">
              <h3>📝 कंस्ट्रक्शन कॉस्ट कैलकुलेटर</h3>
              <form onSubmit={handleInquirySubmit}>
                <div className="form-group">
                  <label>आपका नाम</label>
                  <input type="text" placeholder="पूरा नाम दर्ज करें" value={name} required onChange={(e) => setName(e.target.value)} />
                </div>
                
                <div className="form-group">
                  <label>फ़ोन नंबर</label>
                  <input type="text" placeholder="10 अंकों का मोबाइल नंबर" value={phone} required onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>कंस्ट्रक्शन एरिया (Square Feet में)</label>
                  <input type="number" placeholder="उदाहरण: 1000" value={area} required onChange={(e) => setArea(e.target.value)} />
                </div>
                
                <div className="form-group">
                  <label>क्या आप मटेरियल (सामग्री) के साथ काम करवाना चाहते हैं?</label>
                  <select value={materialOption} onChange={(e) => setMaterialOption(e.target.value)}>
                    <option value="withMaterial">हाँ, मटेरियल के साथ (With Material)</option>
                    <option value="withoutMaterial">नहीं, सिर्फ लेबर (Only Labour)</option>
                  </select>
                </div>

                {materialOption === 'withMaterial' && (
                  <div className="form-group">
                    <label>कंस्ट्रक्शन पैकेज चुनें:</label>
                    <select value={packageType} onChange={(e) => setPackageType(e.target.value)}>
                      <option value="basic">बेसिक - ₹1200/sq.ft</option>
                      <option value="standard">स्टैंडर्ड - ₹1500/sq.ft</option>
                      <option value="premium">प्रीमियम - ₹2000/sq.ft</option>
                    </select>
                  </div>
                )}

                {/* डायनामिक रिजल्ट बॉक्स */}
                {estimatedCost > 0 && (
                  <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '5px', marginTop: '15px', borderLeft: '5px solid #2e7d32' }}>
                    <h4 style={{ margin: 0, color: '#2e7d32' }}>
                      अनुमानित खर्च: ₹{estimatedCost.toLocaleString('en-IN')}
                    </h4>
                    <small style={{ color: '#555' }}>*यह एक अनुमानित राशि है, फाइनल रेट मीटिंग के बाद तय होगा।</small>
                  </div>
                )}
                
                <button type="submit" className="btn-submit" style={{ marginTop: '20px' }}>इंक्वायरी सबमिट करें</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        // --- Admin View ---
        <div className="container" style={{ marginTop: '40px' }}>
          <div className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🔐 एडमिन डैशबोर्ड</h2>
            {!adminData ? (
              <form onSubmit={handleAdminLogin}>
                <div className="form-group">
                  <label>एडमिन ईमेल दर्ज करें</label>
                  <input type="email" placeholder="अपना रजिस्टर्ड जीमेल डालें" required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn-submit">लॉग इन</button>
              </form>
            ) : (
              <div>
                <h3 style={{ color: '#27ae60' }}>वेलकम एडमिन!</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>नाम</th>
                        <th>फ़ोन</th>
                        <th>पैकेज / टाइप</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.inquiries.length === 0 ? (
                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>अभी कोई इंक्वायरी नहीं आई है।</td></tr>
                      ) : (
                        adminData.inquiries.map((inq, idx) => (
                          <tr key={idx}>
                            <td>{inq.name}</td>
                            <td>{inq.phone}</td>
                            <td>{inq.packageType}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;