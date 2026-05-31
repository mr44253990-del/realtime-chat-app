# Real-time Communication App

A real-time communication application built with Node.js, Express, and Socket.IO featuring:
- Room creation with optional password protection
- Real-time text messaging
- Emoji support
- Microphone permission simulation
- User presence indicators
- Speaking status visualization

## Features

- Create and join rooms with optional passwords
- Real-time chat with message history
- Emoji picker for expressive communication
- Microphone permission requests (simulated)
- Speaking status indicators
- User presence tracking
- Responsive design for mobile and desktop

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. **Create a Room**: Enter a room ID and optional password, then click "Create Room"
2. **Join a Room**: Enter an existing room ID and password (if set), then click "Join Room"
3. **Set Your Name**: Enter your display name when prompted
4. **Request Microphone**: Click "Request Microphone" to simulate asking for mic permission
5. **Start Speaking**: Once microphone permission is granted, click "Start Speaking" to indicate you're speaking
6. **Send Messages**: Type in the chat box and press Enter or click "Send Message"
7. **Add Emojis**: Click the emoji button to open the emoji picker
8. **Leave Room**: Click "Leave Room" when you're done

## Technical Details

### Backend (server.js)
- Node.js with Express for HTTP server
- Socket.IO for real-time bidirectional communication
- In-memory storage for rooms and user data
- Event-based architecture for handling connections

### Frontend (public/index.html)
- HTML5 with semantic structure
- CSS3 with modern styling and animations
- Vanilla JavaScript for DOM manipulation
- Socket.IO client for real-time communication
- Responsive design that works on mobile and desktop

## API Endpoints

### Socket.IO Events

**Client to Server:**
- `create-room`: Create a new room (`{ roomId, password }`)
- `join-room`: Join an existing room (`{ roomId, password }`)
- `leave-room`: Leave the current room (`{ roomId }`)
- `chat-message`: Send a chat message (`{ roomId, message, userName }`)
- `mic-permission-request`: Request microphone permission (`{ roomId, userName }`)
- `user-speaking`: Update speaking status (`{ roomId, userName, speaking }`)

**Server to Client:**
- `room-error`: Error creating/joining room (`{ message }`)
- `room-created`: Room created successfully
- `joined-room`: Successfully joined room
- `chat-history`: Send chat history upon joining (`[messages]`)
- `chat-message`: New chat message received (`{ message }`)
- `user-joined`: User joined the room (`{ userId, count }`)
- `user-left`: User left the room (`{ userId, count }`)
- `user-count-update`: Updated user count (`{ count }`)
- `mic-permission-granted`: Microphone permission granted (`{ message }`)
- `user-speaking`: User speaking status update (`{ userId, userName, speaking }`)

## Deployment

To deploy this application to a production environment:

1. Ensure Node.js is installed on your server
2. Copy the application files to your server
3. Run `npm install` to install dependencies
4. Start the application with `npm start` or use a process manager like PM2
5. Configure a reverse proxy (nginx/apache) if needed for port 80/443
6. Set up SSL/TLS certificates for secure connections

## Customization

You can customize the application by modifying:

- **Styling**: Edit the CSS in `public/index.html`
- **Features**: Add new Socket.IO events in `server.js` and corresponding client handlers
- **Room Persistence**: Replace in-memory storage with a database like Redis or MongoDB
- **Authentication**: Integrate with OAuth or other auth systems
- **Media Features**: Add actual WebRTC audio/video capabilities

## License

MIT