/**
 * Siehe https://en.wikipedia.org/wiki/Creditor_Reference 
 *      https://www.mobilefish.com/services/creditor_reference/creditor_reference.php
 * 
 */
export default function getStructuredCreditorReference(desc:string ,format: "print"|"digital"): string {
    if(desc.length >= 10 || desc.length<1) throw new Error("SCR Reference needs to be a correct length");
    const numValsList = desc.split("").map(_getCharVal);
    //27 15 00 ~= RF 00 -> Wir berechnen die richtigen Prüfziffern für die Referenz
    const totalNumValue = numValsList.join("")+"271500";
    const chknum = ((Math.floor(Number(totalNumValue)/97)*97+98) % 100).toString().padStart(2, "0");
    
    if(format === "digital"){
        return `RF${chknum}${desc.padStart(21,"0")}` ;
    }else {
        return `RF${chknum}${desc}`; 
    }
}

function _getCharVal(input:string): number{
    if (input.length != 1) return -1;
    return "0123456789abcdefghijklmnopqrstuvwxyz".indexOf(input.toLowerCase());
}

/*
Finde RFXY:
1. Finde passendes Vielfaches von 97
2. Y + 10*(X + 10000*(2715 + 1000*(charVals))) = c*97+1
2. CharVals * 100009999 + 2715*10000 + X*10 + Y == c*96+96
*/