import React from 'react'

function Figma() {
  // Array of filenames exactly as they appear in your folder
  const images = [
    "dkdashboard.png",
    "dklogin.png",
    "mobiledashboard.png",
    "mobilelogin.png",
    "mobilesidebar.png"
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Figma Designs</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {images.map((imgName) => (
          <div key={imgName}>
            <p>{imgName}</p>
            <img 
              src={`/assets/images/${imgName}`} 
              alt={imgName} 
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #ccc' }} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Figma