from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
import cv2
import os

# Create the FastAPI app instance
app = FastAPI()

# Mount the images directory to serve static files
app.mount("/images", StaticFiles(directory="images"), name="images")

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
        image_path = os.path.join("images", f"{file.filename.rsplit('.', 1)[0]}.jpg")  # Ensuring the file extension is .jpg
        image.save(image_path, format='JPEG')

        # Load the TFLite model
        interpreter = tf.lite.Interpreter(model_path="model.tflite")
        interpreter.allocate_tensors()

        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # Convert image to numpy array (for use with OpenCV)
        # image_np = np.array(image)

        image = cv2.imread("C:/Users/wenji/Documents/GitHub/FBI\services\images\food_photo.jpg")

        # Resize image to model's expected input size
        image_resized = cv2.resize(image_np, (150, 150))  # Adjust size as per your model's input

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

        # Return prediction result and image URL
        return {"prediction": prediction, "image_url": f"/images/{file.filename.rsplit('.', 1)[0]}.jpg"}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
