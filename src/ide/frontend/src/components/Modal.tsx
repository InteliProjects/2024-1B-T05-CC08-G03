import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { functionShapes } from './Nodes/FunctionNode';

interface NodeData {
  name: any;
  label: string;
  image?: string;
  image2?: string;
  audio?: string;
  code: string;
  x?: number;
  y?: number;
  cor?: string;
  tamanho?: number;
  deslocamentoX?: number;
  deslocamentoY?: number;
}

interface ModalProps {
  node: {
    id: string;
    type: string;
    data: NodeData;
  };
  onClose: () => void;
  onSubmit: (nodeId: string, newData: NodeData) => void;
  onDelete: (nodeId: string) => void;
}

const Modal: React.FC<ModalProps> = ({ node, onClose, onSubmit, onDelete }) => {
  const [newData, setNewData] = useState<NodeData>(node.data);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (file.type.startsWith('image/') || file.type.startsWith('audio/')) {
          if (event.target?.result) {
            if (file.type.startsWith('image/')) {
              setNewData({ ...newData, image: event.target.result as string, image2: file.name as string });
            } else if (file.type.startsWith('audio/')) {
              setNewData({ ...newData, audio: file.name as string });
            }

            const formData = new FormData();
            formData.append('profile-file', file);

            try {
              const response = await fetch('http://localhost:3004/profile-upload-single', {
                method: 'POST',
                body: formData
              });

              if (response.ok) {
                console.log('File uploaded successfully');
              }
            } catch (error) {
              console.error('Error uploading file:', error);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(node.id, newData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Nodo</h2>
          <button className="close-button" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {node.type === 'object' ? (
            <>
              <label className="file-input-label">
                Imagem:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <label className="file-input-label">
                Áudio:
                <br />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
              </label>
              {newData.audio && (
                <div style={{ marginBottom: '15px', color: 'green' }}>
                  Áudio carregado: {newData.audio}
                </div>
              )}
              <label>
                Posição X:
                <input
                  type="number"
                  value={newData.x || ''}
                  onChange={(e) => setNewData({ ...newData, x: parseFloat(e.target.value) })}
                  className="input-field"
                />
              </label>
              <label>
                Posição Y:
                <input
                  type="number"
                  value={newData.y || ''}
                  onChange={(e) => setNewData({ ...newData, y: parseFloat(e.target.value) })}
                  className="input-field"
                />
              </label>
            </>
          ) : node.type === 'codeNode' ? (
            <>
              <label>
                Código:
                <textarea
                  value={newData.code}
                  onChange={(e) => setNewData({ ...newData, code: e.target.value })}
                  className="textarea-field"
                />
              </label>
            </>
          ) : (<div></div>)}
          <div className="modal-footer">
            <button type="button" className="delete-button" onClick={handleDelete}>
              Deletar
            </button>
            <button type="submit" className="save-button">
              Salvar
            </button>
          </div>
        </form>
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
          padding: 20px;
          border-radius: 8px;
          width: 400px;
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
        .file-input-label {
          display: block;
          margin-bottom: 15px;
        }
        .input-field {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .textarea-field {
          width: 100%;
          padding: 5px;
          margin-top: 5px;
          maring-right: 5px;
          border: 2px solid #ccc;
          border-radius: 4px;
          resize: none;
          height: 100px;
          overflow-y: auto;
        }
        .modal-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .save-button, .delete-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .save-button {
          background-color: #4CAF50;
          color: white;
        }
        .delete-button {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Modal;
