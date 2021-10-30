import style from './AadhaarPage.module.css';
import React, { useState, useEffect } from 'react';

function AadhaarPage(props) {
    const [screen, setScreen] = useState('Aadhaar');

	return (
        screen === 'Aadhaar' ?
		<div className={style.card}>
            <div className={style.heading}>AadhaarMitr</div>
            <div className={style.subheading}>Enter your Aadhaar Number to continue.</div>
            <div className={style.inputDiv}>
                <input className={style.inputBox} type="text" placeholder="Enter Aadhaar Number"/>
			    <button className={style.button} onClick={() => setScreen('OTP')}>
                    <div className={style.buttonText}>Send OTP</div>
                </button>
            </div>
		</div> :
        <div className={style.card}>
            <div className={style.heading}>AadhaarMitr</div>
            <div className={style.subheading}>Enter the OTP you received on your phone.</div>
            <div className={style.inputDiv}>
                <input className={style.inputBox} type="text" placeholder="Enter OTP"/>
                <button className={style.button} onClick={() => props.updatePage('RequestsPage')}>
                    <div className={style.buttonText}>Verify OTP</div>
                </button>
            </div>
        </div>
	);
}

export default AadhaarPage;