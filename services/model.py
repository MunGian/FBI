import tensorflow as tf
import numpy as np
from PIL import Image, UnidentifiedImageError
import io
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load TFLite model
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_image(image):
    img = image.resize((150, 150))  # Resize to model input size
    img_array = np.array(img, dtype=np.float32) / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

def predict(image):
    input_data = preprocess_image(image)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    return output_data

@app.route('/check-food', methods=['POST'])
def check_food():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        # Attempt to open the uploaded file as an image
        image = Image.open(file.stream)
        # Ensure image format is one of the supported types
        if image.format not in ['JPEG', 'PNG', 'GIF']:
            return jsonify({"error": f"Unsupported file format: {image.format}. Supported formats are JPEG, PNG, GIF"}), 400

        # Perform prediction
        predictions = predict(image)
        class_id = np.argmax(predictions)
        confidence = np.max(predictions)
        return jsonify({
            "class_id": int(class_id),
            "confidence": float(confidence)
        })

    except UnidentifiedImageError:
        return jsonify({"error": "Invalid image file. Please upload a valid image."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
