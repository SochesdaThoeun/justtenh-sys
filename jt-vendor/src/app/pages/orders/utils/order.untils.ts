/**
 * Convert a product SKU to a number representation
 * @param sku The SKU string
 * @returns A number representation of the SKU
 */
export const skuToNumber = (sku: string): number => {
  // Simple hash function
  let hash = 0;
  if (sku.length === 0) return hash;
  
  for (let i = 0; i < sku.length; i++) {
    const char = sku.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Ensure positive number
  return Math.abs(hash);
};

/**
 * Create a unique variant ID by combining product ID and variant type
 * @param productId The product ID
 * @param variantType The variant type string
 * @returns A unique number representing this variant
 */
export const makeVariantId = (productId: number, variantType: string): number => {
  // Create a unique ID by combining product ID and a hash of the variant type
  // Multiply product ID by 10000 to ensure enough space for variant type hash
  return productId * 10000 + (skuToNumber(variantType) % 10000);
};