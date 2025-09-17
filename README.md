# MIDI Sequence Generator

## Overview
The MIDI Sequence Generator is a web application that allows users to generate MIDI sequences through a user-friendly interface. The application consists of a backend built with Flask and a frontend developed using React.

## Project Structure
```
midi-sequence-generator
├── backend
│   ├── app.py
│   └── requirements.txt
├── frontend
│   ├── package.json
│   ├── src
│   │   ├── index.js
│   │   └── App.js
└── README.md
```

## Backend
The backend is responsible for handling requests related to MIDI sequence generation. It is built using Flask and includes the following files:

- **app.py**: The main entry point for the backend application. It sets up the Flask server and defines routes for creating and retrieving MIDI data.
- **requirements.txt**: Lists the Python dependencies required for the backend, including Flask and any MIDI handling libraries.

## Frontend
The frontend provides the user interface for the application. It is built using React and includes the following files:

- **package.json**: Configuration file for the frontend application, listing dependencies, scripts, and metadata.
- **src/index.js**: The entry point for the frontend application, rendering the main application component.
- **src/App.js**: Exports the main React component `App`, which contains the UI for generating MIDI sequences and methods for handling user input and sending requests to the backend.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```
   python app.py
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install the required JavaScript packages:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage
Once both the backend and frontend are running, you can access the application in your web browser. Use the interface to input parameters for MIDI sequence generation and submit your requests to see the generated MIDI data.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.