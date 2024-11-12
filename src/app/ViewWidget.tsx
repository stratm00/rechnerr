"use client";
import { InvoiceStateContext } from "@/lib/InvoiceContext";
import { useContext } from "react"
export default function ViewWidget(){
    const invoiceData = useContext(InvoiceStateContext);
    return <p>Rechnung von {invoiceData.invoicee.name} an {invoiceData.sender.name}.</p>
}