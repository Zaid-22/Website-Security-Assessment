# Website Security Assessment Tool - Complete Explanation Report

## Table of Contents
1. [What is This Website?](#what-is-this-website)
2. [How Does It Work?](#how-does-it-work)
3. [File Structure Explained](#file-structure-explained)
4. [Technical Terms Glossary](#technical-terms-glossary)
5. [How to Use the Website](#how-to-use-the-website)
6. [Code Explanation](#code-explanation)

---

## What is This Website?

This is a **Website Security Assessment Tool** - a web application that helps people check if a website is secure. Think of it like a security guard for websites!

### Main Purpose
- **Checks website security**: It examines websites to see if they have proper security measures in place
- **Provides reports**: It creates a detailed report showing what's secure and what needs improvement
- **Educational**: It includes a dictionary of cybersecurity terms to help people learn

### What It Does
1. **SSL/TLS Certificate Check**: Verifies if the website uses secure connections (the lock icon you see in browsers)
2. **Security Headers Check**: Looks for protective settings that prevent common web attacks
3. **DNS Check**: Examines the website's address system to ensure it's properly configured
4. **Risk Assessment**: Calculates how secure the website is overall (Low, Medium, or High risk)

---

## How Does It Work?

### The Flow (Step by Step)

1. **User opens the website** → The browser loads the HTML page
2. **User enters a website address** (like "example.com") → User types in the input box
3. **User clicks "Test" button** → JavaScript sends a request to the server
4. **Server performs security checks**:
   - Connects to the website to check SSL certificate
   - Requests the website to check security headers
   - Queries DNS servers to check DNS records
5. **Server calculates risk score** → Determines if the website is Low, Medium, or High risk
6. **Server sends results back** → JavaScript receives the data
7. **Results displayed** → The report appears on the screen

### Architecture

```
[User's Browser] 
    ↕ (HTTP Requests)
[Express Server] 
    ↕ (Connects to)
[Target Website] 
    ↕ (DNS Queries)
[DNS Servers]
```

**Frontend**: What users see (HTML, CSS, JavaScript in the browser)  
**Backend**: The server that does the actual security checking (Node.js/Express)

---

## File Structure Explained

### Project Files

#### 1. **package.json**
**What it is**: A configuration file that lists all the tools and libraries the project needs

**Key Contents**:
- **"name"**: The project name - "website-security-assessment-tool"
- **"dependencies"**: External libraries the project uses:
  - `express`: Web server framework (creates the server)
  - `axios`: HTTP client (makes requests to websites)
  - `cors`: Cross-Origin Resource Sharing (allows requests from browsers)
  - `dotenv`: Environment variables (stores configuration)
  - `md-to-pdf`: Converts markdown to PDF (for reports)
- **"scripts"**: Commands you can run:
  - `npm start`: Starts the server
  - `npm run dev`: Starts server with auto-restart on changes

**Why it matters**: It tells Node.js what software to install before running the project

---

#### 2. **server.js**
**What it is**: The main server file - the "brain" of the application

**What it does**:
- Creates an Express server (web server)
- Defines API endpoints (URLs the server responds to)
- Performs security checks
- Sends results back to the browser

**Key Functions**:

1. **getSSLCertificateInfo(hostname)**
   - Connects to a website on port 443 (HTTPS port)
   - Retrieves the SSL/TLS certificate
   - Checks if it's valid, when it expires, who issued it

2. **checkSecurityHeaders(url)**
   - Makes an HTTP request to the website
   - Examines the response headers
   - Looks for security headers like HSTS, CSP, X-Frame-Options

3. **performDNSChecks(domain)**
   - Queries DNS servers
   - Gets A records (IPv4 addresses)
   - Gets AAAA records (IPv6 addresses)
   - Gets MX records (mail servers)
   - Gets TXT records (text records)
   - Gets NS records (name servers)

4. **calculateRiskScore(sslInfo, headersInfo, dnsInfo)**
   - Assigns points based on security issues found
   - Determines overall risk level (Low/Medium/High)

**API Endpoints**:
- `POST /api/assess`: Receives a website address, performs checks, returns report
- `GET /api/terms`: Returns list of cybersecurity terms and definitions

---

#### 3. **public/index.html**
**What it is**: The structure/layout of the webpage

**Key Sections**:

1. **`<head>`**: Contains metadata and links to CSS/JavaScript
   - `<title>`: What appears in the browser tab
   - `<link rel="stylesheet">`: Links to the CSS file for styling

2. **`<body>`**: The visible content
   - **Header**: Title and subtitle with lock icon
   - **Disclaimer**: Warning about using the tool ethically
   - **Tabs**: Two buttons to switch between "Website Test" and "Cybersecurity Terms"
   - **Input Section**: Text box to enter website address and "Test" button
   - **Loading Section**: Shows spinner while checking
   - **Report Section**: Where results are displayed

**What HTML means**: HyperText Markup Language - the language used to create web pages

---

#### 4. **public/script.js**
**What it is**: JavaScript code that makes the webpage interactive

**Key Functions**:

1. **showTab(tabName)**
   - Shows/hides different sections of the page
   - Switches between "Assessment" and "Terms" tabs

2. **runAssessment()**
   - Gets the website address from the input box
   - Sends a POST request to `/api/assess`
   - Shows loading spinner
   - Receives the report data
   - Calls `displayReport()` to show results

3. **displayReport(report)**
   - Takes the report data from server
   - Formats it into HTML
   - Creates cards for SSL info, Security Headers, DNS records
   - Shows issues and recommendations
   - Displays everything on the page

4. **generateRecommendations(report)**
   - Analyzes the report
   - Creates suggestions for improvement
   - Returns list of recommendations

5. **loadCybersecurityTerms()**
   - Fetches terms from `/api/terms`
   - Groups terms by category
   - Displays them in cards

**What JavaScript means**: A programming language that runs in the browser to make web pages interactive

---

#### 5. **public/style.css**
**What it is**: Stylesheet that controls how the webpage looks (colors, fonts, layout)

**What CSS means**: Cascading Style Sheets - the language used to style HTML pages

**Key Style Elements**:
- **Colors**: Defines color scheme (blues, greens, reds for different statuses)
- **Layout**: Uses CSS Grid and Flexbox for responsive design
- **Typography**: Defines font sizes, weights, families
- **Components**: Styles for cards, buttons, input boxes, badges
- **Responsive Design**: Makes the site work on mobile devices

---

## Technical Terms Glossary

### General Web Terms

#### **HTML (HyperText Markup Language)**
- **Definition**: The standard language for creating web pages
- **Analogy**: Like the skeleton of a house - it provides the structure
- **Example**: `<h1>Title</h1>` creates a heading

#### **CSS (Cascading Style Sheets)**
- **Definition**: Language used to style and layout web pages
- **Analogy**: Like paint and furniture for a house - makes it look good
- **Example**: `color: blue;` makes text blue

#### **JavaScript**
- **Definition**: Programming language that runs in browsers to make pages interactive
- **Analogy**: Like electricity in a house - makes everything work
- **Example**: `button.onclick = function() { alert("Clicked!"); }`

#### **API (Application Programming Interface)**
- **Definition**: A way for different programs to communicate with each other
- **Analogy**: Like a restaurant menu - you order (request), kitchen prepares (processes), waiter brings it (response)
- **In this project**: The server exposes `/api/assess` and `/api/terms` as APIs

#### **HTTP (HyperText Transfer Protocol)**
- **Definition**: The protocol (rules) for transferring data on the web
- **Analogy**: Like postal service rules - standard way to send/receive packages
- **Example**: When you visit a website, your browser uses HTTP to request the page

#### **HTTPS (HTTP Secure)**
- **Definition**: HTTP with encryption - secure version of HTTP
- **Analogy**: Like sending a letter in a locked safe instead of a regular envelope
- **Visual**: Look for the lock icon (🔒) in your browser address bar

#### **Server**
- **Definition**: A computer that provides services to other computers (clients)
- **Analogy**: Like a restaurant kitchen - prepares and serves food (data) to customers (browsers)
- **In this project**: The `server.js` file runs a server that handles security checks

#### **Client**
- **Definition**: A device or program that requests services from a server
- **Analogy**: You (the customer) ordering food from a restaurant
- **In this project**: The user's web browser is the client

#### **Frontend**
- **Definition**: The part of a website users see and interact with
- **Analogy**: The restaurant dining room and menu - what customers see
- **In this project**: HTML, CSS, and JavaScript files in the `public/` folder

#### **Backend**
- **Definition**: The server-side part that processes requests and performs operations
- **Analogy**: The restaurant kitchen - where food is prepared, customers don't see it
- **In this project**: The `server.js` file

---

### Security Terms

#### **SSL/TLS (Secure Sockets Layer / Transport Layer Security)**
- **Definition**: Protocols that encrypt data between your browser and a website
- **Why it matters**: Prevents hackers from reading your data while it's being transmitted
- **Analogy**: Like speaking in a secret code only you and the website understand
- **What it checks**: Certificate validity, expiration date, who issued it

#### **Certificate Authority (CA)**
- **Definition**: A trusted organization that issues SSL/TLS certificates
- **Analogy**: Like a passport office that verifies your identity and issues passports
- **Example**: Let's Encrypt, DigiCert, GlobalSign

#### **SSL Certificate**
- **Definition**: A digital certificate that proves a website's identity and enables encryption
- **Why it matters**: Without it, data sent to/from website is unencrypted and vulnerable
- **Analogy**: Like an ID card that proves who you are and allows secure communication
- **What we check**: If it exists, if it's valid, when it expires

#### **Protocol**
- **Definition**: A set of rules for communication
- **Example**: TLS 1.2, TLS 1.3 (versions of the TLS protocol)
- **Why it matters**: Newer protocols are more secure

#### **Cipher**
- **Definition**: An algorithm used to encrypt data
- **Analogy**: Like a specific method of creating the secret code
- **Example**: AES-256-GCM (a strong encryption method)

---

### HTTP Security Headers

#### **HTTP Headers**
- **Definition**: Additional information sent with HTTP requests/responses
- **Analogy**: Like labels on a package that tell you how to handle it
- **Example**: `Content-Type: text/html` tells the browser it's receiving HTML

#### **HSTS (HTTP Strict Transport Security)**
- **Definition**: A header that forces browsers to use HTTPS (not HTTP)
- **Why it matters**: Prevents attackers from downgrading your connection to unencrypted HTTP
- **Analogy**: Like a rule that says "only use the secure entrance, never the regular one"
- **Header format**: `Strict-Transport-Security: max-age=31536000`

#### **CSP (Content Security Policy)**
- **Definition**: A header that controls which resources (scripts, images, etc.) a page can load
- **Why it matters**: Prevents XSS (Cross-Site Scripting) attacks
- **Analogy**: Like a bouncer at a club who only lets approved people in
- **Example**: Prevents malicious scripts from running on your page

#### **XSS (Cross-Site Scripting)**
- **Definition**: A security vulnerability where attackers inject malicious scripts into web pages
- **Why it matters**: Can steal user data, cookies, or redirect users to malicious sites
- **Analogy**: Like someone sneaking a harmful note into a public bulletin board
- **Prevention**: CSP header helps prevent this

#### **X-Frame-Options**
- **Definition**: A header that prevents a webpage from being displayed inside an iframe
- **Why it matters**: Prevents clickjacking attacks
- **Analogy**: Like preventing someone from putting your photo in their fake ID
- **Values**: `DENY` (never allow), `SAMEORIGIN` (only allow from same site)

#### **Clickjacking**
- **Definition**: An attack where a malicious site overlays invisible content over legitimate buttons
- **Why it matters**: Users click buttons thinking they're clicking one thing, but actually clicking another
- **Analogy**: Like a transparent sticker over a button that redirects your click
- **Prevention**: X-Frame-Options header

#### **X-Content-Type-Options**
- **Definition**: A header that prevents browsers from guessing file types (MIME type sniffing)
- **Why it matters**: Prevents attacks where malicious files are disguised as safe files
- **Value**: `nosniff` (don't guess, use what the server says)
- **Analogy**: Like checking ID instead of guessing someone's age

#### **X-XSS-Protection**
- **Definition**: A header that enables browser's built-in XSS filter (older browsers)
- **Status**: Deprecated in modern browsers (CSP is better)
- **Why it matters**: Was useful in older browsers, less important now

#### **Referrer-Policy**
- **Definition**: Controls how much referrer information is sent with requests
- **Why it matters**: Protects user privacy by limiting what information is shared
- **Example**: `no-referrer` means don't send any referrer information
- **Analogy**: Like choosing whether to tell the new website where you came from

#### **Permissions-Policy**
- **Definition**: Controls which browser features and APIs can be used (camera, microphone, geolocation, etc.)
- **Why it matters**: Prevents websites from accessing sensitive browser features without permission
- **Analogy**: Like controlling which rooms in a building visitors can access

---

### DNS Terms

#### **DNS (Domain Name System)**
- **Definition**: The system that converts domain names (like google.com) to IP addresses (like 172.217.164.110)
- **Analogy**: Like a phone book that converts names to phone numbers
- **Why it matters**: Without DNS, you'd have to remember IP addresses (numbers) instead of domain names

#### **Domain Name**
- **Definition**: A human-readable address for a website (e.g., example.com)
- **Analogy**: Like a street address that's easier to remember than GPS coordinates
- **Example**: `google.com`, `github.com`, `example.org`

#### **IP Address (Internet Protocol Address)**
- **Definition**: A numerical label assigned to each device on a network
- **Types**: 
  - IPv4: 32-bit number (e.g., 192.168.1.1)
  - IPv6: 128-bit number (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334)
- **Analogy**: Like a house number on a street

#### **A Record**
- **Definition**: DNS record that maps a domain to an IPv4 address
- **Example**: `example.com → 93.184.216.34`
- **What it means**: "When someone visits example.com, send them to this IPv4 address"

#### **AAAA Record**
- **Definition**: DNS record that maps a domain to an IPv6 address
- **Example**: `example.com → 2606:2800:220:1:248:1893:25c8:1946`
- **What it means**: Like A record but for IPv6 (newer address format)

#### **MX Record (Mail Exchange)**
- **Definition**: DNS record that specifies mail servers for a domain
- **Why it matters**: Tells email systems where to send emails for that domain
- **Example**: `example.com → mail.example.com (priority 10)`
- **Analogy**: Like a post office address for mail delivery

#### **NS Record (Name Server)**
- **Definition**: DNS record that specifies which DNS servers are authoritative for a domain
- **Why it matters**: Points to servers that have the complete DNS information for the domain
- **Example**: `example.com → ns1.example.com`
- **Analogy**: Like listing which libraries have the complete phone book for a city

#### **TXT Record (Text Record)**
- **Definition**: DNS record that stores text information (often used for verification)
- **Common uses**: 
  - SPF records (email authentication)
  - DKIM records (email authentication)
  - Domain verification
- **Example**: `v=spf1 include:_spf.google.com ~all`
- **Analogy**: Like notes in a contact card

#### **CNAME Record (Canonical Name)**
- **Definition**: DNS record that maps one domain name to another (alias)
- **Example**: `www.example.com → example.com`
- **Analogy**: Like a nickname that points to someone's real name

---

### Security Assessment Terms

#### **Risk Assessment**
- **Definition**: The process of evaluating security risks and determining their severity
- **In this project**: Calculates a risk score based on SSL, headers, and DNS checks
- **Levels**: Low, Medium, High
- **Analogy**: Like a health check that gives you an overall health score

#### **Risk Score**
- **Definition**: A numerical value representing the security risk level
- **How it works**: Points are added for each security issue found
- **Scoring**:
  - 0-19: Low risk
  - 20-49: Medium risk
  - 50+: High risk
- **Analogy**: Like a test score - higher score = more problems

#### **Vulnerability**
- **Definition**: A weakness in a system that could be exploited by attackers
- **Example**: Missing security headers, expired SSL certificate
- **Analogy**: Like a weak lock on a door

#### **Threat**
- **Definition**: A potential danger that could exploit vulnerabilities
- **Example**: Hackers, malware, phishing attacks
- **Analogy**: Like a potential burglar trying to break in

#### **Security Audit**
- **Definition**: A systematic evaluation of security measures
- **In this project**: That's what this tool does - audits website security
- **Analogy**: Like a building inspection for security

#### **Penetration Testing**
- **Definition**: Authorized simulated attacks to test security
- **Note**: This tool does NOT do penetration testing - it only checks publicly available information
- **Analogy**: Like hiring a security expert to try to break into your building (legally)

---

### Programming Terms

#### **Node.js**
- **Definition**: A JavaScript runtime that allows JavaScript to run on servers (not just browsers)
- **Why it matters**: Allows using JavaScript for both frontend and backend
- **Analogy**: Like an interpreter that speaks JavaScript outside of browsers

#### **Express.js (Express)**
- **Definition**: A web framework for Node.js that simplifies creating web servers
- **Why it matters**: Makes it easier to create APIs and handle HTTP requests
- **Analogy**: Like a template or toolkit for building web servers

#### **NPM (Node Package Manager)**
- **Definition**: Tool for installing and managing JavaScript packages/libraries
- **Usage**: `npm install` downloads dependencies listed in package.json
- **Analogy**: Like an app store for JavaScript code

#### **Middleware**
- **Definition**: Functions that run between receiving a request and sending a response
- **In this project**: 
  - `cors()`: Allows cross-origin requests
  - `express.json()`: Parses JSON in request bodies
  - `express.static()`: Serves static files (HTML, CSS, JS)
- **Analogy**: Like checkpoints or processing stations in a factory

#### **API Endpoint**
- **Definition**: A specific URL where an API can be accessed
- **In this project**:
  - `POST /api/assess`: Endpoint for security assessments
  - `GET /api/terms`: Endpoint for cybersecurity terms
- **Analogy**: Like specific doors in a building - each door leads to a different service

#### **POST Request**
- **Definition**: HTTP method for sending data to a server
- **Use case**: Used when you want to create something or send data (like website address)
- **Analogy**: Like mailing a letter with information inside

#### **GET Request**
- **Definition**: HTTP method for retrieving data from a server
- **Use case**: Used when you want to get information (like the terms list)
- **Analogy**: Like asking for a brochure - you're just getting information

#### **JSON (JavaScript Object Notation)**
- **Definition**: A format for storing and transmitting data (lightweight, text-based)
- **Example**: `{"name": "example.com", "risk": "low"}`
- **Why it matters**: Easy for both humans and computers to read
- **Analogy**: Like a structured form that both people and computers can understand

#### **Async/Await**
- **Definition**: JavaScript syntax for handling asynchronous operations (operations that take time)
- **Why it matters**: Allows code to wait for operations like network requests to complete
- **Analogy**: Like ordering food and waiting for it instead of standing there blocking the line

#### **Promise**
- **Definition**: An object representing the eventual result of an asynchronous operation
- **States**: Pending, Fulfilled, Rejected
- **Analogy**: Like a ticket you get when ordering food - it promises you'll get food later

#### **Function**
- **Definition**: A block of code that performs a specific task
- **Analogy**: Like a recipe - you follow steps to get a result
- **Example**: `calculateRiskScore()` is a function that calculates risk

#### **Variable**
- **Definition**: A container that stores a value
- **Analogy**: Like a labeled box where you store something
- **Example**: `const domain = "example.com"` stores the domain name

#### **DOM (Document Object Model)**
- **Definition**: A representation of the HTML page that JavaScript can manipulate
- **Why it matters**: Allows JavaScript to change what's displayed on the page
- **Analogy**: Like a map of the webpage that JavaScript can edit

---

### Network Terms

#### **Port**
- **Definition**: A numbered endpoint for communication on a server
- **Common ports**:
  - Port 80: HTTP (unencrypted web traffic)
  - Port 443: HTTPS (encrypted web traffic)
  - Port 3000: Commonly used for development servers (like this project)
- **Analogy**: Like different doors in a building - each door (port) serves a different purpose

#### **Request**
- **Definition**: A message sent from client to server asking for something
- **Example**: Browser requests a webpage from a server
- **Analogy**: Like asking a question

#### **Response**
- **Definition**: A message sent from server to client answering the request
- **Example**: Server sends back the webpage HTML
- **Analogy**: Like answering the question

#### **Timeout**
- **Definition**: Maximum time to wait for a response before giving up
- **In this project**: SSL checks timeout after 5 seconds
- **Analogy**: Like waiting 5 minutes for someone to answer, then leaving

#### **CORS (Cross-Origin Resource Sharing)**
- **Definition**: A mechanism that allows web pages to make requests to different domains
- **Why it matters**: Browsers block cross-origin requests by default for security
- **In this project**: The server uses `cors()` middleware to allow requests from browsers
- **Analogy**: Like giving permission for visitors from other cities to enter

---

## How to Use the Website

### Starting the Server

1. **Open Terminal/Command Prompt**
   - Navigate to the project folder: `cd /path/to/Sec`

2. **Install Dependencies** (first time only)
   ```bash
   npm install
   ```
   - This reads `package.json` and downloads all required libraries

3. **Start the Server**
   ```bash
   npm start
   ```
   - Server starts on `http://localhost:3000`
   - You'll see: "Server running on http://localhost:3000"

4. **Open in Browser**
   - Go to: `http://localhost:3000`
   - You'll see the website interface

### Using the Website Test Feature

1. **Enter a Website Address**
   - Type a domain name in the input box (e.g., `example.com` or `google.com`)
   - Don't need to include `http://` or `https://`
   - Don't need `www.`

2. **Click "Test" Button**
   - Or press Enter key
   - Loading spinner appears

3. **View Results**
   - Report appears showing:
     - **Overall Risk Level**: Badge showing Low/Medium/High
     - **SSL/TLS Certificate**: Validity, expiration, issuer
     - **Security Headers**: Which headers are present/missing
     - **DNS Records**: A, AAAA, MX, NS, TXT records
     - **Issues**: List of security problems found
     - **Recommendations**: Suggestions for improvement

### Using the Cybersecurity Terms Feature

1. **Click "Cybersecurity Terms" Tab**
   - Switches from "Website Test" to "Terms" view

2. **Browse Terms**
   - Terms are grouped by category (Cryptography, Web Security, etc.)
   - Each term shows:
     - Category
     - Term name
     - Definition/explanation

3. **Search/Learn**
   - Use this as a reference when reading the security reports
   - Helps understand technical terms

---

## Code Explanation

### Server.js - Detailed Breakdown

#### Imports and Setup
```javascript
const express = require("express");
const axios = require("axios");
const dns = require("dns").promises;
const https = require("https");
const cors = require("cors");
require("dotenv").config();
```
- **require()**: Imports external libraries
- Each library has a specific purpose:
  - `express`: Web server framework
  - `axios`: Makes HTTP requests
  - `dns`: DNS lookup functionality
  - `https`: HTTPS/SSL operations
  - `cors`: Cross-origin resource sharing
  - `dotenv`: Loads environment variables

#### Server Configuration
```javascript
const app = express();
const PORT = process.env.PORT || 3000;
```
- Creates Express application instance
- Sets port (3000 if not specified in environment)

#### Middleware
```javascript
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
```
- **cors()**: Allows browser requests from any origin
- **express.json()**: Parses JSON in request bodies
- **express.static("public")**: Serves files from `public/` folder (HTML, CSS, JS)

#### SSL Certificate Check Function
```javascript
async function getSSLCertificateInfo(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: 443,
      method: "GET",
      rejectUnauthorized: false,
    };
```
- **async function**: Function that can wait for asynchronous operations
- **Promise**: Represents eventual result
- **options**: Configuration for HTTPS request
  - `port: 443`: Standard HTTPS port
  - `rejectUnauthorized: false`: Don't fail if certificate is invalid (we want to check it)

The function:
1. Makes HTTPS connection to the website
2. Gets the SSL certificate from the connection
3. Extracts information (validity, dates, issuer, etc.)
4. Calculates days until expiration
5. Returns the information

#### Security Headers Check Function
```javascript
async function checkSecurityHeaders(url) {
  const response = await axios.get(url, {
    maxRedirects: 5,
    timeout: 10000,
    validateStatus: () => true,
  });
```
- Uses `axios` to make HTTP GET request
- `maxRedirects: 5`: Follow up to 5 redirects
- `timeout: 10000`: Wait max 10 seconds
- `validateStatus: () => true`: Accept any HTTP status code (200, 404, etc.)
- Extracts security headers from response
- Checks for presence of each security header

#### DNS Check Function
```javascript
async function performDNSChecks(domain) {
  const results = {
    a: null,
    aaaa: null,
    mx: null,
    txt: null,
    ns: null,
  };
```
- Creates empty result object
- Tries each DNS record type:
  - `dns.resolve4()`: Gets A records (IPv4)
  - `dns.resolve6()`: Gets AAAA records (IPv6)
  - `dns.resolveMx()`: Gets MX records
  - `dns.resolveTxt()`: Gets TXT records
  - `dns.resolveNs()`: Gets NS records
- Uses `.catch()` to handle errors gracefully (returns null if lookup fails)

#### Risk Score Calculation
```javascript
function calculateRiskScore(sslInfo, headersInfo, dnsInfo) {
  let riskScore = 0;
  let issues = [];
```
- Starts with 0 risk points
- Adds points for each security issue:
  - Invalid SSL: +40 points
  - Expired SSL: +40 points
  - SSL expiring soon: +20 points
  - Missing HSTS: +10 points
  - Missing CSP: +10 points
  - Missing X-Frame-Options: +5 points
  - Missing X-Content-Type-Options: +5 points
  - No DNS records: +20 points
- Determines risk level based on total score:
  - 0-19: Low
  - 20-49: Medium
  - 50+: High

#### Main Assessment Endpoint
```javascript
app.post("/api/assess", async (req, res) => {
  const { website } = req.body;
```
- **POST**: Handles POST requests to `/api/assess`
- **req.body**: Contains data sent from client
- **res**: Response object to send data back

Process:
1. Gets website address from request
2. Normalizes domain (removes protocol, www, etc.)
3. Validates domain format with regex
4. Runs all security checks in parallel (`Promise.all()`)
5. Calculates risk score
6. Creates report object
7. Sends JSON response

#### Terms Endpoint
```javascript
app.get("/api/terms", (req, res) => {
  const terms = [ /* array of term objects */ ];
  res.json({ terms });
});
```
- **GET**: Handles GET requests to `/api/terms`
- Returns array of cybersecurity terms with definitions
- Terms are hardcoded in the server file

#### Server Start
```javascript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
- Starts server listening on specified port
- Logs message when ready

---

### script.js - Detailed Breakdown

#### Tab Switching
```javascript
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
```
- Finds all tab content elements
- Removes "active" class (hides them)
- Adds "active" class to selected tab (shows it)
- Updates button styling

#### Run Assessment
```javascript
async function runAssessment() {
  const website = document.getElementById("website-input").value.trim();
```
- Gets website input value
- Validates input (shows error if empty)
- Disables button and shows loading spinner
- Sends POST request to `/api/assess`
- Handles response or errors
- Calls `displayReport()` to show results

#### Display Report
```javascript
function displayReport(report) {
  const reportContent = document.getElementById("report-content");
```
- Gets container element for report
- Builds HTML string with report data
- Creates sections for:
  - Risk badge
  - SSL information card
  - Security headers card
  - DNS records card
  - Issues list
  - Recommendations
- Inserts HTML into page (`innerHTML`)
- Scrolls to report smoothly

#### Generate Recommendations
```javascript
function generateRecommendations(report) {
  const recommendations = [];
```
- Analyzes report data
- Adds recommendations based on issues found
- Returns array of recommendation strings
- Each recommendation is a specific, actionable suggestion

#### Load Cybersecurity Terms
```javascript
async function loadCybersecurityTerms() {
  const response = await fetch("/api/terms");
  const data = await response.json();
```
- Fetches terms from `/api/terms` endpoint
- Groups terms by category
- Creates HTML cards for each term
- Displays terms in grid layout

---

### style.css - Key Concepts

#### CSS Variables
```css
:root {
  --primary-color: #667eea;
  --danger: #dc3545;
}
```
- Defines reusable color values
- Makes it easy to change theme colors globally

#### Flexbox Layout
```css
display: flex;
justify-content: center;
align-items: center;
```
- Modern layout method
- Makes elements align and distribute space easily

#### CSS Grid
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
```
- Creates grid layouts
- Responsive: automatically adjusts number of columns

#### Media Queries
```css
@media (max-width: 768px) {
  /* styles for mobile */
}
```
- Applies different styles based on screen size
- Makes website responsive (works on mobile)

#### Pseudo-classes
```css
.button:hover {
  background-color: darker;
}
```
- `:hover`: Styles when mouse hovers over element
- `:active`: Styles when element is clicked
- `:focus`: Styles when element has keyboard focus

---

## Summary

### What This Tool Does
1. **Security Assessment**: Checks websites for security vulnerabilities
2. **SSL/TLS Analysis**: Verifies encryption certificates
3. **Header Inspection**: Checks for protective HTTP headers
4. **DNS Analysis**: Examines domain configuration
5. **Risk Scoring**: Calculates overall security risk level
6. **Educational Resource**: Provides cybersecurity terms dictionary

### Technology Stack
- **Backend**: Node.js + Express.js
- **Frontend**: HTML + CSS + JavaScript
- **Libraries**: Axios (HTTP), DNS (lookups), HTTPS (SSL)
- **Architecture**: Client-server model

### Key Concepts
- **Security**: SSL/TLS, HTTP headers, DNS security
- **Web Development**: HTML structure, CSS styling, JavaScript interactivity
- **Server Programming**: API endpoints, request/response handling
- **Network Protocols**: HTTP/HTTPS, DNS, SSL/TLS

### How It Works (Simple Version)
1. User enters website address
2. Browser sends request to server
3. Server checks website security (SSL, headers, DNS)
4. Server calculates risk score
5. Server sends report back
6. Browser displays report to user

---

## Additional Notes

### Security Considerations
- This tool only checks publicly available information
- It does NOT perform intrusive testing or exploitation
- Results are a snapshot in time - security can change
- Always follow ethical guidelines: only test websites you own or have permission to test

### Limitations
- May not detect all security vulnerabilities
- Some checks may timeout on slow servers
- Results are based on what's publicly visible
- Does not test application-level vulnerabilities

### Future Improvements (Ideas)
- Add more security checks (subdomain enumeration, port scanning)
- Save assessment history
- Export reports as PDF
- Compare assessments over time
- Add more detailed recommendations
- Support for authenticated assessments (with API keys)

---

## Conclusion

This Website Security Assessment Tool is a comprehensive application that combines:
- **Technical Security Knowledge**: SSL/TLS, HTTP headers, DNS
- **Web Development Skills**: HTML, CSS, JavaScript, Node.js
- **API Design**: RESTful endpoints
- **User Experience**: Clean interface, clear reports, educational resources

It serves as both a practical security tool and an educational resource, making complex cybersecurity concepts accessible to non-experts through clear explanations and visual reports.

