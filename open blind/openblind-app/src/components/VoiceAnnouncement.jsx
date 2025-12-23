import React from 'react';

const VoiceAnnouncement = ({ title, text, icon = "campaign" }) => (
  <div className="voice-announcement">
    <div className="voice-announcement-icon">
      <span className="material-icons-round">{icon}</span>
    </div>
    <div className="voice-announcement-text">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  </div>
);

export default VoiceAnnouncement;