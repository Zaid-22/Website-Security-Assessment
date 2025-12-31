// Tab switching functionality
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all buttons
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected tab
  if (tabName === "assessment") {
    document.getElementById("assessment-tab").classList.add("active");
    document.querySelectorAll(".tab-button")[0].classList.add("active");
  } else if (tabName === "terms") {
    document.getElementById("terms-tab").classList.add("active");
    document.querySelectorAll(".tab-button")[1].classList.add("active");
    loadCybersecurityTerms();
  }
}

// Handle Enter key press
function handleEnterKey(event) {
  if (event.key === "Enter") {
    runAssessment();
  }
}

// Run security assessment
async function runAssessment() {
  const websiteInput = document.getElementById("website-input");
  const testButton = document.getElementById("test-button");
  const website = websiteInput.value.trim();

  if (!website) {
    websiteInput.focus();
    websiteInput.style.borderColor = "var(--danger)";
    setTimeout(() => {
      websiteInput.style.borderColor = "";
    }, 2000);
    return;
  }

  // Disable button and show loading
  testButton.disabled = true;
  testButton.textContent = "Testing...";
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("report-section").classList.add("hidden");

  try {
    const response = await fetch("/api/assess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ website }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Assessment failed");
    }

    displayReport(data);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("report-content").innerHTML = `
            <div class="report-card">
                <h3>Error</h3>
                <p>Failed to perform security assessment: ${error.message}</p>
                <p>Please check the domain and try again.</p>
            </div>
        `;
    document.getElementById("report-section").classList.remove("hidden");
  } finally {
    document.getElementById("loading").classList.add("hidden");
    testButton.disabled = false;
    testButton.textContent = "Test";
  }
}

