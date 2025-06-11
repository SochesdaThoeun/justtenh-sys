import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from './order.models';

interface InvoiceState {
  // Display options
  enablePayment: boolean;
  enableDueDate: boolean;
  enableTerms: boolean;
  enableSignature: boolean;
  
  // Current invoice data
  currentInvoiceNumber: string | null;
}

const initialState: InvoiceState = {
  enablePayment: true,
  enableDueDate: false,
  enableTerms: true,
  enableSignature: false,
  currentInvoiceNumber: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setEnablePayment(state, action: PayloadAction<boolean>) {
      state.enablePayment = action.payload;
    },
    setEnableDueDate(state, action: PayloadAction<boolean>) {
      state.enableDueDate = action.payload;
    },
    setEnableTerms(state, action: PayloadAction<boolean>) {
      state.enableTerms = action.payload;
    },
    setEnableSignature(state, action: PayloadAction<boolean>) {
      state.enableSignature = action.payload;
    },
    generateInvoiceNumber(state, action: PayloadAction<string>) {
      state.currentInvoiceNumber = `INV-${action.payload}-${Date.now().toString().slice(-4)}`;
    },
    resetInvoiceSettings(state) {
      return { ...initialState };
    },
  },
});

export const {
  setEnablePayment,
  setEnableDueDate,
  setEnableTerms,
  setEnableSignature,
  generateInvoiceNumber,
  resetInvoiceSettings,
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 