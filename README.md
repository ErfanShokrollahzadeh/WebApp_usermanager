# JSON Processor Web App

A lightweight, modern web application that processes JSON payloads. It features a beautiful, glassmorphism-styled UI on the frontend and a fast, asynchronous Python backend powered by FastAPI.

## Architecture Flowchart

```mermaid
graph TD
    A[User] -->|Inputs JSON data| B(Frontend UI - HTML/CSS)
    B -->|Submits Form| C{JavaScript Client - app.js}
    C -->|Validates JSON syntax| C
    C -->|POST Request to /process| D[FastAPI Backend - main.py]
    D -->|Receives Payload| E(Processing Logic)
    E -->|Modifies strings, ints, lists| E
    E -->|Constructs JSON structure| D
    D -->|HTTP 200 OK Response| C
    C -->|Applies Syntax Highlighting| B
    B -->|Displays Formatted JSON| A
```

## Request Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Browser as Frontend (HTML/JS)
    participant Server as Backend (FastAPI)

    User->>Browser: Enters JSON data & clicks "Process"
    Browser->>Browser: Checks if input is valid JSON
    Browser->>Server: POST /process (application/json)
    Server->>Server: Validates request payload against Pydantic schema
    Server->>Server: Processes dictionary elements
    Server-->>Browser: 200 OK (Processed JSON Response)
    Browser->>Browser: Applies syntax highlighting (colors)
    Browser-->>User: Renders beautiful formatted JSON in UI
```

## Running Locally

### Prerequisites
- Python 3.8 or higher

### Setup

1. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate
   ```

2. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```

4. **Access the application:**
   Open your browser and navigate to [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
