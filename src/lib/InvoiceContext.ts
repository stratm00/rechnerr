import {createContext, Dispatch} from "react";
import {DEFAULT_INITIAL_INVOICE_STATE,InvoiceData, InvoiceDataSignal} from "./InvoiceData";

export const InvoiceStateContext = createContext<InvoiceData>(DEFAULT_INITIAL_INVOICE_STATE);
export const InvoiceDispatchContext = createContext<Dispatch<InvoiceDataSignal>>(() => {});