/**
 * Invoice Service
 * Handles invoice operations like printing and downloading
 */

// Handle printing invoice
export const printInvoice = (invoiceContent: string, invoiceNumber: string): void => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  // Get current stylesheets from the page to maintain styling
  const stylesheets = Array.from(document.styleSheets)
    .filter(stylesheet => {
      try {
        // Check if we can access the rules (avoid CORS issues)
        return stylesheet.cssRules !== null;
      } catch (e) {
        return false;
      }
    })
    .map(stylesheet => {
      const rules = Array.from(stylesheet.cssRules);
      return rules.map(rule => rule.cssText).join('\n');
    })
    .join('\n');
  
  // Create a simplified HTML document for printing
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice #${invoiceNumber}</title>
        <style>
          ${stylesheets}
          
          /* Additional print-specific styles */
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: white;
          }
          .invoice-print-container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .card, .card-body {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            a {
              text-decoration: none !important;
              color: inherit !important;
            }
            .badge {
              border: 1px solid #ddd;
            }
            img, .symbol-label {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
        <!-- Load the Metronic theme favicon and icons -->
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700">
      </head>
      <body>
        <div class="invoice-print-container card card-flush p-9">
          ${invoiceContent}
        </div>
      </body>
    </html>
  `);
  
  // Trigger print and close
  printWindow.document.close();
  printWindow.focus();
  
  // Wait a moment for styles to load before printing
  setTimeout(() => {
    printWindow.print();
    // printWindow.close(); // Close after print - uncomment if you want auto-close
  }, 1000);
};

// Handle downloading invoice
export const downloadInvoice = (invoiceContent: string, invoiceNumber: string): void => {
  // Get the current stylesheets from the page
  const stylesheets = Array.from(document.styleSheets)
    .filter(stylesheet => {
      try {
        // Check if we can access the rules (avoid CORS issues)
        return stylesheet.cssRules !== null;
      } catch (e) {
        return false;
      }
    })
    .map(stylesheet => {
      const rules = Array.from(stylesheet.cssRules);
      return rules.map(rule => rule.cssText).join('\n');
    })
    .join('\n');
  
  // Create a document with proper styling
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${invoiceNumber}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${stylesheets}
          
          /* Additional download-specific styles */
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: white;
          }
          .invoice-container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .text-end {
            text-align: right;
          }
          .fw-bold {
            font-weight: bold;
          }
          .badge {
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
          }
          .badge-light-success {
            background-color: #E8FFF3;
            color: #50CD89;
          }
          .badge-light-warning {
            background-color: #FFF8DD;
            color: #FFC700;
          }
          .symbol-label {
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            display: inline-block;
            width: 50px;
            height: 50px;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700">
      </head>
      <body>
        <div class="invoice-container card card-flush">
          ${invoiceContent}
        </div>
      </body>
    </html>
  `;
  
  // Convert to blob and create download link
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element to download the file
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${invoiceNumber}.html`;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
}; 