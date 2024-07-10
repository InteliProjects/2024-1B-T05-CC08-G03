import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitCode: any;
}

const ModalReturn: React.FC<ModalProps> = ({ isOpen, onClose, submitCode }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '20px',
        width: '350px', 
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Confirmar Compilação</h2>
        <p style={{ marginBottom: '20px' }}>Tem certeza de que deseja compilar o código?</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={submitCode} 
            style={{ 
              marginRight: '10px', 
              padding: '10px 20px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}>
            Compilar
          </button>
          <button 
            onClick={onClose} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer'
            }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export { ModalReturn };
