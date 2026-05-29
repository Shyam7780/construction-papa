import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [adminData, setAdminData] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [materialOption, setMaterialOption] = useState('withMaterial');
  const [packageType, setPackageType] = useState('standard');

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://chhotan-ram-api1.onrender.com/api/inquiry', {
        name, phone, packageType, hasMaterial: materialOption === 'withMaterial'
      });
      alert('आपकी डिटेल्स सबमिट हो गई हैं! हम जल्द संपर्क करेंगे।');
      setName('');
      setPhone('');
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
              <h3>📝 कंस्ट्रक्शन कैलकुलेटर और इंक्वायरी</h3>
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
                      <option value="basic">बेसिक (नॉर्मल क्वालिटी फिनिशिंग)</option>
                      <option value="standard">स्टैंडर्ड (मीडियम क्वालिटी फिनिशिंग)</option>
                      <option value="premium">प्रीमियम (हाई क्वालिटी फिनिशिंग)</option>
                    </select>
                  </div>
                )}
                
                <button type="submit" className="btn-submit">कोटेशन प्राप्त करें</button>
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
                <p style={{ marginBottom: '15px' }}>यहाँ कस्टमर्स की ताज़ा इंक्वायरी लिस्ट दी गई है:</p>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>नाम</th>
                        <th>फ़ोन</th>
                        <th>मटेरियल शामिल?</th>
                        <th>पैकेज</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.inquiries.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>अभी कोई इंक्वायरी नहीं आई है।</td></tr>
                      ) : (
                        adminData.inquiries.map((inq, idx) => (
                          <tr key={idx}>
                            <td>{inq.name}</td>
                            <td>{inq.phone}</td>
                            <td>{inq.hasMaterial ? "✅ हाँ" : "❌ नहीं"}</td>
                            <td>{inq.hasMaterial ? inq.packageType : "N/A"}</td>
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