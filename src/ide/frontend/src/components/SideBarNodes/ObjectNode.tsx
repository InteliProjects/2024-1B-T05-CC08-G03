import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ObjectNodeProps {
    data: {
        label: string;
        name: string;
        code: string;
      };
}

const isValidConnection = (connection: any) => {
    const targetNode = connection.targetNode;
    console.log('Target node:', targetNode);
    return targetNode && targetNode.type === 'function';
};

const ObjectNode: React.FC<ObjectNodeProps> = ({ data }) => {
    return (
        <div style={{ 
            width: 100, 
            height: 100, 
            background: '#ADD8E6', 
            border: '1px solid #000', 
            borderRadius: '50%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'relative',
            boxShadow: '5px 5px 0 1px rgba(0, 0, 0, 0.7)' // Adiciona sombra ao nó
        }}>
            <div>{data.name}</div>
        </div>
    );
};

export { ObjectNode };
