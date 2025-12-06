import React from 'react'

interface WarningModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function WarningModal({ onConfirm, onCancel }: WarningModalProps) {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(8px)'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#1a0505',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        border: '2px solid #ff4444',
        color: '#e0e0e0',
        boxShadow: '0 0 50px rgba(255, 68, 68, 0.2)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#ff4444', marginTop: 0, fontSize: '1.8rem' }}>⚠️ Volume Warning</h2>
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: '1.5rem 0' }}>
          This application generates <strong>raw audio waveforms</strong> which can be loud and sharp.
        </p>
        
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          Please lower your volume before proceeding to protect your hearing and equipment.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={onCancel}
            className="btn"
            style={{
              padding: '0.8rem 2rem',
              border: '1px solid #555',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn"
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#ff4444',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            I Understand, Start Audio
          </button>
        </div>
      </div>
    </div>
  )
}
