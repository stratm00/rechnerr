"use client"

import { retrieveStateFromLocalStorage } from "@/lib/generic";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { InvoiceData, LOCALSTORAGE_KEY } from "@/lib/InvoiceData";
import { useContext } from "react";

export default function FormWidget(){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);
    
    function handleLoadFromLocalStorage(){
        const locStorStage = retrieveStateFromLocalStorage<InvoiceData>(LOCALSTORAGE_KEY);
        if (locStorStage!==null){
            invoiceDispatch({
                kind:"set_state",
                state:locStorStage
            });
        } 
    }
    function handleSaveToLocalStorage(){
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(invoiceData));
    }
    return <div className="print-invisible">
        <p> Editiere hier: </p>
        <button onClick={() => {invoiceDispatch({
                        kind: "switch_parties"
                    }); 
                    }}>Adressen wechseln </button>
        <button onClick={handleSaveToLocalStorage}>S</button>
        <button onClick={handleLoadFromLocalStorage}>L</button>
    </div>;
}