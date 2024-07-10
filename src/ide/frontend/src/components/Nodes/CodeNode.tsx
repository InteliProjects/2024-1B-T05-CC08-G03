import React from 'react';
import { Handle, Position } from 'reactflow';

interface CodeNodeProps {
  data: {
    label: string;
    name: string;
    code: string;
  };
  isConnectable: boolean;
}

const CodeNode: React.FC<CodeNodeProps> = ({ data, isConnectable }) => {
  return (
    <div style={{ 
        width: 100, 
        height: 100, 
        background: '#D3D3D3', 
        border: '1px solid #000', 
        borderRadius: 5, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        boxShadow: '5px 5px 0 1px rgba(0, 0, 0, 0.7)' 
    }}>
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          width: 35, 
          height: 130, 
          top: '50%', 
          transform: 'translate(40%, -50%)',
          border: 'None',
          background: 'transparent', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }} 
        isConnectable={isConnectable}
      >
      </Handle>
    </div>
  );
};

export { CodeNode };
