"use client";
import { useReducer } from "react";
import FormWidget from "./FormWidget";
import ViewWidget from "./ViewWidget";
import { DEFAULT_INITIAL_INVOICE_STATE, stateReducer } from "@/lib/InvoiceData";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";





export default function Home() {
  
  const [invoiceState, invoiceDispatch] = useReducer(stateReducer, DEFAULT_INITIAL_INVOICE_STATE);
  

 return (
    <div className="flex font-[family-name:var(--font-geist-sans)]">
      <InvoiceStateContext.Provider value={invoiceState}>
      <div className="max-w-sm  flex print-invisible text-sm">
        <InvoiceDispatchContext.Provider value={invoiceDispatch}>
          <FormWidget/>
        </InvoiceDispatchContext.Provider>
      </div>
      <article id="invoice" className="py-20 max-w-7xl mx-auto text-sm">
        <ViewWidget/>
      </article>
      </InvoiceStateContext.Provider>
    </div>
  );
}

