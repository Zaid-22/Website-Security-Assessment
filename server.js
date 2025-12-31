const express = require("express");
const axios = require("axios");
const dns = require("dns").promises;
const https = require("https");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Helper function to get SSL certificate info
async function getSSLCertificateInfo(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: 443,
      method: "GET",
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate(true);

      if (!cert || Object.keys(cert).length === 0) {
        resolve({
          valid: false,
          error: "No certificate found",
        });
        return;
      }

      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const now = new Date();
      const daysUntilExpiry = Math.floor(
        (validTo - now) / (1000 * 60 * 60 * 24)
      );

      resolve({
        valid: res.socket.authorized,
        issuer: cert.issuer?.CN || "Unknown",
        subject: cert.subject?.CN || hostname,
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        daysUntilExpiry: daysUntilExpiry,
        protocol: res.socket.getProtocol() || "Unknown",
        cipher: res.socket.getCipher()?.name || "Unknown",
      });
    });

    req.on("error", (error) => {
      resolve({
        valid: false,
        error: error.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        valid: false,
        error: "Connection timeout",
      });
    });

    req.end();
  });
}

// Helper function to check HTTP security headers
async function checkSecurityHeaders(url) {
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      validateStatus: () => true, // Accept any status code
    });

    const headers = response.headers;
    const securityHeaders = {
      "Strict-Transport-Security":
        headers["strict-transport-security"] || "Not Present",
      "Content-Security-Policy":
        headers["content-security-policy"] || "Not Present",
      "X-Frame-Options": headers["x-frame-options"] || "Not Present",
      "X-Content-Type-Options":
        headers["x-content-type-options"] || "Not Present",
      "X-XSS-Protection": headers["x-xss-protection"] || "Not Present",
      "Referrer-Policy": headers["referrer-policy"] || "Not Present",
      "Permissions-Policy": headers["permissions-policy"] || "Not Present",
    };

    return {
      success: true,
      headers: securityHeaders,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      headers: {},
    };
  }
}

// Helper function to perform DNS checks
async function performDNSChecks(domain) {
  const results = {
    a: null,
    aaaa: null,
    mx: null,
    txt: null,
    ns: null,
    cname: null,
  };

  try {
    results.a = await dns.resolve4(domain).catch(() => null);
  } catch (e) {}

  try {
    results.aaaa = await dns.resolve6(domain).catch(() => null);
  } catch (e) {}

  try {
    results.mx = await dns.resolveMx(domain).catch(() => null);
  } catch (e) {}

  try {
    results.txt = await dns.resolveTxt(domain).catch(() => null);
  } catch (e) {}

  try {
    results.ns = await dns.resolveNs(domain).catch(() => null);
  } catch (e) {}

  try {
    results.cname = await dns.resolveCname(domain).catch(() => null);
  } catch (e) {}

  return results;
}

// Calculate overall risk score
function calculateRiskScore(sslInfo, headersInfo, dnsInfo) {
  let riskScore = 0;
  let issues = [];

  // SSL/TLS checks (40 points)
  if (!sslInfo?.valid) {
    riskScore += 40;
    issues.push("SSL/TLS certificate is invalid or missing");
  } else {
    // Check if daysUntilExpiry exists and is a valid number
    if (typeof sslInfo.daysUntilExpiry === "number") {
      if (sslInfo.daysUntilExpiry < 0) {
        riskScore += 40;
        issues.push("SSL certificate has expired");
      } else if (sslInfo.daysUntilExpiry < 30) {
        riskScore += 20;
        issues.push("SSL certificate expires soon");
      }
    }
  }

  // Security headers checks (40 points)
  const missingHeaders = [];
  const headers = headersInfo?.headers || {};
  if (headers["Strict-Transport-Security"] === "Not Present") {
    missingHeaders.push("HSTS");
    riskScore += 10;
  }
  if (headers["Content-Security-Policy"] === "Not Present") {
    missingHeaders.push("CSP");
    riskScore += 10;
  }
  if (headers["X-Frame-Options"] === "Not Present") {
    missingHeaders.push("X-Frame-Options");
    riskScore += 5;
  }
  if (headers["X-Content-Type-Options"] === "Not Present") {
    missingHeaders.push("X-Content-Type-Options");
    riskScore += 5;
  }
  if (missingHeaders.length > 0) {
    issues.push(`Missing security headers: ${missingHeaders.join(", ")}`);
  }

  // DNS checks (20 points)
  if (!dnsInfo.a && !dnsInfo.aaaa) {
    riskScore += 20;
    issues.push("No DNS A or AAAA records found");
  }

  // Determine risk level
  let riskLevel = "Low";
  if (riskScore >= 50) {
    riskLevel = "High";
  } else if (riskScore >= 20) {
    riskLevel = "Medium";
  }

  return {
    score: riskScore,
    level: riskLevel,
    issues: issues,
  };
}

