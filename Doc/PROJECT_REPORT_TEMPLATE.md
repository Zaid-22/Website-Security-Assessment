# Website Security Assessment & Guidance Web Tool
## Course Project Report

**Course:** Information Security Management  
**Project Title:** Website Security Assessment & Guidance Web Tool  
**Semester:** 1st / 2025–2026  
**Total Marks:** 20 Points

---

## 1. Title Page

**Title:** Website Security Assessment & Guidance Web Tool

**Student Names & IDs:**
- [Student 1 Name] - [ID]
- [Student 2 Name] - [ID]
- [Student 3 Name] - [ID] (if applicable)
- [Student 4 Name] - [ID] (if applicable)

**Course:** Information Security Management  
**Instructor:** [Instructor Name]  
**Date:** [Submission Date]

---

## 2. Problem Statement

[Describe the organizational need for standardized website security checking. Explain the current challenges with manual, inconsistent assessments and the need for a tool that provides clear, standardized security reports for non-expert users.]

**Example:**
A university unit receives frequent requests from staff and students asking whether a website is "safe" to use for academic or administrative purposes. Currently, checks are done inconsistently and manually, leading to incomplete assessments and unclear recommendations. This creates security risks and operational inefficiencies.

---

## 3. Objectives

[List the project objectives aligned with information security management principles.]

**Example Objectives:**
- Develop a standardized web-based tool for website security assessment
- Integrate multiple cybersecurity tools/services to provide comprehensive security reports
- Translate technical findings into clear risk assessments and recommendations
- Provide educational resources through a cybersecurity terms dictionary
- Demonstrate application of information security management concepts in practice

---

## 4. System Analysis

### 4.1 Users
- **Primary Users:** University staff and students
- **User Characteristics:** Non-expert users requiring clear, actionable security information

### 4.2 Use Cases
1. **Security Assessment:** User enters a website/domain and receives a comprehensive security report
2. **Term Reference:** User accesses cybersecurity terms dictionary for educational purposes

### 4.3 Workflow
1. User navigates to the web tool
2. User enters website/domain in search box
3. User clicks "Test" button
4. System performs security checks (SSL/TLS, headers, DNS)
5. System generates risk assessment
6. System displays comprehensive report with recommendations

### 4.4 Assumptions
- Target websites are publicly accessible
- Users have internet connectivity
- Websites support HTTPS (or HTTP for testing)
- DNS resolution is available

### 4.5 Limitations
- Assessment is based on publicly available information only
- Some checks may timeout for slow-responding servers
- Results reflect a snapshot in time
- Not all security vulnerabilities can be detected remotely
- Does not perform intrusive testing or exploitation
- Rate limiting may affect multiple rapid assessments

### 4.6 Ethics & Disclaimer
**Ethical Guidelines:**
- Only test publicly accessible targets
- No intrusive exploitation or unauthorized access attempts
- Respect rate limits and server resources
- Follow responsible disclosure practices

**Disclaimer:**
This tool provides informational security assessments only. Results are not a guarantee of security and should be used as guidance only. The tool does not perform comprehensive penetration testing and may not detect all security vulnerabilities.

---

## 5. Risk & Threat Overview

### 5.1 Assets
- **Information Assets:** User data, academic records, research data
- **System Assets:** University IT infrastructure, web services
- **Reputational Assets:** University reputation, trust

### 5.2 Threats
- **Malicious Websites:** Phishing sites, malware distribution
- **Data Breaches:** Unauthorized access to sensitive information
- **Man-in-the-Middle Attacks:** Interception of communications
- **Cross-Site Scripting (XSS):** Injection of malicious scripts
- **Clickjacking:** Deceptive UI overlays
- **SSL/TLS Vulnerabilities:** Weak encryption, expired certificates

### 5.3 Vulnerabilities
- Missing or weak SSL/TLS certificates
- Absence of security headers (HSTS, CSP, X-Frame-Options)
- Insecure DNS configurations
- Outdated encryption protocols
- Expired security certificates

### 5.4 Risk Rating Method
**Risk Score Calculation:**
- SSL/TLS Issues: 0-40 points
  - Invalid/expired certificate: 40 points
  - Certificate expiring soon (<30 days): 20 points
- Missing Security Headers: 0-40 points
  - Missing HSTS: 10 points
  - Missing CSP: 10 points
  - Missing X-Frame-Options: 5 points
  - Missing X-Content-Type-Options: 5 points
- DNS Issues: 0-20 points
  - No DNS records found: 20 points

**Risk Levels:**
- **Low Risk:** Score < 20
- **Medium Risk:** Score 20-49
- **High Risk:** Score ≥ 50

---

## 6. Security Requirements & Controls

### 6.1 Security Checks Performed

