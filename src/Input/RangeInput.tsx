import React from "react"

interface Props extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "onChange"> {
    value: number
    onChange: (elevation: number) => void
}

const RangeInput: React.FunctionComponent<Props> = ({ onChange, ...props }) => {
    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(event.target.value))
    }, [onChange])
    
    return (
        <input type="range" onChange={handleChange} {...props} />
    )
}

export default RangeInput