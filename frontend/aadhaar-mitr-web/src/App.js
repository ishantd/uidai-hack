import './App.css';
import React, { useState, useEffect } from 'react';

import AadhaarPage from './Components/AadhaarPage/AadhaarPage';
import RequestsPage from './Components/RequestsPage/RequestsPage';

function PasscodeOTPPage(props) {
	return (
		<div className="card">
			<input type="text" placeholder="Enter OTP"/>
			<div className="button" onClick={() => props.updatePage('PasscodePage')}>Verify</div>
		</div>
	);
}

function PasscodePage(props) {
	return (
		<div className="card">
			<input type="text" placeholder="Create Passcode"/>
			<div className="button" onClick={() => props.updatePage('RequestsPage')}>Create Passcode</div>
		</div>
	);
}

function App() {
	const [page, setPage] = useState('AadhaarPage');

  	return (
		<div className="page" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', width: '100vw', height: '100vh' }}>
			<div className="card">
				{ 	
					page === 'AadhaarPage' ?
				 	<AadhaarPage updatePage={(page) => setPage(page)}/> :
					page === 'RequestsPage' ?
					<RequestsPage updatePage={(page) => setPage(page)}/> :
					page === 'PasscodePage' ?
					<PasscodePage updatePage={(page) => setPage(page)}/> :
					page === 'PasscodeOTPPage' ?
					<PasscodeOTPPage updatePage={(page) => setPage(page)}/> :
					null
				}
			</div>
		</div>
  	);
}

export default App;
