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

        <DiscountEditForm/>
        
    </div>;
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