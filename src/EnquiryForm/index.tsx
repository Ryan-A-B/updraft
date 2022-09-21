import React from "react"
import Input from "../Input"
import TextArea from "../TextArea"

interface Props {

}

const EnquiryForm: React.FunctionComponent<Props> = () => {
    const [name, setName] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [emailAddress, setEmailAddress] = React.useState("")
    const [message, setMessage] = React.useState("")
    // date picker
    // area to be mapped
    // captcha

    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }, [])

    return (
        <div id="enquiry-form" className="card">
            <div className="card-header">
                Enquiry Form
            </div>
            <div className="card-body">
                <form onSubmit={onSubmit}>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label htmlFor="input-name" className="form-label">
                                Name
                            </label>
                            <Input
                                id="input-name"
                                type="text"
                                value={name}
                                onChange={setName}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-4 mb-3">
                            <label htmlFor="input-phone-number" className="form-label">
                                Phone Number
                            </label>
                            <Input
                                id="input-phone-number"
                                type="tel"
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-8 mb-3">
                            <label htmlFor="input-email" className="form-label">
                                Email
                            </label>
                            <Input
                                id="input-email"
                                type="email"
                                value={emailAddress}
                                onChange={setEmailAddress}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label htmlFor="textarea-message" className="form-label">
                                Message
                            </label>
                            <TextArea
                              id="textarea-message"
                              value={message}
                              onChange={setMessage}
                              className="form-control"
                              required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit!
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EnquiryForm
