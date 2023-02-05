export interface IPaypalOrderStatusResponse {
    id:             string;
    intent:         string;
    status:         string;
    payment_source: PaymentSource;
    purchase_units: PurchaseUnit[];
    payer:          Payer;
    update_time:    string;
    links:          Link[];
}

export interface Link {
    href:   string;
    rel:    string;
    method: string;
}

export interface Payer {
    name:          PayerName;
    email_address: string;
    payer_id:      string;
    phone:         Phone;
    address:       PayerAddress;
}

export interface PayerAddress {
    country_code: string;
}

export interface PayerName {
    given_name: string;
    surname:    string;
}

export interface Phone {
    phone_number: PhoneNumber;
}

export interface PhoneNumber {
    national_number: string;
}

export interface PaymentSource {
    paypal: Paypal;
}

export interface Paypal {
    email_address: string;
    account_id:    string;
    name:          PayerName;
    phone_number:  PhoneNumber;
    address:       PayerAddress;
}

export interface PurchaseUnit {
    reference_id:    string;
    amount:          Amount;
    payee:           Payee;
    soft_descriptor: string;
    shipping:        Shipping;
    payments:        Payments;
}

export interface Amount {
    currency_code: CurrencyCode;
    value:         string;
    breakdown:     Breakdown;
}

export interface Breakdown {
    item_total:        Discount;
    shipping:          Discount;
    handling:          Discount;
    insurance:         Discount;
    shipping_discount: Discount;
    discount:          Discount;
}

export interface Discount {
    currency_code: CurrencyCode;
    value:         string;
}

export enum CurrencyCode {
    Usd = "USD",
}

export interface Payee {
    email_address: string;
    merchant_id:   string;
}

export interface Payments {
    captures: Capture[];
}

export interface Capture {
    id:                          string;
    status:                      string;
    amount:                      Discount;
    final_capture:               boolean;
    seller_protection:           SellerProtection;
    seller_receivable_breakdown: SellerReceivableBreakdown;
    links:                       Link[];
    create_time:                 string;
    update_time:                 string;
}

export interface SellerProtection {
    status:             string;
    dispute_categories: string[];
}

export interface SellerReceivableBreakdown {
    gross_amount: Discount;
    paypal_fee:   Discount;
    net_amount:   Discount;
}

export interface Shipping {
    name:    ShippingName;
    address: ShippingAddress;
}

export interface ShippingAddress {
    address_line_1: string;
    admin_area_2:   string;
    admin_area_1:   string;
    postal_code:    string;
    country_code:   string;
}

export interface ShippingName {
    full_name: string;
}
