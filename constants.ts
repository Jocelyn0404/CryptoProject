
import { CategoryData } from './types';

export const CATEGORIES: Record<string, CategoryData> = {
  'encryption-decryption': {
    id: 'encryption-decryption',
    name: 'Encryption & Decryption',
    description: 'Master the fundamental processes of encryption and decryption',
    levels: {
      1: {
        id: 1,
        title: "What is Encryption?",
        description: "Learn the basics of encryption",
        concept: "Encryption Basics",
        knowledge: "Encryption is the process of converting plaintext into ciphertext using an algorithm and key. It ensures data confidentiality by making it unreadable to unauthorized parties.",
        instruction: "What process converts readable text into unreadable ciphertext?",
        correctAnswer: "encryption",
        hints: ["It starts with 'E'", "Opposite of decryption", "Makes data secure"],
        feedback: "Encryption protects your data by scrambling it so only authorized parties can read it. Great start!"
      },
      2: {
        id: 2,
        title: "What is Decryption?",
        description: "Understand the reverse process",
        concept: "Decryption Basics",
        knowledge: "Decryption is the process of converting ciphertext back into plaintext using the appropriate key. It reverses encryption to make data readable again.",
        instruction: "What process converts ciphertext back to readable text?",
        correctAnswer: "decryption",
        hints: ["It starts with 'D'", "Opposite of encryption", "Unlocks the data"],
        feedback: "Decryption is the key to unlocking encrypted data. Without the right key, it's impossible!"
      },
      3: {
        id: 3,
        title: "Symmetric vs Asymmetric",
        description: "Compare encryption types",
        concept: "Encryption Types",
        knowledge: "Symmetric encryption uses the same key for encryption and decryption. Asymmetric encryption uses different keys (public and private) for each operation.",
        instruction: "Which encryption uses the same key for both encryption and decryption?",
        correctAnswer: "symmetric",
        hints: ["Same key for both", "Faster but key distribution issue", "AES is an example"],
        feedback: "Symmetric encryption is fast and efficient, but securely sharing the key is challenging."
      },
      4: {
        id: 4,
        title: "Public Key Encryption",
        description: "Explore asymmetric encryption",
        concept: "Asymmetric Encryption",
        knowledge: "In asymmetric encryption, anyone can encrypt with the public key, but only the private key holder can decrypt. This solves key distribution problems.",
        instruction: "In asymmetric encryption, which key is shared publicly?",
        correctAnswer: "public key",
        hints: ["Everyone can see it", "Used for encryption", "Paired with private key"],
        feedback: "Public keys can be shared openly, while private keys must remain secret. Brilliant!"
      },
      5: {
        id: 5,
        title: "Encryption Algorithms",
        description: "Common encryption methods",
        concept: "Encryption Algorithms",
        knowledge: "AES (Advanced Encryption Standard) is a symmetric algorithm widely used today. RSA is asymmetric and used for key exchange and digital signatures.",
        instruction: "Which is a widely used symmetric encryption standard?",
        correctAnswer: "aes",
        hints: ["Three letters", "Advanced Encryption Standard", "Replaced DES"],
        feedback: "AES is the gold standard for symmetric encryption, used everywhere from banking to messaging apps."
      },
      6: {
        id: 6,
        title: "Key Length Importance",
        description: "Why key size matters",
        concept: "Key Strength",
        knowledge: "Longer keys provide better security by making brute-force attacks computationally infeasible. 128-bit AES keys are considered secure for most purposes.",
        instruction: "Longer encryption keys provide what?",
        correctAnswer: "better security",
        hints: ["Makes cracking harder", "Resists brute force", "Trade-off with speed"],
        feedback: "Key length is crucial - longer keys exponentially increase security against attacks."
      },
      7: {
        id: 7,
        title: "Block vs Stream Ciphers",
        description: "Different cipher modes",
        concept: "Cipher Types",
        knowledge: "Block ciphers encrypt data in fixed-size blocks. Stream ciphers encrypt data bit-by-bit, often used for real-time communications.",
        instruction: "Which cipher type encrypts data in fixed-size blocks?",
        correctAnswer: "block",
        hints: ["Fixed size chunks", "AES is this type", "Padding may be needed"],
        feedback: "Block ciphers process data in chunks, while stream ciphers work continuously."
      },
      8: {
        id: 8,
        title: "End-to-End Encryption",
        description: "Complete data protection",
        concept: "E2E Encryption",
        knowledge: "End-to-end encryption ensures only communicating parties can read messages. The encryption/decryption happens on users' devices, not servers.",
        instruction: "In end-to-end encryption, where does decryption occur?",
        correctAnswer: "user devices",
        hints: ["Not on servers", "Only sender and receiver", "WhatsApp uses this"],
        feedback: "E2E encryption means even service providers can't read your messages. Privacy guaranteed!"
      },
      9: {
        id: 9,
        title: "Perfect Forward Secrecy",
        description: "Future-proofing encryption",
        concept: "Forward Secrecy",
        knowledge: "Perfect Forward Secrecy ensures that compromising long-term keys doesn't decrypt past communications. Each session uses unique keys.",
        instruction: "What does PFS protect against?",
        correctAnswer: "past communications",
        hints: ["Even if keys are stolen", "Session keys are unique", "Future conversations safe"],
        feedback: "PFS ensures that even if your keys are compromised, past messages remain secure."
      },
      10: {
        id: 10,
        title: "Quantum-Resistant Encryption",
        description: "Future-proofing against quantum computers",
        concept: "Post-Quantum Crypto",
        knowledge: "Quantum computers threaten current encryption. Post-quantum cryptography uses algorithms resistant to quantum attacks, like lattice-based cryptography.",
        instruction: "What type of computing threatens current encryption?",
        correctAnswer: "quantum",
        hints: ["Future technology", "Can break RSA easily", "Needs new algorithms"],
        feedback: "Quantum computing will revolutionize cryptography. We're preparing for that future!"
      }
    }
  },
  'caesar-cipher': {
    id: 'caesar-cipher',
    name: 'Caesar Cipher',
    description: 'Master the classic Caesar cipher and its variations',
    levels: {
      1: {
        id: 1,
        title: "Caesar Cipher Basics",
        description: "Learn the original Caesar cipher",
        concept: "Caesar Cipher",
        knowledge: "The Caesar cipher is a substitution cipher where each letter is shifted by a fixed number of positions. Julius Caesar used a shift of 3.",
        encryptedMessage: "WKLV LV D VHFUHW",
        correctAnswer: "THIS IS A SECRET",
        instruction: "Decrypt this message with a shift of 3.",
        hints: ["A becomes D, B becomes E", "Count back 3 letters", "Caesar's favorite shift"],
        feedback: "The Caesar cipher was simple but effective for its time. Modern computers can break it instantly!"
      },
      2: {
        id: 2,
        title: "Shift Direction",
        description: "Understanding shift directions",
        concept: "Cipher Direction",
        knowledge: "Shifts can be forward (positive) or backward (negative). A shift of -3 is the same as a shift of 23 in a 26-letter alphabet.",
        instruction: "A forward shift of 3 is equivalent to a backward shift of what?",
        correctAnswer: "23",
        hints: ["26 - 3 = ?", "Same effect", "Modulo 26"],
        feedback: "Shifts wrap around the alphabet. Forward 3 equals backward 23!"
      },
      3: {
        id: 3,
        title: "Brute Force Attack",
        description: "Breaking Caesar cipher",
        concept: "Cipher Breaking",
        knowledge: "Caesar ciphers can be broken by trying all 25 possible shifts. This is called a brute force attack.",
        instruction: "How many possible shifts does a Caesar cipher have?",
        correctAnswer: "25",
        hints: ["All shifts except 0", "26 letters", "Easy to try all"],
        feedback: "With only 25 possibilities, Caesar ciphers are trivial to break with modern computing."
      },
      4: {
        id: 4,
        title: "ROT13 Cipher",
        description: "A special case of Caesar",
        concept: "ROT13",
        knowledge: "ROT13 is a Caesar cipher with a shift of 13. It's symmetric - applying it twice returns to the original text.",
        encryptedMessage: "GUR DHVPX OEBJA",
        correctAnswer: "THE QUICK BROWN",
        instruction: "Decrypt this ROT13 message.",
        hints: ["Shift of 13", "Same as encrypting again", "Common in puzzles"],
        feedback: "ROT13 is still used today for hiding spoilers and puzzle answers. It's not secure, but fun!"
      },
      5: {
        id: 5,
        title: "Case Preservation",
        description: "Handling uppercase and lowercase",
        concept: "Case Sensitivity",
        knowledge: "Caesar ciphers typically preserve case. Uppercase letters shift among uppercase, lowercase among lowercase.",
        instruction: "In Caesar cipher, do uppercase and lowercase letters shift separately?",
        correctAnswer: "yes",
        hints: ["A and a are different", "Preserves case", "Two separate alphabets"],
        feedback: "Case preservation makes Caesar ciphers slightly more complex but still breakable."
      },
      6: {
        id: 6,
        title: "Non-Alphabetic Characters",
        description: "Handling punctuation and numbers",
        concept: "Character Handling",
        knowledge: "Most Caesar implementations leave non-alphabetic characters unchanged. Only letters A-Z and a-z are shifted.",
        instruction: "What happens to spaces and punctuation in Caesar cipher?",
        correctAnswer: "unchanged",
        hints: ["Not shifted", "Preserved as-is", "Only letters move"],
        feedback: "Leaving punctuation unchanged actually helps cryptanalysts by preserving word structure."
      },
      7: {
        id: 7,
        title: "Frequency Analysis",
        description: "Breaking ciphers with statistics",
        concept: "Cryptanalysis",
        knowledge: "Frequency analysis counts letter occurrences. In English, 'E' is most common. In ciphertext, the most frequent letter likely represents 'E'.",
        instruction: "Which English letter appears most frequently?",
        correctAnswer: "e",
        hints: ["Most common vowel", "About 12% of text", "Ciphertext equivalent"],
        feedback: "Frequency analysis made Caesar ciphers obsolete. Modern ciphers resist statistical attacks."
      },
      8: {
        id: 8,
        title: "Vigenère Cipher",
        description: "A more advanced polyalphabetic cipher",
        concept: "Polyalphabetic",
        knowledge: "Vigenère uses multiple Caesar ciphers with different shifts based on a keyword. Each keyword letter determines the shift for the corresponding plaintext letter.",
        encryptedMessage: "WVYFHQ",
        correctAnswer: "ATTACK",
        instruction: "Decrypt using keyword 'LEMON'.",
        hints: ["L=11, E=4, M=12, O=14, N=13", "Repeats for longer text", "More secure than Caesar"],
        feedback: "Vigenère was considered unbreakable for centuries until frequency analysis techniques advanced."
      },
      9: {
        id: 9,
        title: "Cipher Disk",
        description: "Mechanical Caesar cipher",
        concept: "Cipher Tools",
        knowledge: "The cipher disk is a mechanical tool with two concentric disks. Rotating them implements different Caesar shifts.",
        instruction: "What tool uses rotating disks for Caesar cipher?",
        correctAnswer: "cipher disk",
        hints: ["Mechanical device", "Two disks", "Rotates for different shifts"],
        feedback: "Cipher disks made encryption accessible to spies and military personnel throughout history."
      },
      10: {
        id: 10,
        title: "Modern Caesar Applications",
        description: "Caesar in modern cryptography",
        concept: "Legacy Ciphers",
        knowledge: "While insecure alone, Caesar principles appear in modern ciphers as building blocks. Understanding Caesar helps grasp more complex algorithms.",
        instruction: "Why study Caesar cipher today?",
        correctAnswer: "foundation",
        hints: ["Building block", "Understanding basics", "Historical importance"],
        feedback: "Caesar cipher teaches fundamental concepts that apply to all modern encryption systems."
      }
    }
  },
  'man-in-the-middle': {
    id: 'man-in-the-middle',
    name: 'Man-in-the-Middle Attack',
    description: 'Learn about MITM attacks and how to prevent them',
    levels: {
      1: {
        id: 1,
        title: "What is MITM?",
        description: "Introduction to Man-in-the-Middle attacks",
        concept: "MITM Basics",
        knowledge: "A Man-in-the-Middle attack occurs when an attacker intercepts communication between two parties, potentially altering or eavesdropping on the data.",
        instruction: "What does MITM stand for?",
        correctAnswer: "man in the middle",
        hints: ["Three words", "Attack type", "Intercepts communication"],
        feedback: "MITM attacks are dangerous because victims often don't realize they're being spied on."
      },
      2: {
        id: 2,
        title: "MITM on Public WiFi",
        description: "Common attack scenario",
        concept: "Public Network Attacks",
        knowledge: "Public WiFi networks are prime targets for MITM attacks. Attackers can set up rogue access points or ARP poison legitimate ones.",
        instruction: "Where are MITM attacks most common?",
        correctAnswer: "public wifi",
        hints: ["Free networks", "Coffee shops", "Airports"],
        feedback: "Always avoid sensitive activities on public WiFi. Use VPNs for protection."
      },
      3: {
        id: 3,
        title: "ARP Poisoning",
        description: "A common MITM technique",
        concept: "ARP Spoofing",
        knowledge: "ARP poisoning sends fake ARP messages to associate attacker's MAC address with victim's IP address, redirecting traffic through the attacker.",
        instruction: "What protocol is exploited in ARP poisoning?",
        correctAnswer: "arp",
        hints: ["Address Resolution Protocol", "Links IP to MAC", "No authentication"],
        feedback: "ARP doesn't authenticate responses, making it vulnerable to spoofing attacks."
      },
      4: {
        id: 4,
        title: "SSL Stripping",
        description: "Downgrading secure connections",
        concept: "SSL Attacks",
        knowledge: "SSL stripping intercepts HTTPS requests and redirects them to HTTP, allowing the attacker to read and modify unencrypted traffic.",
        instruction: "What does SSL stripping do to HTTPS connections?",
        correctAnswer: "downgrades to http",
        hints: ["Removes encryption", "HTTP instead of HTTPS", "Intercepts requests"],
        feedback: "Modern browsers prevent SSL stripping with HSTS (HTTP Strict Transport Security)."
      },
      5: {
        id: 5,
        title: "Certificate Pinning",
        description: "Preventing fake certificates",
        concept: "Certificate Security",
        knowledge: "Certificate pinning associates a host with its expected certificate. If the certificate changes, the connection is rejected.",
        instruction: "What prevents MITM with fake certificates?",
        correctAnswer: "certificate pinning",
        hints: ["Checks certificate fingerprint", "Hardcoded in app", "Prevents CA compromise"],
        feedback: "Certificate pinning protects against compromised Certificate Authorities."
      },
      6: {
        id: 6,
        title: "DNS Spoofing",
        description: "Redirecting domain lookups",
        concept: "DNS Attacks",
        knowledge: "DNS spoofing provides fake DNS responses, directing users to malicious websites instead of legitimate ones.",
        instruction: "What does DNS spoofing redirect?",
        correctAnswer: "domain lookups",
        hints: ["IP address resolution", "Fake DNS server", "Wrong website"],
        feedback: "DNSSEC (Domain Name System Security Extensions) prevents DNS spoofing."
      },
      7: {
        id: 7,
        title: "VPN Protection",
        description: "How VPNs prevent MITM",
        concept: "VPN Security",
        knowledge: "VPNs create encrypted tunnels that prevent MITM attacks by ensuring traffic goes directly to the VPN server, not through local networks.",
        instruction: "What creates encrypted tunnels to prevent MITM?",
        correctAnswer: "vpn",
        hints: ["Virtual Private Network", "Encrypts all traffic", "Bypasses local network"],
        feedback: "VPNs are essential for public WiFi security and preventing ISP-level MITM attacks."
      },
      8: {
        id: 8,
        title: "Two-Factor Authentication",
        description: "Additional security layer",
        concept: "2FA Protection",
        knowledge: "2FA requires a second authentication factor beyond passwords. Even if credentials are stolen via MITM, the attacker needs the second factor.",
        instruction: "What requires something you have plus something you know?",
        correctAnswer: "two factor authentication",
        hints: ["2FA", "Phone/SMS token", "Hardware key"],
        feedback: "2FA protects against credential theft, even in successful MITM attacks."
      },
      9: {
        id: 9,
        title: "HTTPS Everywhere",
        description: "Encrypting web traffic",
        concept: "Web Encryption",
        knowledge: "HTTPS encrypts web traffic end-to-end. MITM attackers see only encrypted data, not the actual content.",
        instruction: "What protocol encrypts web traffic?",
        correctAnswer: "https",
        hints: ["Secure HTTP", "Padlock icon", "Certificate required"],
        feedback: "HTTPS is now the default for all websites. HTTP sites are flagged as insecure by browsers."
      },
      10: {
        id: 10,
        title: "Advanced MITM Prevention",
        description: "Comprehensive defense strategies",
        concept: "MITM Defense",
        knowledge: "Preventing MITM requires multiple layers: encryption, authentication, network security, and user awareness. No single solution is foolproof.",
        instruction: "What is essential for complete MITM protection?",
        correctAnswer: "multiple layers",
        hints: ["Not just one thing", "Defense in depth", "Encryption + authentication"],
        feedback: "MITM prevention requires a holistic approach combining technology and user education."
      }
    }
  }
};
