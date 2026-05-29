import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [adminData, setAdminData] = useState(null);

  // --- यूज़र फॉर्म स्टेट्स ---
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [materialOption, setMaterialOption] = useState('withMaterial');
  const [packageType, setPackageType] = useState('standard');

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(' https://chhotan-ram-api1.onrender.com/api/inquiry', {
        name, phone, packageType, hasMaterial: materialOption === 'withMaterial'
      });
      alert('आपकी डिटेल्स सबमिट हो गई हैं! हम जल्द संपर्क करेंगे।');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(' https://chhotan-ram-api1.onrender.com/api/admin/login', { email });
      if (res.data.success) setAdminData(res.data);
    } catch (err) {
      alert('सिर्फ एडमिन ईमेल अलाउड है!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <button onClick={() => setIsAdminPanel(!isAdminPanel)} style={{ float: 'right' }}>
        {isAdminPanel ? "वेबसाइट पर जाएं" : "एडमिन पैनल"}
      </button>

      {!isAdminPanel ? (
        // --- यूज़र व्यू ---
        <div>
          <h1>छोटन राम कंस्ट्रक्शन</h1>
          <p>आपका भरोसेमंद कंस्ट्रक्शन पार्टनर</p>
          <hr />
          
          <h3>कंस्ट्रक्शन कैलकुलेटर और इंक्वायरी</h3>
          <form onSubmit={handleInquirySubmit}>
            <input type="text" placeholder="आपका नाम" required onChange={(e) => setName(e.target.value)} /><br/><br/>
            <input type="text" placeholder="फ़ोन नंबर" required onChange={(e) => setPhone(e.target.value)} /><br/><br/>
            
            <label>मटेरियल के साथ या बिना मटेरियल?</label><br/>
            <select onChange={(e) => setMaterialOption(e.target.value)}>
              <option value="withMaterial">विद मटेरियल (With Material)</option>
              <option value="withoutMaterial">विदाउट मटेरियल (Only Labour)</option>
            </select><br/><br/>

            {materialOption === 'withMaterial' && (
              <div>
                <label>पैकेज चुनें:</label><br/>
                <select onChange={(e) => setPackageType(e.target.value)}>
                  <option value="basic">बेसिक (नॉर्मल क्वालिटी)</option>
                  <option value="standard">स्टैंडर्ड (मीडियम क्वालिटी)</option>
                  <option value="premium">प्रीमियम (हाई क्वालिटी)</option>
                </select><br/><br/>
              </div>
            )}
            
            <button type="submit">कोटेशन प्राप्त करें</button>
          </form>
        </div>
      ) : (
        // --- एडमिन पैनल व्यू ---
        <div>
          <h2>एडमिन डैशबोर्ड</h2>
          {!adminData ? (
            <form onSubmit={handleAdminLogin}>
              <input type="email" placeholder="अपना एडमिन Gmail डालें" required onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">लॉग इन</button>
            </form>
          ) : (
            <div>
              <h3>वेलकम एडमिन!</h3>
              <h4>इंक्वायरी लिस्ट:</h4>
              <table border="1" cellPadding="10">
                <thead>
                  <tr>
                    <th>नाम</th>
                    <th>फ़ोन</th>
                    <th>मटेरियल</th>
                    <th>पैकेज</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.inquiries.map((inq, idx) => (
                    <tr key={idx}>
                      <td>{inq.name}</td>
                      <td>{inq.phone}</td>
                      <td>{inq.hasMaterial ? "हाँ" : "नहीं"}</td>
                      <td>{inq.hasMaterial ? inq.packageType : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;