import style from './RequestsPage.module.css';
import React, { useState, useEffect } from 'react';

function RequestsCard(props) {
    return (
        <div className={style.requestCard}>
            <div className={style.icon}/>
            <div className={style.text}>
                <div className={style.heading}>Kshitij</div>
                <div className={style.subheading}>9643-099-621</div>
            </div>
        </div>
    );
}

function RequestsPage(props) {
	return (
		<div className={style.card}>
            <RequestsCard/>
		</div>
	);
}

export default RequestsPage;