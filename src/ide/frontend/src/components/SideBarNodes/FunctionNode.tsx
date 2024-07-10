import React from 'react';
import { Handle, Position } from 'reactflow';

interface FunctionNodeProps {
  data: {
    label: string;
    name: string;
    code: string;
  };
}

const FunctionNode: React.FC<FunctionNodeProps> = ({ data }) => {
  return (
    <div style={{ 
        width: 150, 
        height: 75, 
        background: '#FFD700', 
        border: '1px solid #000', 
        borderRadius: 5, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column',
        boxShadow: '5px 5px 0 1px rgba(0, 0, 0, 0.7)' // Adiciona sombra ao nó
    }}>
      <div>{data.name}</div>
    </div>
  );
};

export { FunctionNode };
