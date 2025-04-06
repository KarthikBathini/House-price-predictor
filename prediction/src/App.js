import React, { useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [form, setForm] = useState({
    bedrooms: "",
    bathrooms: "",
    floors: "",
    yr_built: "",
    yr_renovated: "", 
    street: "",
    city: "",
    sqft_living: "",
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    for (let key in form) {
      if (!form[key]) {
        setError(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/predict", form);
      setPredictedPrice(response.data.price.toFixed(2));
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Prediction failed.");
    }
  };

  return (
    <div className='main' style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>🏡 House Price Predictor</h2>

      {["bedrooms", "bathrooms", "floors", "yr_built", "yr_renovated", "sqft_living"].map((field) => (
        <div className='keys' key={field} style={{ marginBottom: 10 }}>
          <label>{field.replace("_", " ").toUpperCase()}:</label>
          <input
            type="number"
            name={field}
            value={form[field]}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            placeholder={`Enter ${field.replace("_", " ")}`}
          />
        </div>
      ))}

      <div  class='street' style={{ marginBottom: 10 }}>
        <label>STREET:</label>
        <input
          type="text"
          name="street"
          value={form.street}
          onChange={handleChange}
          style={{ width: "100%", padding: 8 }}
          placeholder="e.g., 123 Main St"
        />
      </div>

      <div class='city'style={{ marginBottom: 10 }}>
        <label>CITY:</label>
        <select
          name="city"
          value={form.city}
          onChange={handleChange}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Select a city</option>
          <option value="Seattle">Seattle</option>
          <option value="Portland">Portland</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{ padding: 10, marginTop: 10 }}>
        Predict Price
      </button>

      {predictedPrice && (
        <div style={{ marginTop: 20 }}>
          <h3>💰 Predicted Price: ${predictedPrice}</h3>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default App;
