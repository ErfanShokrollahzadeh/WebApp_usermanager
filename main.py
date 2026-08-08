from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any, Dict
import datetime

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="JSON Processor Web App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the static files (frontend)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

# Define a generic model to accept any JSON dictionary
class Payload(BaseModel):
    data: Dict[str, Any]

@app.post("/process")
async def process_json(payload: Payload):
    """
    Receives JSON input, performs simple processing, and returns JSON output.
    """
    input_data = payload.data
    
    # Perform some simple logic on the JSON
    processed_data = {}
    
    for key, value in input_data.items():
        if isinstance(value, str):
            # Reverse strings
            processed_data[f"{key}_processed"] = value.upper()
        elif isinstance(value, (int, float)):
            # Multiply numbers by 2
            processed_data[f"{key}_processed"] = value * 2
        elif isinstance(value, list):
            # Count elements in lists
            processed_data[f"{key}_processed_count"] = len(value)
        else:
            # Leave other types as is
            processed_data[key] = value
            
    response = {
        "status": "success",
        "timestamp": datetime.datetime.now().isoformat(),
        "original_input": input_data,
        "processed_output": processed_data,
        "message": "JSON successfully processed!"
    }
    
    return JSONResponse(content=response)
