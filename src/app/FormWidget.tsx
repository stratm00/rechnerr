"use client"

import { retrieveStateFromLocalStorage } from "@/lib/generic";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { InvoiceData, LOCALSTORAGE_KEY } from "@/lib/InvoiceData";
import { useContext, useState } from "react";
import ItemForm from "./ItemForm";

const [MIN_REF_LENGTH, MAX_REF_LENGTH] = [2,10];

export default function FormWidget(){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);
    
    const handleLoadFromLocalStorage = ()=>{
        const locStorStage = retrieveStateFromLocalStorage<InvoiceData>(LOCALSTORAGE_KEY);
        if (locStorStage!==null){
            invoiceDispatch({
                kind:"set_state",
                newState:locStorStage
            });
        } 
    }
    const handleSaveToLocalStorage = ()=>{
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(invoiceData));
    }
    
    return <div className="print-invisible p-4">
        <button className="rounded-md p-2 bg-lime-800" onClick={handleSaveToLocalStorage}>Speichern </button>
        <button className="rounded-md p-2 bg-lime-800 mx-4" onClick={handleLoadFromLocalStorage}>Laden</button>
        
        <ReferenceEditForm/>
        <InvoicePartyEditForm party="invoicee"/>
        <InvoicePartyEditForm party="sender"/>
        
        <ItemForm/>
        <DiscountEditForm/>
        <button className="bg-rose-800 py-2 px-16 min-w-10 rounded-md" onClick={()=>window.print()}>🖨Druck</button>
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
    return <form className="py-4">
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" value={localName} onChange={(e)=>{setLocalName(e.target.value)}}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700 mt-2" value={localStreetAddress} onChange={(e)=>{setLocalStreetAddress(e.target.value)}}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" value={localZipcode} onChange={(e)=>{setLocalZipcode(e.target.value)}}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700 mt-2" value={localIBAN} onChange={(e)=>{setLocalIBAN(e.target.value)}}/>
            <input type="submit" className="rounded-md border-solid border-2 border-slate-300 text-slate-700"  value="🔄" onClick={(e)=>{e.preventDefault(); handleSubmit()}}/>
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
    
    return <form className="py-6">
        <label htmlFor="discount" className="min-w-full inline-block">Skonto</label>
        <input type="number" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" id="discount" name="discount" value={currentDiscount} onChange={(e) => setCurrentDiscount(Number(e.target.value))}/>
        <input type="submit" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" value="🔄" onClick={(e)=>{handleSubmit();e.preventDefault()}}/>
    </form>
}

function ReferenceEditForm(){
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);
    const [localRef, setLocalRef] = useState(invoiceData.paymentRef ?? "");

    const handleReferenceSubmit = () => {
        if(localRef.length >= MIN_REF_LENGTH && localRef.length <= MAX_REF_LENGTH)
            invoiceDispatch({
                kind: 'set_payment_reference',
                ref:localRef,
            });
    }
    return <form className="py-6" action={handleReferenceSubmit}>
        <label htmlFor="ref_input" className="min-w-full inline-block">Referenz</label>
        <input className="rounded-md border-solid border-2 border-slate-300 text-slate-700" type="text" name="ref_input" defaultValue={localRef} onChange={(e)=>{console.log("onchange");setLocalRef(e.target.value)}}></input>
        <input className="rounded-md border-solid border-2 border-slate-300 text-slate-700" type="submit" value="🔄"></input>
    </form>
}