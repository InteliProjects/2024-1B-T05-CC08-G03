import React from 'react';
import { Handle, Position } from 'reactflow';

interface ActionNodeProps {
  data: {
    label: string;
    name: string;
    code: string;
    image?: string;
  };
}

const ActionNode: React.FC<ActionNodeProps> = ({ data }) => {
  return (
    <div style={{ 
        width: 100, 
        height: 100, 
        background: 'rgba(217, 217, 217, 50)', 
        border: '1px solid #000', 
        borderRadius: 5, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        boxShadow: '5px 5px 0 1px rgba(0, 0, 0, 0.6)' // Adiciona sombra ao nó
    }}>
      {data.image ? (
        <img src={data.image} alt={data.name} style={{ maxWidth: '90%', maxHeight: '90%' }} />
      ) : (
        <div>{data.name}</div>
      )}
    </div>
  );
};

export { ActionNode };
