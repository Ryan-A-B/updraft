import React from "react"

interface Props extends Omit<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "onChange"> {
  value: string
  onChange: (value: string) => void
}

const TextArea: React.FunctionComponent<Props> = ({ onChange, ...props }) => {
  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }, [onChange])

  return (
    <textarea onChange={handleChange} {...props} />
  )
}

export default TextArea
