"use client";
import { useReducer } from "react";
import FormWidget from "./FormWidget";
import ViewWidget from "./ViewWidget";
import { DEFAULT_INITIAL_INVOICE_STATE, stateReducer } from "@/lib/InvoiceData";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";





export default function Home() {
  let initialInvoiceState = DEFAULT_INITIAL_INVOICE_STATE;
  
  const [invoiceState, invoiceDispatch] = useReducer(stateReducer, initialInvoiceState);
  

 return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <InvoiceStateContext.Provider value={invoiceState}>
        <InvoiceDispatchContext.Provider value={invoiceDispatch}>
          <FormWidget/>
        </InvoiceDispatchContext.Provider>
        <ViewWidget/>
      </InvoiceStateContext.Provider>
    </div>
  );
}

