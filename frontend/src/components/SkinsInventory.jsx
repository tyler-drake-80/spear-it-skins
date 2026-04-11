import React from 'react';
import { useAuth } from '../context/AuthContext';
import './skinsInventory.css';

function SkinsInventory({ onOpenSearch }) {
  const { getUserSkins, removeSkin } = useAuth();
  const userSkins = getUserSkins();

  const handleRemove = (market_hash_name) => {
    if (window.confirm(`Remove this skin from your inventory?`)) {
      removeSkin(market_hash_name);
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h3>Your Skins Collection</h3>
        <button className="btn btn-primary" onClick={onOpenSearch}>
          + Add Skins
        </button>
      </div>

      {userSkins.length === 0 ? (
        <div className="empty-inventory">
          <p>You haven't added any skins yet!</p>
          <button className="btn btn-primary" onClick={onOpenSearch}>
            Start Adding Skins
          </button>
        </div>
      ) : (
        <div className="inventory-stats">
          <p>Total Skins: <strong>{userSkins.length}</strong></p>
        </div>
      )}

      <div className="inventory-grid">
        {userSkins.map((skin) => (
          <div key={skin.market_hash_name} className="inventory-skin-card">
            <div className="inventory-skin-image">
              <img 
                src={skin.image_url || '/stockGun.png'} 
                alt={skin.name}
                onError={(e) => e.target.src = '/stockGun.png'}
              />
            </div>
            <div className="inventory-skin-info">
              <h4>{skin.name}</h4>
              <p className="weapon-badge">{skin.weapon}</p>
              <p className="category-text">Category: {skin.category}</p>
              <p className="added-date">
                Added: {new Date(skin.addedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className="remove-button"
              onClick={() => handleRemove(skin.market_hash_name)}
              title="Remove from inventory"
            >
              ✕ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkinsInventory;