// Display security report
function displayReport(report) {
  const reportContent = document.getElementById("report-content");

  // Risk badge
  const riskClass = `risk-${report.risk.level.toLowerCase()}`;
  const riskBadge = `<div class="risk-badge ${riskClass}">Overall Risk: ${report.risk.level}</div>`;

  // SSL/TLS Information
  const sslCard = `
        <div class="report-card">
            <h3>SSL/TLS Certificate</h3>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value ${
                  report.ssl.valid ? "status-valid" : "status-invalid"
                }">
                    ${report.ssl.valid ? "✓ Valid" : "✗ Invalid"}
                </span>
            </div>
            ${
              report.ssl.valid
                ? `
                <div class="info-row">
                    <span class="info-label">Issuer:</span>
                    <span class="info-value">${
                      report.ssl.issuer || "N/A"
                    }</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Subject:</span>
                    <span class="info-value">${
                      report.ssl.subject || "N/A"
                    }</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Valid From:</span>
                    <span class="info-value">${new Date(
                      report.ssl.validFrom
                    ).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Valid To:</span>
                    <span class="info-value">${new Date(
                      report.ssl.validTo
                    ).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Days Until Expiry:</span>
                    <span class="info-value">${
                      report.ssl.daysUntilExpiry
                    }</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Protocol:</span>
                    <span class="info-value">${
                      report.ssl.protocol || "N/A"
                    }</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Cipher:</span>
                    <span class="info-value">${
                      report.ssl.cipher || "N/A"
                    }</span>
                </div>
            `
                : `
                <div class="info-row">
                    <span class="info-label">Error:</span>
                    <span class="info-value">${
                      report.ssl.error || "Unknown error"
                    }</span>
                </div>
            `
            }
        </div>
    `;

  // Security Headers
  const headersCard = `
        <div class="report-card">
            <h3>HTTP Security Headers</h3>
            ${Object.entries(report.headers.headers || {})
              .map(
                ([header, value]) => `
                <div class="info-row">
                    <span class="info-label">${header}:</span>
                    <span class="info-value ${
                      value === "Not Present"
                        ? "status-missing"
                        : "status-present"
                    }">
                        ${value === "Not Present" ? "✗ Missing" : "✓ Present"}
                    </span>
                </div>
                ${
                  value !== "Not Present"
                    ? `
                    <div class="info-row" style="font-size: 0.9em; color: #666;">
                        <span class="info-label"></span>
                        <span class="info-value" style="text-align: left; word-break: break-all;">${value.substring(
                          0,
                          100
                        )}${value.length > 100 ? "..." : ""}</span>
                    </div>
                `
                    : ""
                }
            `
              )
              .join("")}
        </div>
    `;

  // DNS Information
  const dnsCard = `
        <div class="report-card">
            <h3>DNS Records</h3>
            <div class="info-row">
                <span class="info-label">A Records (IPv4):</span>
                <span class="info-value">${
                  report.dns.a ? report.dns.a.join(", ") : "Not found"
                }</span>
            </div>
            <div class="info-row">
                <span class="info-label">AAAA Records (IPv6):</span>
                <span class="info-value">${
                  report.dns.aaaa ? report.dns.aaaa.join(", ") : "Not found"
                }</span>
            </div>
            <div class="info-row">
                <span class="info-label">MX Records:</span>
                <span class="info-value">${
                  report.dns.mx &&
                  report.dns.mx.length > 0 &&
                  report.dns.mx[0].exchange
                    ? report.dns.mx
                        .map((m) => m.exchange)
                        .filter((e) => e)
                        .join(", ")
                    : "Not found"
                }</span>
            </div>
            <div class="info-row">
                <span class="info-label">NS Records:</span>
                <span class="info-value">${
                  report.dns.ns ? report.dns.ns.join(", ") : "Not found"
                }</span>
            </div>
            <div class="info-row">
                <span class="info-label">TXT Records:</span>
                <span class="info-value">${
                  report.dns.txt
                    ? report.dns.txt.flat().join(", ")
                    : "Not found"
                }</span>
            </div>
        </div>
    `;

  // Issues and Recommendations
  const issuesCard = `
        <div class="report-card">
            <h3>Identified Issues</h3>
            ${
              report.risk.issues.length > 0
                ? `
                <ul class="issues-list">
                    ${report.risk.issues
                      .map((issue) => `<li>${issue}</li>`)
                      .join("")}
                </ul>
            `
                : '<p style="color: #28a745;">No major issues identified.</p>'
            }
        </div>
    `;

  // Recommendations
  const recommendations = generateRecommendations(report);
  const recommendationsCard = `
        <div class="report-card">
            <h3>Recommended Controls & Improvements</h3>
            <ul class="issues-list" style="border-left-color: #28a745;">
                ${recommendations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
        </div>
    `;

  reportContent.innerHTML = `
        ${riskBadge}
        <div class="info-row" style="margin-bottom: 20px;">
            <span class="info-label">Domain:</span>
            <span class="info-value"><strong>${report.domain}</strong></span>
        </div>
        <div class="info-row" style="margin-bottom: 20px;">
            <span class="info-label">Assessment Date:</span>
            <span class="info-value">${new Date(
              report.timestamp
            ).toLocaleString()}</span>
        </div>
        ${sslCard}
        ${headersCard}
        ${dnsCard}
        ${issuesCard}
        ${recommendationsCard}
    `;

  document.getElementById("report-section").classList.remove("hidden");

  // Smooth scroll to report
  setTimeout(() => {
    document.getElementById("report-section").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

// Generate recommendations based on report
function generateRecommendations(report) {
  const recommendations = [];

  // SSL/TLS recommendations
  if (!report.ssl.valid) {
    recommendations.push(
      "Install a valid SSL/TLS certificate to enable HTTPS encryption"
    );
  }
  if (
    typeof report.ssl.daysUntilExpiry === "number" &&
    report.ssl.daysUntilExpiry < 30
  ) {
    recommendations.push(
      "Renew SSL certificate before expiration to avoid service disruption"
    );
  }

  // Security headers recommendations
  if (report.headers.headers["Strict-Transport-Security"] === "Not Present") {
    recommendations.push(
      "Implement HSTS (HTTP Strict Transport Security) header to force HTTPS connections"
    );
  }
  if (report.headers.headers["Content-Security-Policy"] === "Not Present") {
    recommendations.push(
      "Add Content-Security-Policy header to prevent XSS attacks"
    );
  }
  if (report.headers.headers["X-Frame-Options"] === "Not Present") {
    recommendations.push(
      "Configure X-Frame-Options header to prevent clickjacking attacks"
    );
  }
  if (report.headers.headers["X-Content-Type-Options"] === "Not Present") {
    recommendations.push(
      "Set X-Content-Type-Options: nosniff to prevent MIME type sniffing"
    );
  }

  // General recommendations
  if (report.risk.level === "High") {
    recommendations.push(
      "Conduct a comprehensive security audit and implement immediate remediation measures"
    );
  } else if (report.risk.level === "Medium") {
    recommendations.push(
      "Review security configuration and address identified vulnerabilities"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Continue monitoring and maintain current security practices"
    );
    recommendations.push(
      "Regularly update security configurations and review security headers"
    );
  }

  return recommendations;
}

// Load cybersecurity terms
async function loadCybersecurityTerms() {
  const termsContent = document.getElementById("terms-content");

  // Check if already loaded
  if (termsContent.children.length > 0) {
    return;
  }

  try {
    const response = await fetch("/api/terms");
    const data = await response.json();

    // Group terms by category
    const categories = {};
    data.terms.forEach((term) => {
      if (!categories[term.category]) {
        categories[term.category] = [];
      }
      categories[term.category].push(term);
    });

    // Display terms grouped by category
    let html = "";
    Object.keys(categories)
      .sort()
      .forEach((category) => {
        html += `<h3 style="grid-column: 1 / -1; color: #667eea; margin-top: 20px; margin-bottom: 10px;">${category}</h3>`;
        categories[category].forEach((term) => {
          html += `
                    <div class="term-card">
                        <span class="term-category">${term.category}</span>
                        <h3>${term.term}</h3>
                        <p class="term-definition">${term.definition}</p>
                    </div>
                `;
        });
      });

    termsContent.innerHTML = html;
  } catch (error) {
    console.error("Error loading terms:", error);
    termsContent.innerHTML =
      "<p>Error loading cybersecurity terms. Please try again later.</p>";
  }
}

// Load terms when page loads if on terms tab
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on the terms tab
  if (window.location.hash === "#terms") {
    showTab("terms");
  }
});
