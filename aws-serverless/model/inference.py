# inference.py - Custom inference script for SageMaker
import os
import io
import json
import base64
import torch
import logging
from PIL import Image
from transformers import ViTForImageClassification, ViTImageProcessor

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Global variables
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
processor = None

def model_fn(model_dir):
    """Load the model for inference"""
    global model, processor
    
    # Get the HF model ID from environment variables
    model_id = os.environ.get('HF_MODEL_ID', 'prithivMLmods/Deep-Fake-Detector-Model')
    
    logger.info(f"Loading model from {model_id}")
    
    # Load the model and processor
    model = ViTForImageClassification.from_pretrained(model_id)
    processor = ViTImageProcessor.from_pretrained(model_id)
    
    # Move model to the appropriate device
    model.to(device)
    model.eval()
    
    logger.info(f"Model loaded successfully on {device}")
    return model

def input_fn(request_body, request_content_type):
    """Parse input data"""
    logger.info(f"Received request with content type: {request_content_type}")
    
    if request_content_type == 'application/json':
        input_data = json.loads(request_body)
        
        # Handle different input formats
        if 'inputs' in input_data and 'image' in input_data['inputs']:
            # Handle base64 encoded image
            image_data = input_data['inputs']['image']
            image_bytes = base64.b64decode(image_data)
            return Image.open(io.BytesIO(image_bytes)).convert("RGB")
        else:
            raise ValueError("Invalid input format - expected 'inputs.image' with base64 data")
    else:
        raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(image, model):
    """Make prediction using the loaded model"""
    global processor
    
    logger.info("Processing image for prediction")
    
    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    # Perform inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.nn.functional.softmax(logits, dim=1)
        
    # Get the predictions
    predicted_class_idx = torch.argmax(logits, dim=1).item()
    predicted_label = model.config.id2label[predicted_class_idx]
    
    # Get probabilities for each class
    probs = probabilities[0].tolist()
    class_with_probs = {model.config.id2label[i]: float(probs[i]) for i in range(len(probs))}
    
    # Return both the best prediction and all class probabilities
    result = {
        "prediction": predicted_label,
        "confidence": class_with_probs[predicted_label],
        "probabilities": class_with_probs
    }
    
    logger.info(f"Prediction complete: {json.dumps(result)}")
    return result

def output_fn(prediction, accept):
    """Format the prediction output"""
    logger.info(f"Formatting output with accept type: {accept}")
    
    if accept == 'application/json':
        return json.dumps(prediction), accept
    
    return json.dumps(prediction), 'application/json'