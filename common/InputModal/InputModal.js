import React, { useState } from 'react'
import "./InputModal.scss"
const InputModal = (props) => {
 
    const close=(e) =>{
        e.preventDefault()
  
        if (props.onClose) {
          props.onClose()
        }
      }
      return (
        <div>
        <div className="modal">
          {props.children}
        </div>
        <div className="bg" onClick={e => close(e)}/>
      </div>
      )
}

export default InputModal