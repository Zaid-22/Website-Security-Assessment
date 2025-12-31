# Website Security Assessment & Guidance Web Tool

A comprehensive web-based security assessment tool for evaluating website security posture, developed as part of the Information Security Management course project.

## Features

### 1. Website Security Assessment
- **SSL/TLS Certificate Analysis**: Validates certificate validity, expiration dates, issuer information, and encryption protocols
- **HTTP Security Headers Check**: Analyzes presence of critical security headers including:
  - HSTS (HTTP Strict Transport Security)
  - CSP (Content Security Policy)
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy
- **DNS Record Analysis**: Checks A, AAAA, MX, NS, and TXT records
- **Risk Assessment**: Provides Low/Medium/High risk rating based on identified vulnerabilities
- **Recommendations**: Suggests specific security controls and improvements

### 2. Cybersecurity Terms Dictionary
- Comprehensive list of 40+ cybersecurity terms
- Organized by categories:
  - Cryptography
  - Web Security
  - Network Security
  - Risk Management
  - Security Operations
  - Social Engineering
  - Threats
  - Access Control
  - Governance
- Each term includes definition and context

## Installation

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env if you need to add API keys for additional services
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Usage

### Running a Security Assessment

1. Enter a website/domain in the input field (e.g., `example.com` or `https://example.com`)
2. Click the "Test" button
3. Review the comprehensive security report including:
   - Overall risk assessment
   - SSL/TLS certificate details
   - HTTP security headers status
   - DNS record information
   - Identified issues
   - Recommended controls and improvements

### Viewing Cybersecurity Terms

1. Click the "Cybersecurity Terms" tab
2. Browse terms organized by category
3. Each term includes a clear definition and context

## Technical Architecture

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern responsive design with gradient styling
- **JavaScript (ES6+)**: Client-side logic and API communication

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Native Modules**: 
  - `https`: SSL/TLS certificate validation
  - `dns`: DNS record resolution
  - `axios`: HTTP requests for header analysis

### Security Features
- API keys stored server-side (not exposed to client)
- Input validation and sanitization
- Error handling and timeout protection
- Ethical usage disclaimer

## Project Structure

```
Sec/
├── server.js              # Express server and API endpoints
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/               # Frontend files
    ├── index.html        # Main HTML page
    ├── style.css         # Styling
    └── script.js         # Client-side JavaScript
```

## API Endpoints

### POST `/api/assess`
Performs security assessment on a website/domain.

**Request Body**:
```json
{
  "website": "example.com"
}
```

**Response**:
```json
{
  "domain": "example.com",
  "timestamp": "2025-12-20T10:00:00.000Z",
  "ssl": { ... },
  "headers": { ... },
  "dns": { ... },
  "risk": {
    "score": 25,
    "level": "Medium",
    "issues": [ ... ]
  }
}
```

### GET `/api/terms`
Returns list of cybersecurity terms with definitions.

**Response**:
```json
{
  "terms": [
    {
      "term": "SSL/TLS",
      "category": "Cryptography",
      "definition": "..."
    },
    ...
  ]
}
```

## Testing

Test the application with various websites:
- Educational institutions (e.g., `mit.edu`)
- E-commerce sites (e.g., `amazon.com`)
- Government sites (e.g., `gov.uk`)
- Small business websites
- Personal blogs

## Ethical Considerations

⚠️ **Important**: This tool is designed for educational and informational purposes only. 

- Only test publicly accessible websites
- Do not use for unauthorized security testing
- Respect rate limits and server resources
- Follow responsible disclosure practices
- Results are informational and not a guarantee of security

## Limitations

- Assessment is based on publicly available information
- Some checks may timeout for slow-responding servers
- Results reflect a snapshot in time
- Not all security vulnerabilities can be detected remotely
- Does not perform intrusive testing or exploitation



## Authors

Course Project Team - Information Security Management (1st Semester 2025-2026)

---

**Disclaimer**: This tool provides informational security assessments only. Results are not a guarantee of security and should be used as guidance only.

# Website-Security-Assessment
