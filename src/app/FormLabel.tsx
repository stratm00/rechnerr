type FormLabelProps = Readonly<{htmlFor: string, text: string}>;
export default function FormLabel(props:FormLabelProps){
    return <label htmlFor={props.htmlFor} className="min-w-full inline-block">{props.text}</label>
}