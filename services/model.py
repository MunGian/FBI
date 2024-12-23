import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import tensorflow as tf
import cv2
from io import BytesIO

app = FastAPI()

@app.post("/check-food")
async def check_food(file: UploadFile = File(...)):
    try:
        # Read the uploaded image
        image_data = await file.read()
        image = Image.open(BytesIO(image_data))

        # Convert the image to JPEG format if it's not already
        if image.format != 'JPEG':
            image = image.convert('RGB')  # Convert to RGB (JPEG doesn't support alpha)
        
        # Save the image as JPEG to the 'images' folder
        image_path = os.path.join("images", "food_photo.jpg")  # Temporary file name
        image.save(image_path, format='JPEG')

        # Load the TFLite model
        interpreter = tf.lite.Interpreter(model_path="model.tflite")
        interpreter.allocate_tensors()

        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # Read and preprocess the image
        image = cv2.imread(image_path)

        # Resize image to model's expected input size
        image_resized = cv2.resize(image, (150, 150))  # Adjust size as per your model's input

        # Normalize the image
        image_resized = image_resized / 255.0

        # Expand dimensions to match the input shape expected by the model
        input_data = np.expand_dims(image_resized, axis=0)
        input_data = np.float32(input_data)

        # Set the input tensor
        interpreter.set_tensor(input_details[0]['index'], input_data)

        # Run inference
        interpreter.invoke()

        # Get the output tensor
        output_data = interpreter.get_tensor(output_details[0]['index'])

        # Get the prediction result (convert numpy.float32 to a regular float)
        prediction = float(output_data[0][0])

        # Delete the temporary file
        os.remove(image_path)

        # Return prediction result
        return {"prediction": prediction}

    except Exception as e:
        # Ensure the temporary file is deleted even if an error occurs
        if os.path.exists(image_path):
            os.remove(image_path)
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
