// src/models/bank/Bank.Models.ts

export interface BankInfoBody {
    _method?: string;
    bank_name?: string;
    branch?: string;
    holder_name?: string;
    account_no?: string;
    f_name?: string;
    l_name?: string;
    phone?: string;
}

export interface BankInfoData {
    bank_info: {
        bank_name: string;
        branch: string;
        holder_name: string;
        account_no: string;
    };
    user_info: {
        f_name: string;
        l_name: string;
        phone: string;
    };
}

export interface BankInfoResponse {
success: boolean;
message: string;
data: BankInfoData;
}

export interface UpdateBankResponse {
success: boolean;
message: string;
}
  

// --------------------------

