import React from 'react';

const ListItem = ({ icon, iconClass, title, subtitle, meta, actions = ['edit', 'delete'] }) => (
  <div className="item-card">
    <div className={`item-icon ${iconClass}`}>
      <span className="material-icons-round">{icon}</span>
    </div>
    <div className="item-info">
      <h4 className="item-name">{title}</h4>
      <p className="item-detail">{subtitle}</p>
      {meta && <span className="item-meta">{meta}</span>}
    </div>
    <div className="item-actions">
      {actions.includes('call') && <button className="item-btn call"><span className="material-icons-round">call</span></button>}
      {actions.includes('start') && <button className="item-btn start"><span className="material-icons-round">play_arrow</span></button>}
      {actions.includes('edit') && <button className="item-btn edit"><span className="material-icons-round">edit</span></button>}
      {actions.includes('delete') && <button className="item-btn delete"><span className="material-icons-round">delete</span></button>}
    </div>
  </div>
);

export default ListItem;