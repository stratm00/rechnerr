import { InvoiceDispatchContext, InvoiceStateContext } from "@/lib/InvoiceContext";
import { Item } from "@/lib/InvoiceData";
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
    let handleFormByID = (id:number) => (formData: FormData) => {
        //Update localItems(id)
        
        let newLocalItems = localItems.filter(el=>el.id!=id);
        let newlyBuiltItem: Item = {
            id: Number(formData.get("item_id")) ||2,
            descriptor: "",
            unitCost: 0,
            units: 0,
            vat: "incl"
        }
        newLocalItems.push(newlyBuiltItem)
        setLocalItems(newLocalItems)
    };

    return <div>
        <ul>
            {localItems.map(item => {
                return <form key={item.id} action={(formData) => {handleFormByID(item.id)(formData)}}>
                    <li>
                        <input type="hidden" id="itemid" value={item.id}/>
                        <input type="text" id="item_descriptor" value={item.descriptor}></input>
                        <input type="number" id="item_unit_cost" value={item.unitCost}></input>
                        <input type="number" id="item_units" value={item.units}></input>
                        <input type="checkbox" id="item_vat" value={item.vat==='excl'?'on':'off'}></input>
                        <input type="submit"></input>
                    </li> 
                </form>
            })}
        </ul>
        <button onClick={moveItemsIntoState}>🔄</button>
    </div>;
}