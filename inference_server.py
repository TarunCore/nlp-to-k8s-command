# !pip install pyngrok flask
# !ngrok config add-authtoken <token here>
from flask import Flask, request, jsonify
from pyngrok import ngrok
from transformers import T5ForConditionalGeneration, T5Tokenizer

# Load model and tokenizer
model = T5ForConditionalGeneration.from_pretrained("/content/drive/MyDrive/checkpoint-23547")
tokenizer = T5Tokenizer.from_pretrained("t5-base")

def predict(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    output_ids = model.generate(inputs.input_ids, max_length=64)
    return tokenizer.decode(output_ids[0], skip_special_tokens=True)

app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict_endpoint():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Missing query parameter "q"'}), 400
    result = predict(query)
    return jsonify({'input': query, 'output': result})

# ---- Start ngrok tunnel manually ----
public_url = ngrok.connect(5000).public_url
print(f"✅ Public API URL: {public_url}/predict?q=Create+TLS+certificates")

# ---- Run Flask normally ----
app.run(port=5000)
