import React from 'react';

const Header = () => {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px 0 rgba(175, 7, 7, 0.2)',
            height: '60px'
        }}>
            <h1 style={{ color: 'black', textAlign: 'center', margin: '0' }}>Phoenixeer</h1>

            <img src="/logo.jpg" alt="Phoenixeer Logo" style={{ maxHeight: '100%', width: 'auto', marginLeft: '1px' }} />
        </header>
    );
}

export default Header;