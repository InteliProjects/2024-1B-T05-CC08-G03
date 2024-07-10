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
      padding: 10,
      background: '#f9bef9', 
      border: '2px solid #222', 
      borderRadius: 8, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      flexDirection: 'column',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.15)', 
      width: 150,
      minHeight: 50,
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 100 }}>{data.label}</div>
      <div style={{ fontSize: '0.85em', color: '#555' }}>{data.name}</div>
    </div>
  );
};

export { CodeNode };
