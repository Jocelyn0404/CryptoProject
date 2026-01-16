<div align="center">
<h1>🔐 Escape the Hacker Room</h1>
<p>An educational cryptography game built with React and TypeScript</p>
</div>

## 📖 Overview

**Escape the Hacker Room** is an educational game designed using an escape-room concept, where players must solve a series of cryptography-based puzzles to progress from one room to another and finally escape.

### 🎮 Game Concept

The game follows a simple storyline in which the player is trapped inside a digital room controlled by a hacker. To escape, the player needs to unlock doors by completing challenges related to basic cryptography concepts. Each room focuses on one concept and increases in difficulty as the player progresses.

### 🔑 Cryptography Concepts Covered

The game includes three main cryptography concepts:

1. **Encryption and Decryption** - Players learn how a normal message is changed into a secret message and then returned to its original form.

2. **Caesar Cipher** - Players decode messages by shifting letters to find the correct answer. These decoded messages are used as passwords to unlock doors.

3. **Key Exchange and Man-in-the-Middle Attack** - Introduced at a basic level to show how incorrect or fake keys can affect secure communication.

### ✨ Features

- 🎯 Interactive escape-room format with engaging puzzles
- 🤖 AI-powered hint system (Cipher AI assistant)
- 📚 Progressive difficulty through 4 rooms
- 🎨 Modern, cyber-punk themed UI
- 💡 Educational content that makes cryptography concepts easy to understand

### 🎯 Game Flow

The game begins with a short introduction that explains the storyline and basic game instructions. Players then move through different rooms by solving puzzles and making simple decisions. By using an escape-room format with interactive puzzles, **Escape the Hacker Room** presents cryptography concepts in a clear, engaging, and easy-to-understand way.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd CryptoProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the Gemini API Key**
   
   The game uses Google's Gemini API for the AI assistant (Cipher). The API key is already configured in the code, but you can also set it via environment variable:
   
   - Option 1: Create a `.env` file in the root directory:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   
   - Option 2: The API key is already hardcoded as a fallback

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to start playing!

### 🎮 How to Play

1. Read the introduction screen to understand the storyline
2. Click "Initiate Escape Protocol" to begin
3. Solve each cryptography puzzle to progress to the next room
4. Use the Cipher AI assistant (sidebar) for hints if you get stuck
5. Complete all 4 rooms to escape!

## 📁 Project Structure

```
CryptoProject/
├── components/
│   ├── CipherAssistant.tsx  # AI assistant chat component
│   └── Terminal.tsx          # Puzzle terminal interface
├── services/
│   └── geminiService.ts      # Gemini API integration
├── App.tsx                   # Main game component
├── constants.ts              # Game levels and puzzles
├── types.ts                  # TypeScript type definitions
├── index.tsx                 # Application entry point
└── index.html                # HTML template
```

## 🛠️ Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **Google Gemini API** - AI-powered hints

## 🎓 Educational Value

This game is designed to make cryptography concepts accessible and engaging for students and beginners. Through interactive puzzles, players learn:

- How encryption transforms readable messages
- Basic cipher techniques (Caesar cipher)
- Secure key exchange mechanisms
- Security threats like MITM attacks

## 📝 License

This project is part of an educational application demonstration.

## 🤝 Contributing

This is an educational project. Feel free to use it as a learning resource or adapt it for educational purposes.

---

**Enjoy escaping the hacker room! 🔓**
