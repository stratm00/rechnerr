"use client";
import { InvoiceStateContext } from "@/lib/InvoiceContext";
import { paymentNumbers } from "@/lib/InvoiceData";
import { useContext, useEffect, useState } from "react"
import QRCode, { QRCodeSegment } from "qrcode"
import getStructuredCreditorReference from "@/lib/scr";
export default function ViewWidget(){
    return <>
        <div id="addressCntnr" className="py-0 ">
            <DateIssued/>
            <InvoiceAddressCard type={"invoicee"}/>
            <InvoiceAddressCard type={"sender"}/>
        </div>
        <InvoiceTitleStatement/>
        <InvoiceItemTable/>
        <InvoiceTotalStatement />
        <InvoicePaymentDetails />
        </>;

}
function DateIssued(){
    const invoiceData = useContext(InvoiceStateContext);
    return <>{invoiceData.dateGiven!==undefined && <h3>{invoiceData.dateGiven.toLocaleDateString()}</h3>}</>;
}
type InvoiceAddressCardProps = {readonly type: "invoicee"|"sender"};
function InvoiceAddressCard({type}:InvoiceAddressCardProps) {
    const invoiceData = useContext(InvoiceStateContext);
    const addressObj = (type==="invoicee")? invoiceData.invoicee : invoiceData.sender;
    return <div className="invoiceAddr py-3">
        <p>{addressObj.name}</p>
        {addressObj.address!==undefined && <p>{addressObj.address.street_address}</p>}
        {addressObj.address!==undefined && <p>{addressObj.address.zipcode}</p>}
    </div>;
    
}

function InvoiceTitleStatement(){
    const invoiceData = useContext(InvoiceStateContext);
    
    return <h1>Rechnung für {invoiceData.invoicee.name} an {invoiceData.sender.name}</h1>
}

function InvoiceItemTable(){
    const invoiceData = useContext(InvoiceStateContext);
    // const numerics = paymentNumbers(invoiceData);
    return <table className="table-auto hover:table-fixed justify-center my-10 center min-w-full">
        <thead> 
            <tr>
                <th>ID</th>
                <th>Bezeichnung</th>
                <th>Steuer enthalten</th>
                <th>Preis pro Einheit</th>
                <th>Einheiten</th>
                <th>Summe</th>
            </tr>
        </thead>

        <tbody>
        {invoiceData.items.map((it) => 
        <tr key={it.id}>
            <td className="text-center">{it.id}</td>
            <td>{it.descriptor}</td>
            <td className="text-center">{it.vat!=="incl"?  "❌":"✅"}</td>
            <td className="text-right">{it.unitCost.toFixed(2)}€</td>
            <td className="text-right">{it.units}</td>
            <td className="text-right">{(it.unitCost*it.units).toFixed(2)}€</td>
        </tr>
        )}
        

        </tbody>
        
    </table>
}

function InvoiceTotalStatement(){
    const invoiceData = useContext(InvoiceStateContext);
    const numerics = paymentNumbers(invoiceData);

    return <ul className=" text-right">
    <li>Vorsumme: {numerics.subtotal.toFixed(2)}€</li>
    <li>Steuer: {numerics.taxes.toFixed(2)}€</li>
    <li>Abzüglich: {numerics.discount.toFixed(2)}€</li>
    <li>Summe: {(numerics.subtotal+numerics.taxes-numerics.discount).toFixed(2)}€</li>
    </ul>
}

function InvoicePaymentDetails(){
    const invoiceData = useContext(InvoiceStateContext);
    const [ scr, setSCR] = useState("[keine]");
    
    useEffect(() => {

        const paymentSCR = getStructuredCreditorReference(invoiceData.paymentRef, "print");
        setSCR(paymentSCR);

        const paymentData = paymentNumbers(invoiceData)
        const paymentSum = (paymentData.subtotal+paymentData.taxes-paymentData.discount).toFixed(2)
        const purpose = "RNRR"
        
        const segments = [
            //ID: BCD
            'BCD\n', 
            //VER
            '002\n',
            //CHARSET: UTF-8 => 1
            '1\n',
            //FIXED: SCT, BIC(EMPTY)
            'SCT\n',
            //BIC(EMPTY)
            '\n',
            //NAME (max 70 chars) of Beneficiary
            invoiceData.sender.name.slice(0,70)+"\n",
            //IBAN of Beneficiary
            invoiceData.sender.iban+"\n",
            //AMOUNT IN EURO
            `EUR${paymentSum}\n`,
            //PURPOSE            
            purpose+'\n'+'\n',
            //REMITTANCE REF:Structured Creditor Reference
            paymentSCR+'\n',
            //Remittance Text
            '0'.repeat(70)+'\n'
            //Beneficiary to Originator Information         
        ]
        const te = new TextEncoder();

        //Alles in Byte-Segmente
        const byteSegments:QRCodeSegment[] = segments.map(seg => {
            return {mode:'byte', data:te.encode(seg)}
        })

        QRCode.toCanvas(document.getElementById("EPC2"), byteSegments, {errorCorrectionLevel: 'M'} ).catch((e) => {console.log(e);alert("Fehler bei der Generation des QR-Codes für die Zahlung")});


        return () => {}
    }, [invoiceData])
    return <>
        <p className="mt-2">Bitte zahlen Sie die angegebene Summe zeitlich, sodass sie sich am {invoiceData.dateDue.toLocaleDateString()} beim Empfänger befindet.</p>
        <p>an IBAN: {invoiceData.sender.iban}</p>
        <p>Referenz: {scr}</p>
        <p> Oder scannen Sie den folgenden QR-Code:</p>
        <canvas id="EPC2" className="bg-inherit"></canvas>
        </>
}