import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { useContext, useState } from "react";

export default function ItemForm(){
    const invoiceData = useContext(InvoiceStateContext);
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const [localItems, setLocalItems] = useState(invoiceData.items);
    function moveItemsIntoState(){
        console.log("moveItemsIntoState")
        setLocalItems(localItems.toSorted((a,b)=>{return a.id-b.id}))
        invoiceDispatch({kind:'set_items', items:localItems});
    }
    return <div>
        <ul>
            {localItems.map(item => {
                return <li key={item.id}>
                    <input type="hidden" value={item.id}/>
                    <input type="text" value={item.descriptor}></input>
                    <input type="number" value={item.unitCost}></input>
                    <input type="number" value={item.units}></input>
                    <input type="checkbox" value={item.vat==='excl'?'on':'off'}></input>
                </li>
            })}
        </ul>
        <button onClick={moveItemsIntoState}>🔄</button>
    </div>;
}