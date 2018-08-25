import React from 'react'
import './Hamburger.css'


const Hamburger = (props) => {
    const className = props.active ? 'hamburger hamburger--spring is-active' : 'hamburger hamburger--spring';
    return (
        <div className={className}>
            <div className="hamburger-box">
                <div className="hamburger-inner" />
            </div>
        </div>
    )
};

export default Hamburger
