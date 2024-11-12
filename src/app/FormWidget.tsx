"use client"
import { useState } from "react";
// import {getStructuredCreditorReference} from "../lib/scr";
import getStructuredCreditorReference from "../lib/scr";

export default function FormWidget(){
    const [structuredCreditorReference, setStructuredCreditorReference] = useState("No SCR selected");
    return <>
    <p>AAA</p>
    <input type="text" onChange={(event) => {
        try{ 
            setStructuredCreditorReference(getStructuredCreditorReference(event.target.value, "print"))
        }catch{
            setStructuredCreditorReference("Incorrect Length")
        }}
        }></input>
    <code>{structuredCreditorReference}</code>
    </>;
}