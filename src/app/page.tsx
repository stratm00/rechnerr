"use client";
import { useEffect, useReducer } from "react";
import FormWidget from "./FormWidget";
import ViewWidget from "./ViewWidget";
import { DEFAULT_INITIAL_INVOICE_STATE, LOCALSTORAGE_KEY, stateReducer } from "@/lib/InvoiceData";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";





export default function Home() {
  let initialInvoiceState = DEFAULT_INITIAL_INVOICE_STATE;
  useEffect(() => {
    //on mount: Falls localStorage Rechnungsdaten hat, lade sie
    const ans = localStorage.getItem(LOCALSTORAGE_KEY);
    if(ans !== null){
      try {
        initialInvoiceState = JSON.parse(ans);
      }catch {}
    }
  }, []);
  const [invoiceState, invoiceDispatch] = useReducer(stateReducer, initialInvoiceState);
  
  //Wenn Rechnungsstand sich verändert, dann wird das Ergebnis in die LocalStorage getan.
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(invoiceState))
    return ()=>{};
  }, [invoiceState]);

 return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      Hallo Test
      <InvoiceStateContext.Provider value={invoiceState}>
        <InvoiceDispatchContext.Provider value={invoiceDispatch}>
          <FormWidget/>
        </InvoiceDispatchContext.Provider>
        <ViewWidget/>
      </InvoiceStateContext.Provider>
    </div>
  );
}