// Main security assessment endpoint
app.post("/api/assess", async (req, res) => {
  try {
    const { website } = req.body;

    if (!website) {
      return res.status(400).json({ error: "Website/domain is required" });
    }

    // Normalize domain (remove protocol, www, trailing slashes)
    let domain = website
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")
      .split("/")[0];

    // Validate domain format
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({
        error:
          "Invalid domain format. Please enter a valid domain name (e.g., example.com)",
      });
    }

    // Perform security checks
    const [sslInfo, headersInfo, dnsInfo] = await Promise.all([
      getSSLCertificateInfo(domain),
      checkSecurityHeaders(`https://${domain}`).catch(() =>
        checkSecurityHeaders(`http://${domain}`)
      ),
      performDNSChecks(domain),
    ]);

    // Calculate risk assessment
    const riskAssessment = calculateRiskScore(sslInfo, headersInfo, dnsInfo);

    // Compile report
    const report = {
      domain: domain,
      timestamp: new Date().toISOString(),
      ssl: sslInfo,
      headers: headersInfo,
      dns: dnsInfo,
      risk: riskAssessment,
    };

    res.json(report);
  } catch (error) {
    console.error("Assessment error:", error);
    res.status(500).json({
      error: "Failed to perform security assessment: " + error.message,
    });
  }
});

