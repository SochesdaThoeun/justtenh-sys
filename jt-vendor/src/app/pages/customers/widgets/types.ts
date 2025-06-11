// src/components/advancedSettings/types.ts

/**
 * The main PaymentMethod interface
 */
export interface PaymentMethod {
    id: string
    brand: 'visa' | 'mastercard' | 'amex'
    name: string
    number: string
    expires: string  // e.g. '12/2024'
    isPrimary: boolean
    isExpired: boolean
    issuer: string
    type: string
    billingAddress: string
    phone?: string
    email?: string
    origin?: string
    cvcCheck?: 'passed' | 'failed'
  }
  