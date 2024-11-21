"use client";
import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { Item } from "@/lib/InvoiceData";
import { useContext, useMemo, useState } from "react";

export default function ItemForm(){
    const invoiceData = useContext(InvoiceStateContext);
    const invoiceDispatch = useContext(InvoiceDispatchContext);
    const [localItems, setLocalItems] = useState(invoiceData.items);
    function moveItemsIntoState(){
        console.log("moveItemsIntoState")
        invoiceDispatch({kind:'set_items', items:localItems});
    }
    const nextID = useMemo(()=>localItems.length, [localItems]);

    const localStateDifferences = useMemo(()=>(JSON.stringify(localItems)!=JSON.stringify(invoiceData.items)), [localItems, invoiceData.items]);

    const handleFormByID = (id:number) => (formData: FormData) => {
        //Update localItems(id)
        
        const newLocalItems = localItems.filter(el=>el.id!==id);
        const newlyBuiltItem: Item = {
            id: Number(formData.get("item_id")),
            descriptor: formData.get("item_descriptor")?.toString() ?? "",
            unitCost: Number(formData.get("item_unit_cost")),
            units: Number(formData.get("item_units")),
            vat: formData.get("item_vat")?"incl":"excl"
        }
        console.log(newlyBuiltItem)
        newLocalItems.push(newlyBuiltItem)
        newLocalItems.sort((a,b)=>a.id-b.id)
        setLocalItems(newLocalItems)
    };
    const deleteItem = (id:number) => {
        setLocalItems(localItems.filter((it)=>it.id!==id))
    } 
    const localNewItem = () => {
        //HACK: Array copy
        const newLocalItems = localItems.filter(()=>true)
        newLocalItems.push({
            id: nextID,
            descriptor: "--New Item--",
            unitCost: 0,
            units: 0,
            vat: "incl"
        });
        setLocalItems(newLocalItems);
    }
    return <div>
        <ul>
            {localItems.map(item => {
                return <form  className="p-4" key={item.id} action={(formData) => {handleFormByID(item.id)(formData)}}>
                    <input type="hidden" id="item_id" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" name="item_id" defaultValue={item.id}/>
                    <input type="text" id="item_descriptor" name="item_descriptor" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" defaultValue={item.descriptor}></input>
                    <input type="number" id="item_unit_cost" name="item_unit_cost" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" defaultValue={item.unitCost}></input>
                    <input type="number" id="item_units" name="item_units" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" defaultValue={item.units}></input>
                    
                    <div className="min-w-full"><input type="checkbox" id={`item_vat${item.id}`} name="item_vat" className="rounded-md border-solid border-2 border-slate-300 text-slate-700" defaultChecked={item.vat==='incl'}></input>
                    <label htmlFor={`item_vat${item.id}`} className="mx-2">Steuer enthalten</label></div>
                    <input className="rounded-md p-2 bg-lime-800"type="submit" value="Zwischenspeichern"></input>
                    <button className="bg-rose-800 rounded-md p-2 mx-2" onClick={()=> {deleteItem(item.id)}}>Löschen</button>
                </form>
            })}
        </ul>
        <button onClick={moveItemsIntoState} className="p-4 justify-center bg-slate-950 font-semibold">REFRESH ITEMS {localStateDifferences && 'NOW'}</button>
        <button onClick={localNewItem} className="rounded-md-2 p-2 mx-2">Neues Item!</button>
    </div>;
}