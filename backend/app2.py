from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model pipeline
with open('house_price_model.pkl', 'rb') as f:
    model = pickle.load(f)

# ✅ Add sqft_living here
feature_columns = [
    'bedrooms', 'bathrooms', 'floors',
    'yr_built', 'yr_renovated', 'street',
    'city', 'sqft_living'
]


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print("Received JSON:", data)

    # Optional: validate all required fields exist
    if any(field not in data or data[field] in [None, '', ' '] for field in feature_columns):
        return jsonify({'error': 'Missing or empty fields in input', 'data': data}), 400

    df = pd.DataFrame([data], columns=feature_columns)

    # Optional cleanup
    df['city'] = df['city'].str.title()  # Normalize capitalization

    print("Final DataFrame:\n", df)
    print("Null check:\n", df.isnull().sum())

    prediction = model.predict(df)
    return jsonify({'price': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
