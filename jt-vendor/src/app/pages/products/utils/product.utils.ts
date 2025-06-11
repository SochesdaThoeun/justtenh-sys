/**
 * Utility functions for Products
 */

// Helper to get status class based on status value
export const getStatusClass = (status: number | undefined): string => {
  if (status === undefined) return 'danger';
  
  switch(status) {
    case 1: return 'success'; // Active
    case 0: return 'danger';  // Inactive
    case 2: return 'warning'; // Pending
    case 3: return 'primary'; // Scheduled
    default: return 'danger';
  }
};

// Helper to get status text
export const getStatusText = (status: number | undefined): string => {
  if (status === undefined) return 'Unknown';
  
  switch(status) {
    case 1: return 'Active';
    case 0: return 'Inactive';
    case 2: return 'Pending';
    case 3: return 'Scheduled';
    default: return 'Unknown';
  }
};

// Handle printing a barcode
export const printBarcode = (elementId: string) => {
  const printContent = document.getElementById(elementId);
  if (!printContent) return;
  
  const WinPrint = window.open('', '', 'width=800,height=650');
  if (!WinPrint) return;
  
  WinPrint.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .barcode-container { margin: 50px auto; }
        </style>
      </head>
      <body>
        <div class="barcode-container">
          ${printContent.innerHTML}
        </div>
      </body>
    </html>
  `);
  
  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
};

// Convert SKU to a number for variant ID generation
export const skuToNumber = (sku: string | undefined): number => {
  if (!sku) return 0;
  // Extract only numeric characters from SKU
  const numericChars = sku.replace(/\D/g, '');
  // If no numeric characters, use string hash method
  if (!numericChars) {
    // Create a simple hash: sum of char codes of SKU
    let hash = 0;
    for (let i = 0; i < sku.length; i++) {
      hash += sku.charCodeAt(i);
    }
    return hash;
  }
  // If numeric part is too long, truncate it
  const safeNumeric = numericChars.length > 9 ? numericChars.substring(0, 9) : numericChars;
  const result = parseInt(safeNumeric, 10);
  return result;
};

/**
 * Creates a unique variant ID based on product ID and variant type
 * @param productId - The base product ID
 * @param variantType - The variant type
 * @returns A numeric variant ID
 */
export const makeVariantId = (productId: number, variantType: string | undefined): number => {
  const typeNumber = skuToNumber(variantType);
  const variantId = (productId * 100000) + typeNumber;
  return variantId;
}; 