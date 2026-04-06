import { format } from "date-fns";

export function formatCurrency(value: number, currency = "KM") {
  return `${new Intl.NumberFormat("bs-BA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)} ${currency}`;
}

export function formatCurrencyPrecise(value: number, currency = "KM") {
  return `${new Intl.NumberFormat("bs-BA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ${currency}`;
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "dd.MM.yyyy. HH:mm");
}

export function formatDateShort(date: Date | string) {
  return format(new Date(date), "dd.MM.yyyy.");
}
