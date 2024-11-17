"use client"

import { retrieveStateFromLocalStorage } from "@/lib/generic";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { InvoiceData, LOCALSTORAGE_KEY } from "@/lib/InvoiceData";
import { useContext, useState } from "react";

export default function FormWidget(){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);
    
    function handleLoadFromLocalStorage(){
        const locStorStage = retrieveStateFromLocalStorage<InvoiceData>(LOCALSTORAGE_KEY);
        if (locStorStage!==null){
            invoiceDispatch({
                kind:"set_state",
                newState:locStorStage
            });
        } 
    }
    function handleSaveToLocalStorage(){
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(invoiceData));
    }
    function discountAction(formData: { get: (arg0: string) => any; }){
        const discount = formData.get("discount")
        if(!isNaN(Number(discount))){
            invoiceDispatch({
                kind: 'set_discount',
                discount: Number(discount)
            })
        }
    }
    
    return <div className="print-invisible">
        <p> Editiere hier: </p>
        <button onClick={() => {invoiceDispatch({
                        kind: "switch_parties"
                    }); 
                        }}>Adressen wechseln </button>
            <button onClick={handleSaveToLocalStorage}>S</button>
        <button onClick={handleLoadFromLocalStorage}>L</button>
        
        <InvoicePartyEditForm party="sender"/>
        <InvoicePartyEditForm party="invoicee"/>
        

        <DiscountEditForm/>
        
    </div>;
}
type PartyProps = Readonly<{party:'sender'|'invoicee'}>;
function InvoicePartyEditForm({party}:PartyProps){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);
    const chosenParty = party==='sender'?invoiceData.sender:invoiceData.invoicee;
    
    const [localName, setLocalName] = useState(chosenParty.name);
    const [localIBAN, setLocalIBAN] = useState(chosenParty.iban);
    const [localStreetAddress, setLocalStreetAddress] = useState(chosenParty.address?.street_address);
    const [localZipcode, setLocalZipcode] = useState(chosenParty.address?.zipcode);
    const handleSubmit = ()=>{
        invoiceDispatch({
            kind: (party==='sender')? 'set_sender':'set_invoicee',
            paymentAddress: {
                name: localName, address:{
                    street_address:localStreetAddress,
                    zipcode:localZipcode
                }, iban:localIBAN
            } 
        })
    }
    return <form className="p-4">
            <input type="text" className="rounded-md border-b-slate-100 text-slate-700" value={localName} onChange={(e)=>{setLocalName(e.target.value)}}/>
            <input type="text" className="rounded-md border-b-slate-100 text-slate-700" value={localIBAN} onChange={(e)=>{setLocalIBAN(e.target.value)}}/>
            <input type="text" className="rounded-md border-b-slate-100 text-slate-700" value={localStreetAddress} onChange={(e)=>{setLocalStreetAddress(e.target.value)}}/>
            <input type="text" className="rounded-md border-b-slate-100 text-slate-700" value={localZipcode} onChange={(e)=>{setLocalZipcode(e.target.value)}}/>
            <input type="submit" className="rounded-md border-b-slate-100 text-slate-700"  value="✅" onClick={(e)=>{e.preventDefault(); handleSubmit()}}/>
        </form>
}
function DiscountEditForm(){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);
    const [currentDiscount, setCurrentDiscount] = useState(invoiceData.discountGiven ?? 0);
    
    const handleSubmit = ()=>{
        invoiceDispatch({
            kind: 'set_discount',
            discount: currentDiscount
        })
    }
    
    return <form>
        <input type="number" id="discount" value={currentDiscount} onChange={(e) => setCurrentDiscount(Number(e.target.value))}/>
        <input type="submit" value="✅" onClick={(e)=>{handleSubmit();e.preventDefault()}}/>
    </form>
}