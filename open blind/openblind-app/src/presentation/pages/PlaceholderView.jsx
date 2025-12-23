import React from 'react';
import { Header } from '../components/SharedComponents';

const PlaceholderView = ({ title, icon, color, onBack }) => (
    <div className="mobile-container">
        <Header title={title} onBack={onBack} />
        <div style={{height:'80%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color: 'rgba(255,255,255,0.5)'}}>
            <span className="material-icons-round" style={{fontSize:'5rem', color: color, marginBottom:'1rem'}}>{icon}</span>
            <p>Próximamente...</p>
        </div>
    </div>
);

export default PlaceholderView;