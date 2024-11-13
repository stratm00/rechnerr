"use client"

import { InvoiceDispatchContext } from "@/lib/InvoiceContext";
import { useContext } from "react";

export default function FormWidget(){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    return <div className="print-invisible">
        <p>AAA</p>
        <p> Editiere hier: </p>
        <button onClick={() => {invoiceDispatch({
                        kind: "switch_parties"
                    }); 
                    }}>Adressen wechseln </button>
    </div>;
}