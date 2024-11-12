const VAT_PCT:number = .19;


type PaymentAddress = {
    name: string,
    address?:{ name:string, address:string, zipcode:string}
}

type Item = {
    id?:number,
    descriptor:string,
    unitCost:number,
    units:number,
    vat: 'incl' | 'excl'
}

// type 

type InvoiceData = {
    Invoicee: PaymentAddress,
    Sender: PaymentAddress,
    items:Item[],
    dateGiven?: string,
    dateDue: string,
    structuredCreditorRef?: string,
    discountGiven?:number,
}
type InvoiceDataSignal = {
    kind: 'set_invoicee' | 'set_sender' | 'set_items' | 'set_date_given' | 'set_date_due' | 'set_scr' | 'set_discount',
    date?:string,
    scr?:string,
    discount?:number
}
export function sumPayable(ivd:InvoiceData): number{
    const discountedFromZero = (ivd.discountGiven===undefined)? 0: -ivd.discountGiven;
    return ivd.items.reduce((sum, item)=> {
        return sum + (item.unitCost*item.units) * (item.vat=='incl' ? 1+(VAT_PCT) : 1)
    }, discountedFromZero);
}

export function stateReducer(state:InvoiceData, signal:InvoiceDataSignal): InvoiceData{
    return state;
}