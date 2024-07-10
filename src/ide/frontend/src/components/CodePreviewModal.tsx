import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

interface CodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onSave: (newCode: string) => void;
}

const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ isOpen, onClose, code, onSave }) => {
  const [editedCode, setEditedCode] = useState(code);

  useEffect(() => {
    setEditedCode(code);
  }, [code]);

  const handleSave = () => {
    onSave(editedCode);
    onClose();
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Preview de Código</h2>
          <button className="close-button" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <textarea
          value={editedCode}
          onChange={(e) => setEditedCode(e.target.value)}
          rows={20}
          style={{ width: '100%', height: '500px', fontFamily: 'monospace', fontSize: '14px', overflow: 'auto', resize: 'none' }} // Adicionado resize: 'none'
        />
        <div className="modal-footer">
          <button className="save-button" onClick={handleSave}>Salvar</button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 600px;
          max-width: 90%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
        }
        .save-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          height: 300px;
          font-family: monospace;
          font-size: 14px;
          overflow: auto;
          resize: none;
        }
      `}</style>
    </div>
  ) : null;
};

export default CodePreviewModal;
