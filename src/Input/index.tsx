import React from "react"

interface Props extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "onChange"> {
    value: string
    onChange: (value: string) => void
}

const Input: React.FunctionComponent<Props> = ({ onChange, ...props }) => {
    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }, [onChange])

    return (
        <input onChange={handleChange} {...props} />
    )
}

export default Input