import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { pistolSkins } from '../data/pistolSkins';
import { smgSkins } from '../data/smgSkins';
import { rifleSkins } from '../data/rilfeSkins';
import { knifeSkins } from '../data/knifeSkins';
import { heavySkins } from '../data/heavySkins';
import { weapons } from '../data/weapons';
import './skinSearch.css';

function SkinSearchModal({ isOpen, onClose }) {
  const { addSkin, getUserSkins } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [weaponFilter, setWeaponFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const skinCategories = {
    pistols: pistolSkins,
    smgs: smgSkins,
    rifles: rifleSkins,
    knives: knifeSkins,
    heavy: heavySkins,
  };

  // Flatten all skins into a searchable array
  const allSkins = useMemo(() => {
    const skins = [];
    Object.entries(skinCategories).forEach(([category, weaponData]) => {
      Object.entries(weaponData).forEach(([weaponName, skinsData]) => {
        Object.values(skinsData).forEach((skin) => {
          skins.push({
            ...skin,
            category,
            weapon: weaponName,
            market_hash_name: `${weaponName} | ${skin.name}`,
            image_url: skin.img || '/stockGun.png',
            id: `${weaponName}-${skin.name}`,
          });
        });
      });
    });
    return skins;
  }, []);

  // Filter skins based on search query and weapon filter
  const filteredSkins = useMemo(() => {
    return allSkins.filter((skin) => {
      const matchesSearch = skin.market_hash_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesWeapon = !weaponFilter || skin.weapon === weaponFilter;
      return matchesSearch && matchesWeapon;
    });
  }, [searchQuery, weaponFilter, allSkins]);

  const userSkins = getUserSkins();
  const ownedSkinNames = userSkins.map(s => s.market_hash_name);

  const handleAddSkin = (skin) => {
    addSkin({
      market_hash_name: skin.market_hash_name,
      weapon: skin.weapon,
      name: skin.name,
      image_url: skin.image_url,
      category: skin.category,
    });
    setSuccessMessage(`Added ${skin.name}!`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Skins to Your Inventory</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="search-section">
          <input
            type="text"
            placeholder="Search skins by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          
          <select
            value={weaponFilter}
            onChange={(e) => setWeaponFilter(e.target.value)}
            className="weapon-filter"
          >
            <option value="">All Weapons</option>
            <option value="Pistols">Pistols</option>
            <option value="SMGs">SMGs</option>
            <option value="Rifles">Rifles</option>
            <option value="Knives">Knives</option>
            <option value="Heavy">Heavy</option>
          </select>
        </div>

        <div className="skins-grid">
          {filteredSkins.length > 0 ? (
            filteredSkins.map((skin) => (
              <div key={skin.id} className="skin-card">
                <div className="skin-image">
                  <img src={skin.image_url} alt={skin.name} onError={(e) => e.target.src = '/stockGun.png'} />
                </div>
                <div className="skin-info">
                  <h4>{skin.name}</h4>
                  <p className="weapon-name">{skin.weapon}</p>
                  {skin.description && <p className="description">{skin.description}</p>}
                </div>
                <button
                  className={`add-button ${ownedSkinNames.includes(skin.market_hash_name) ? 'owned' : ''}`}
                  onClick={() => handleAddSkin(skin)}
                  disabled={ownedSkinNames.includes(skin.market_hash_name)}
                >
                  {ownedSkinNames.includes(skin.market_hash_name) ? '✓ Owned' : 'Add to Inventory'}
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">No skins found</div>
          )}
        </div>

        <div className="modal-footer">
          <p>Results: {filteredSkins.length} skins</p>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default SkinSearchModal;
