
import { LevelData } from './types';

export const LEVELS: Record<string, LevelData> = {
  1: {
    id: 1,
    title: "The Caesar Shift",
    description: "The hacker has locked the first terminal using a classic Caesar Cipher. All letters are shifted by 3 positions forward in the alphabet.",
    concept: "Symmetric Encryption (Shift Cipher)",
    encryptedMessage: "WKH KDFNHU LV KHUH",
    correctAnswer: "THE HACKER IS HERE",
    instruction: "Decrypt the message using a shift of -3.",
    hints: [
      "A shift of 3 means 'A' becomes 'D'. So to reverse it, 'D' becomes 'A'.",
      "Look at the word 'WKH'. If you move 'W' back 3 spots, what do you get?",
      "The message is warning you about the hacker's location."
    ]
  },
  2: {
    id: 2,
    title: "Encryption vs Decryption",
    description: "A logic gate stands in your way. To pass, you must correctly identify which process is which.",
    concept: "Core Cryptography Principles",
    instruction: "Which process turns 'Plaintext' into 'Ciphertext' using a key?",
    correctAnswer: "encryption",
    hints: [
      "Encryption makes things unreadable; Decryption makes them readable again.",
      "Think of it like locking (Encrypt) and unlocking (Decrypt) a box.",
      "The answer is a single word starting with 'E'."
    ]
  },
  3: {
    id: 3,
    title: "Secure Key Exchange",
    description: "You need to share a secret key with a friendly AI, but the hacker is eavesdropping. We need a way to agree on a key without sending the key itself.",
    concept: "Diffie-Hellman Key Exchange",
    instruction: "If Alice and Bob share a base 'G' and prime 'P', then combine their private keys, they get a shared secret. What is this shared result called?",
    correctAnswer: "shared secret",
    hints: [
      "It's a secret that both parties 'share' once they finish the exchange.",
      "The answer is two words: 'shared ______'.",
      "Both people end up with exactly the same key."
    ]
  },
  4: {
    id: 4,
    title: "Man-in-the-Middle Attack",
    description: "The hacker is trying to intercept your exit code. One of these three packets has been modified. Identify the fake one by checking the checksum.",
    concept: "Integrity and MITM",
    instruction: "Packet A: CRC=12. Packet B: CRC=55. Packet C: CRC=99. The expected CRC for the exit code is 55. Which packet is the real one?",
    correctAnswer: "B",
    hints: [
      "Look for the packet whose CRC (checksum) matches the expected value of 55.",
      "A hacker would change the content, which usually changes the CRC.",
      "Just type the letter of the correct packet: A, B, or C."
    ]
  }
};