// Cybersecurity terms endpoint
app.get("/api/terms", (req, res) => {
  const terms = [
    {
      term: "SSL/TLS",
      category: "Cryptography",
      definition:
        "Secure Sockets Layer/Transport Layer Security - cryptographic protocols that provide secure communication over a network. SSL is the predecessor to TLS.",
    },
    {
      term: "HSTS",
      category: "Web Security",
      definition:
        "HTTP Strict Transport Security - a web security policy mechanism that helps protect websites against protocol downgrade attacks and cookie hijacking.",
    },
    {
      term: "CSP",
      category: "Web Security",
      definition:
        "Content Security Policy - a security standard that helps prevent cross-site scripting (XSS), data injection attacks, and other code injection attacks.",
    },
    {
      term: "XSS",
      category: "Web Security",
      definition:
        "Cross-Site Scripting - a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.",
    },
    {
      term: "CSRF",
      category: "Web Security",
      definition:
        "Cross-Site Request Forgery - an attack that forces authenticated users to submit a request to a web application against their will.",
    },
    {
      term: "SQL Injection",
      category: "Web Security",
      definition:
        "A code injection technique used to attack data-driven applications by inserting malicious SQL statements into an entry field.",
    },
    {
      term: "DDoS",
      category: "Network Security",
      definition:
        "Distributed Denial of Service - an attack where multiple compromised systems are used to target a single system, causing a denial of service.",
    },
    {
      term: "Firewall",
      category: "Network Security",
      definition:
        "A network security device that monitors and filters incoming and outgoing network traffic based on predetermined security rules.",
    },
    {
      term: "VPN",
      category: "Network Security",
      definition:
        "Virtual Private Network - a technology that creates a secure, encrypted connection over a less secure network, such as the internet.",
    },
    {
      term: "Encryption",
      category: "Cryptography",
      definition:
        "The process of converting information or data into a code, especially to prevent unauthorized access.",
    },
    {
      term: "Decryption",
      category: "Cryptography",
      definition:
        "The process of converting encrypted data back into its original form so it can be understood.",
    },
    {
      term: "Public Key Infrastructure (PKI)",
      category: "Cryptography",
      definition:
        "A framework for managing digital certificates and public-private key pairs, enabling secure communication and authentication.",
    },
    {
      term: "Certificate Authority (CA)",
      category: "Cryptography",
      definition:
        "An entity that issues digital certificates certifying the ownership of a public key by the named subject of the certificate.",
    },
    {
      term: "Risk Assessment",
      category: "Risk Management",
      definition:
        "The process of identifying, analyzing, and evaluating risks to determine their potential impact and likelihood.",
    },
    {
      term: "Vulnerability",
      category: "Risk Management",
      definition:
        "A weakness in a system that could be exploited by a threat to cause harm or damage.",
    },
    {
      term: "Threat",
      category: "Risk Management",
      definition:
        "Any potential danger that could exploit a vulnerability to breach security and cause harm.",
    },
    {
      term: "Asset",
      category: "Risk Management",
      definition:
        "Any data, device, or other component of an organization's systems that is valuable and needs protection.",
    },
    {
      term: "Penetration Testing",
      category: "Security Operations",
      definition:
        "An authorized simulated attack on a computer system, performed to evaluate the security of the system.",
    },
    {
      term: "Security Audit",
      category: "Security Operations",
      definition:
        "A systematic evaluation of the security of an organization's information system by measuring how well it conforms to established criteria.",
    },
    {
      term: "Incident Response",
      category: "Security Operations",
      definition:
        "An organized approach to addressing and managing the aftermath of a security breach or cyberattack.",
    },
    {
      term: "Zero-Day",
      category: "Security Operations",
      definition:
        "A security vulnerability in software or hardware that is unknown to the vendor and for which no patch or fix is available.",
    },
    {
      term: "Phishing",
      category: "Social Engineering",
      definition:
        "A cyberattack that uses disguised email as a weapon to trick recipients into revealing sensitive information or installing malware.",
    },
    {
      term: "Social Engineering",
      category: "Social Engineering",
      definition:
        "The psychological manipulation of people into performing actions or divulging confidential information.",
    },
    {
      term: "Malware",
      category: "Threats",
      definition:
        "Malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.",
    },
    {
      term: "Ransomware",
      category: "Threats",
      definition:
        "A type of malware that encrypts a victim's files and demands payment (ransom) to restore access.",
    },
    {
      term: "Trojan Horse",
      category: "Threats",
      definition:
        "A type of malware that disguises itself as legitimate software to trick users into installing it.",
    },
    {
      term: "Botnet",
      category: "Threats",
      definition:
        "A network of compromised computers controlled by an attacker, often used for DDoS attacks or spam distribution.",
    },
    {
      term: "DNS",
      category: "Network Security",
      definition:
        "Domain Name System - a hierarchical naming system for computers, services, or other resources connected to the internet.",
    },
    {
      term: "DNSSEC",
      category: "Network Security",
      definition:
        "DNS Security Extensions - a suite of specifications for securing certain kinds of information provided by DNS.",
    },
    {
      term: "Two-Factor Authentication (2FA)",
      category: "Access Control",
      definition:
        "A security process in which users provide two different authentication factors to verify their identity.",
    },
    {
      term: "Multi-Factor Authentication (MFA)",
      category: "Access Control",
      definition:
        "An authentication method that requires more than one verification factor to gain access to a resource.",
    },
    {
      term: "Access Control",
      category: "Access Control",
      definition:
        "A security technique that regulates who or what can view or use resources in a computing environment.",
    },
    {
      term: "Least Privilege",
      category: "Access Control",
      definition:
        "A security principle that users should be granted only the minimum access necessary to perform their job functions.",
    },
    {
      term: "Data Breach",
      category: "Incidents",
      definition:
        "An incident where information is stolen or taken from a system without the knowledge or authorization of the system's owner.",
    },
    {
      term: "Compliance",
      category: "Governance",
      definition:
        "The act of conforming to established guidelines or specifications, such as security standards and regulations.",
    },
    {
      term: "ISO 27001",
      category: "Governance",
      definition:
        "An international standard for information security management systems (ISMS), providing a framework for managing security risks.",
    },
    {
      term: "GDPR",
      category: "Governance",
      definition:
        "General Data Protection Regulation - a European Union law on data protection and privacy that affects organizations worldwide.",
    },
    {
      term: "Security Policy",
      category: "Governance",
      definition:
        "A set of policies, rules, and practices that regulate how an organization manages, protects, and distributes sensitive information.",
    },
    {
      term: "Business Continuity",
      category: "Governance",
      definition:
        "The capability of an organization to continue delivery of products or services at acceptable predefined levels following a disruptive incident.",
    },
    {
      term: "Disaster Recovery",
      category: "Governance",
      definition:
        "A set of policies, tools, and procedures to enable the recovery or continuation of vital technology infrastructure after a disaster.",
    },
  ];

  res.json({ terms });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
