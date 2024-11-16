"use client";
import { InvoiceStateContext } from "@/lib/InvoiceContext";
import { paymentNumbers } from "@/lib/InvoiceData";
import { useContext, useEffect } from "react"
import QRCode from "qrcode"
export default function ViewWidget(){
    return <>
        <div id="addressCntnr" className="py-5 ">
            <InvoiceAddressCard type={"invoicee"}/>
            <InvoiceAddressCard type={"sender"}/>
        </div>
        <InvoiceTitleStatement/>
        <InvoiceItemTable/>
        <InvoiceTotalStatement />
        <InvoicePaymentDetails />
        </>;

}


function InvoiceTitleStatement(){
    const invoiceData = useContext(InvoiceStateContext);
    
    return <h1>Rechnung von {invoiceData.invoicee.name} an {invoiceData.sender.name}</h1>
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
            <td className="text-center">{it.vat!=="excl"?  "❌":"✅"}</td>
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
    //Bilde QR-Code jedesmal wenn [IBAN, REFERENZ, SUMME] sich ändert (im grunde alles uezs)
    useEffect(() => {
        //Generiere EPC-Inhalte
        QRCode.toCanvas(document.getElementById("EPC2"), `${invoiceData.invoicee.name}-${invoiceData.sender.name}` ).catch(() => {alert("Fehler bei der Generation des QR-Codes für die Zahlung")});
        return () => {}
    }, [invoiceData])
    return <>
        <h2>an IBAN: DE19198302180213021</h2>
        <h2>Referenz: RF4REF</h2>
        <h3> Oder scannen sie den folgenden QR CODE:</h3>
        <canvas id="EPC2" className="bg-inherit w-[100] h-[100]"></canvas>
        </>
}