"use client"

import { retrieveStateFromLocalStorage } from "@/lib/generic";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { InvoiceData, LOCALSTORAGE_KEY } from "@/lib/InvoiceData";
import { ChangeEventHandler, useContext, useState } from "react";
import ItemForm from "./ItemForm";
import FormLabel from "./FormLabel";

const [MIN_REF_LENGTH, MAX_REF_LENGTH] = [1,10];

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
        <DateEditForm type="due"/>
        <DateEditForm type="given"/>
        <InvoicePartyEditForm party="invoicee"/>
        <InvoicePartyEditForm party="sender"/>
        <h2>Posten</h2>
        <ItemForm/>
        <DiscountEditForm/>
        <button className="bg-rose-800 py-2 px-16 min-w-10 rounded-md" onClick={()=>window.print()}>🖨Druck</button>
    </div>;
}

type DateEditProps = Readonly<{type:'due'|'given'}>;
function DateEditForm({type}:DateEditProps){
    const dispatch = useContext(InvoiceDispatchContext);
    const invoiceData = useContext(InvoiceStateContext);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatch({
            kind: type==='due'?'set_date_due': 'set_date_given',
            date: new Date(e.target.value)
        })
    }

    if (type==='due'){
        return <form>
        <FormLabel htmlFor="dateDue" text="Zahlungsdatum"/>
        <input type="date" name="dateDue" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" defaultValue={invoiceData.dateDue.toLocaleDateString()} onChange={handleChange}></input>
    </form>
    } else {
        return <form>
        <FormLabel htmlFor="dateDue" text="Ausgabedatum"/>
        <input type="date" name="dateDue" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" defaultValue={invoiceData.dateGiven?.toLocaleDateString()} onChange={handleChange}></input>
    </form>
    }

    
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
            <FormLabel htmlFor="" text={party==="sender"?"Kreditor":"Schuldner"}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" value={localName} onChange={(e)=>{setLocalName(e.target.value)}}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700 mt-2" value={localStreetAddress} onChange={(e)=>{setLocalStreetAddress(e.target.value)}}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700 mb-2" value={localZipcode} onChange={(e)=>{setLocalZipcode(e.target.value)}}/>
            <input type="text" className="rounded-md border-solid border-2 border-slate-300 text-slate-700 " value={localIBAN} onChange={(e)=>{setLocalIBAN(e.target.value)}}/>
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
        <FormLabel htmlFor="discount" text="Skonto"/>
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
        <FormLabel htmlFor="ref_input" text="Referenz"/>
        <input className="rounded-md border-solid border-2 border-slate-300 text-slate-700" type="text" name="ref_input" defaultValue={localRef} onChange={(e)=>{setLocalRef(e.target.value)}}></input>
        <input className="rounded-md border-solid border-2 border-slate-300 text-slate-700" type="submit" value="🔄"></input>
    </form>
}