#### SSL/TLS Certificate Validation
- **What:** Validates certificate validity, expiration, issuer, and encryption protocols
- **Why:** Ensures encrypted communication and prevents man-in-the-middle attacks
- **Control Type:** Technical

#### HTTP Security Headers Analysis
- **What:** Checks for presence of critical security headers
  - HSTS (HTTP Strict Transport Security)
  - CSP (Content Security Policy)
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy
- **Why:** Prevents common web attacks (XSS, clickjacking, MIME sniffing)
- **Control Type:** Technical

#### DNS Record Analysis
- **What:** Validates DNS configuration (A, AAAA, MX, NS, TXT records)
- **Why:** Ensures proper domain configuration and identifies potential misconfigurations
- **Control Type:** Technical

### 6.2 Recommended Controls

#### Technical Controls
- Install and maintain valid SSL/TLS certificates
- Implement security headers (HSTS, CSP, X-Frame-Options, etc.)
- Configure proper DNS records
- Use strong encryption protocols (TLS 1.2+)
- Regular certificate renewal before expiration

#### Administrative Controls
- Establish security policies for website configuration
- Regular security audits and assessments
- Staff training on security best practices
- Incident response procedures
- Change management processes

#### Physical Controls
- Secure server facilities
- Access controls for data centers
- Environmental controls (fire suppression, climate control)

---

## 7. GUI Design

[Include screenshots or wireframes of:]
- Main page with search box and "Test" button
- Security report output display
- Cybersecurity Terms page/section
- Risk assessment visualization

**Screenshots should show:**
1. Landing page with input field
2. Loading state during assessment
3. Complete security report with all sections
4. Risk badge (Low/Medium/High)
5. Cybersecurity Terms page with categorized terms

---

## 8. Implementation

### 8.1 Tools Used
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Libraries:** Axios (HTTP requests), CORS (cross-origin support)
- **Native Modules:** DNS, HTTPS (built-in Node.js modules)

### 8.2 Architecture
```
Client (Browser)
    ↓
Frontend (HTML/CSS/JS)
    ↓
Backend API (Express.js)
    ↓
Security Checks:
  - SSL/TLS Certificate Validation
  - HTTP Headers Analysis
  - DNS Record Resolution
    ↓
Risk Assessment Engine
    ↓
Report Generation
```

### 8.3 APIs/Tools Integrated
1. **SSL/TLS Certificate Check:** Native Node.js HTTPS module
2. **HTTP Security Headers:** Axios HTTP client
3. **DNS Resolution:** Native Node.js DNS module

### 8.4 Data Flow
1. User input → Frontend validation
2. Frontend → POST /api/assess
3. Backend → Parallel security checks
4. Backend → Risk calculation
5. Backend → JSON response
6. Frontend → Report rendering

### 8.5 Security of Keys
- API keys stored in `.env` file (not committed to version control)
- Environment variables loaded server-side only
- No API keys exposed in client-side code
- `.env` file listed in `.gitignore`

---

## 9. Testing & Results

### 9.1 Test Websites
Test the tool on at least 5 different websites:

| Website | SSL/TLS | Headers | DNS | Risk Level | Notes |
|---------|---------|---------|-----|------------|-------|
| example.com | ✓ Valid | Partial | ✓ | Medium | Missing some headers |
| google.com | ✓ Valid | Complete | ✓ | Low | Strong security |
| [Website 3] | ... | ... | ... | ... | ... |
| [Website 4] | ... | ... | ... | ... | ... |
| [Website 5] | ... | ... | ... | ... | ... |

### 9.2 Screenshots
[Include screenshots of test results for each website]

### 9.3 Summarized Results
[Provide a summary table and analysis of findings across all tested websites]

---

## 10. Recommendations

### 10.1 Fix Guidance for Example Website
[Select one tested website and provide detailed recommendations]

**Example:**
For [example.com]:
1. **Immediate Actions:**
   - Install valid SSL/TLS certificate
   - Configure HSTS header
   - Add Content-Security-Policy header

2. **Short-term Improvements:**
   - Implement X-Frame-Options header
   - Configure X-Content-Type-Options
   - Set up certificate auto-renewal

3. **Long-term Roadmap:**
   - Regular security audits
   - Implement comprehensive security headers
   - Establish security monitoring
   - Staff security training

### 10.2 Improvement Roadmap
- Integration with additional security APIs (VirusTotal, SSL Labs)
- Historical tracking of security assessments
- Export reports to PDF
- Email notifications for certificate expiration
- Enhanced vulnerability scanning capabilities

---

## Appendix A: Code Structure
[Include key code snippets if required]

## Appendix B: References
- [List any references, standards, or documentation used]

---

**End of Report**

