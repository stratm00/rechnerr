const VAT_PCT:number = .19;
export const LOCALSTORAGE_KEY = "invoiceState"

type PaymentAddress = {
    name: string,
    address:{ street_address:string, zipcode:string},
    iban:string
}

export type Item = {
    id:number,
    descriptor:string,
    unitCost:number,
    units:number,
    vat: 'incl' | 'excl'
}


export type InvoiceData = {
    invoicee: PaymentAddress,
    sender: PaymentAddress,
    items:Item[],
    dateGiven?: Date,
    dateDue: Date,
    // structuredCreditorRef?: string,
    discountGiven?:number,
    paymentRef:string
}

export const DEFAULT_INITIAL_INVOICE_STATE:InvoiceData = {
    invoicee: {
        name: "Preller und Söhne GmbH & co. KG",
        address: {
            street_address: "Zechestraße 7",
            zipcode: "00000 Koblenz"
        },
        iban: "DE02370502990000684712"
    },
    sender: {
        name: "Anwaltskanzlei Prassel und Tassel",
        address: {
            street_address: "Hohe Gerichtsstraße 19",
            zipcode: "01010 Annastadt"
        },
        iban: "DE02120300000000202051"
    },
    items: [
        {  
            id:0,
            descriptor: "Beratungseinheiten",
            unitCost: 1800,
            units: 2,
            vat: "excl"
        },
        {
            id:1,
            descriptor: "Schuldenübertrag an Fremde",
            unitCost: 100,
            units:1,
            vat: "incl"
        }
    ],
    discountGiven: 100,
    dateDue: new Date(0),
    dateGiven: new Date(0),
    paymentRef: "REF"
} 

export type InvoiceDataSignal = {
    kind: 'set_invoicee' | 'set_sender' | 'set_items' | 'set_date_given' | 'set_date_due' | 'set_scr' | 'set_discount' | 'switch_parties' | 'set_payment_reference' | 'set_state',
    paymentAddress?:PaymentAddress
    date?:Date,
    scr?:string,
    discount?:number,
    items?:Item[],
    ref?:string,
    newState?:InvoiceData
}

type PaymentNumbers = {
    subtotal:number,
    taxes:number,
    discount:number
}
export function paymentNumbers(ivd:InvoiceData): PaymentNumbers{
    const paymentNums = {subtotal:0, taxes:0, total:0, discount:ivd.discountGiven ?? 0};
    for (const it of ivd.items){
        const itemSubtotal = it.unitCost*it.units;
        paymentNums.subtotal+=itemSubtotal;
        if(it.vat=="incl")paymentNums.taxes+= (VAT_PCT*itemSubtotal) ;
    }
    return paymentNums;
}

export function stateReducer(state:InvoiceData, signal:InvoiceDataSignal): InvoiceData{
    switch(signal.kind){
        case "set_invoicee": {
            if(signal.paymentAddress!==undefined){
                return {...state,
                    invoicee:signal.paymentAddress
                }
            }
            break;
        }
        case "set_sender" : {
            if(signal.paymentAddress!==undefined){
                return {...state,
                    sender:signal.paymentAddress
                }
            }
            break;
        }
        //Invariant: items are sorted asc. by ID
        case "set_items": {
            if(signal.items!==undefined){
                return {...state,
                    items:signal.items.toSorted((a,b)=>a.id-b.id)
                }
            }
            break;
        }
        case "set_date_due": {
            if(signal.date!==undefined){
                return {...state,
                    dateDue:signal.date
                };
            }
            break;
        }
        case "set_date_given": {
            if(signal.date!==undefined){
                return {...state,
                    dateGiven:signal.date
                }
            }
            break;
        }
        case "set_payment_reference": {
            if(signal.ref!==undefined){
                return {...state,
                    paymentRef:signal.ref
                }
            }
            break;
        }
        case "set_discount": {
            if(signal.discount!==undefined){
                return {...state,
                    discountGiven:signal.discount
                }
            }
            break;
        }
        
        
        case "set_state": {
            if (signal.newState!==undefined){
                return signal.newState;
            }
        }
    }
    return state;
}
