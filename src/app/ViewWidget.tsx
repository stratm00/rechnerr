"use client";
import { InvoiceStateContext } from "@/lib/InvoiceContext";
import { sumPayable } from "@/lib/InvoiceData";
import { useContext } from "react"
export default function ViewWidget(){
    const invoiceData = useContext(InvoiceStateContext);
    return <>
        <p>Rechnung für {invoiceData.invoicee.name} an {invoiceData.sender.name}.</p>
        <InvoiceAddressCard type={"invoicee"}/>
        <InvoiceAddressCard type={"sender"}/>
        <InvoiceItemTable/>
        <InvoiceTotalStatement />
        </>;

}

// const AddressStatementCard = (type: "invoicee" | "sender") => {
    // return () => {
//         // const invoiceData = useContext(InvoiceStateContext);
//         const addressObj = (type==="invoicee")? invoiceData.invoicee : invoiceData.sender;
//         return <>
//             <p>{addressObj.name}</p>
//             {addressObj.address!==undefined && <p>{addressObj.address.street_address}</p>}
//             {addressObj.address!==undefined && <p>{addressObj.address.zipcode}</p>}
//         </>;
//     }
// }

function InvoiceAddressCard({ type: "invoicee" | "sender" }) {
    const invoiceData = useContext(InvoiceStateContext);
    const addressObj = (type==="invoicee")? invoiceData.invoicee : invoiceData.sender;
    return <>
        <p>{addressObj.name}</p>
        {addressObj.address!==undefined && <p>{addressObj.address.street_address}</p>}
        {addressObj.address!==undefined && <p>{addressObj.address.zipcode}</p>}
    </>;
    
}
// const InvoiceeCard = AddressStatementCard("invoicee")
// const InvoiceSenderCard = AddressStatementCard("sender")

function InvoiceItemTable(){
    return <p>Tabellarische Auflistung</p>
}
function InvoiceTotalStatement(){
    const invoiceData = useContext(InvoiceStateContext);
    return <p>Summen: {sumPayable(invoiceData)}</p>
}