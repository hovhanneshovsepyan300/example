import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Heading, Loading } from '..'
import GDPRPopupView from './GDPRPopupView'

class GDPRPopup extends PureComponent {
    constructor() {
        super()
        this.state = {
            downloadPending: false,
            loadingGDPR: false,
        }
    }

    getPopupContent() {
        return (
            <div className="GDPRPopupView__content">
                <div>
                    <Heading text="GDPR" />
                </div>
                <div>
                    <br />
                    <b>YOUR DATA</b>
                    <p>The personal information provided as part of village hotline reporting process will be stored and processed by the Festival team solely for the purpose of processing and responding to your query, complaint or request.   The information may be shared with the Police, Mendip Council, GFEL contracted companies (e.g. security companies), or volunteer teams if necessary to resolve your request.
                        Village data will be stored for a maximum of 5 Festival cycles. If you would like your details removed from the Village Hotline database before this time period is completed, please contact villageliaison@glastonburyfestivals.co.uk
                        The email / postal address and contact numbers you provide will only be used to communicate with you with reference to your reported call to the Village Hotline.
                    </p>
                    <b>PRIVACY POLICY</b>
                    <p>The full Glastonbury Festival Privacy Policy can be found here: https://www.glastonburyfestivals.co.uk/privacy-policy/</p>
                </div>
                <div className="GDPRPopupView__button-bar">
                    {this.state.loadingGDPR && (
                        <>
                            <h4>Loading GDPR</h4>
                            <Loading />
                        </>
                    )}
                    <Button
                        type="outline"
                        onClick={() =>
                            this.props.rejectForm()
                        }
                        disabled={this.state.loadingGDPR}
                    >
                        <span> Reject </span>
                    </Button>
                    <Button
                        type="primary"
                        size="md"
                        disabled={this.state.loadingGDPR}
                        onClick={() => {
                            this.setState({
                                loadingGDPR: false,
                            })
                            this.props.submitForm()
                        }}
                    >
                        <span>Accept</span>
                    </Button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {
                    this.props.openGDPR ?
                        <GDPRPopupView
                            child={this.getPopupContent()}
                            open={this.props.openGDPR}
                        /> : null
                }
            </div>
        )
    }
}

GDPRPopup.propTypes = {
    child: PropTypes.node,
    open: PropTypes.bool.isRequired,
    closePopup: PropTypes.func.isRequired,
}

GDPRPopup.defaultProps = {
    child: <p> Nothing to see here </p>,
}

export default GDPRPopup