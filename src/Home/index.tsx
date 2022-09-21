import React from "react"
import EnquiryForm from "../EnquiryForm"
import SocialProof from "../SocialProof"

const Home: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="container">
                <main>
                    <div className="row">
                        <div className="col">
                            <h1>
                                Contour drawings without the fuss
                            </h1>
                            <p>
                                Using aerial images and photo grammetry we can produce up to date contour drawings with a relatively fast turn around
                            </p>
                            <a href="#enquiry-form" className="btn btn-primary">
                                Enquire now!
                            </a>
                        </div>
                        <div className="col">
                            <img src="https://placekitten.com/600/400" alt="" className="img-fluid" />
                        </div>
                    </div>
                    <SocialProof />
                    <EnquiryForm />
                </main>
            </div>
            <Footer />
        </React.Fragment>
    )
}

const Navbar: React.FunctionComponent = () => {
    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-light">
            <div className="container">
                <a className="navbar-brand" href="/">Updraft</a>
            </div>
        </nav>
    )
}

const Footer: React.FunctionComponent = () => {
    return (
        <footer>

        </footer>
    )
}

export default Home
