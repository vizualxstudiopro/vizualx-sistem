export type InvoicePdfSettings = {
  companyName: string;
  companyTagline: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyNipt: string;
  individualClientName: string;
  clientCif: string;
  personalSsn: string;
  bankName: string;
  bankBranch: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankCurrency: string;
  bankIban: string;
  bankSwift: string;
};

export const INVOICE_SETTINGS_PATH = "config/invoice-pdf-settings.json";

export const defaultInvoicePdfSettings: InvoicePdfSettings = {
  companyName: "VizualX Studio",
  companyTagline: "Digital Systems, Branding & Growth",
  companyAddress: "Tirane, Shqiperi",
  companyPhone: "+355 69 69 69 348",
  companyEmail: "suport@vizualx.online",
  companyWebsite: "https://www.vizualx.online",
  companyNipt: "K00000000A",
  individualClientName: "BESMIR GERMIZI",
  clientCif: "419861856",
  personalSsn: "I71020037K",
  bankName: "BANKA KOMBETARE TREGTARE",
  bankBranch: "BKT - DEGA KUKES",
  bankAccountTitle: "BESMIR LUTFI GERMIZI",
  bankAccountNumber: "419861856CLIDCLALLVB",
  bankCurrency: "ALL",
  bankIban: "AL1020555193861856CLIDCLALLV",
  bankSwift: "NCBAALTX",
};

export function mergeInvoiceSettings(raw: unknown): InvoicePdfSettings {
  if (!raw || typeof raw !== "object") {
    return defaultInvoicePdfSettings;
  }

  const parsed = raw as Partial<InvoicePdfSettings>;
  return {
    ...defaultInvoicePdfSettings,
    ...Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === "string")),
  } as InvoicePdfSettings;
}
