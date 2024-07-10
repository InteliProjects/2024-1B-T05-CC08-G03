import React from 'react';
import { Handle, Position } from 'reactflow';

interface FunctionNodeProps {
  data: {
    label: string;
    name: string;
    code: string;
    connectingFromAction: boolean;
    figura?: boolean;
    x?: number;
    y?: number;
    cor?: string;
    tamanho?: number;
  };
  isConnectable: boolean;
}

const functionShapes = ['triangulo', 'quadrado', 'hexagono', 'retangulo'];

const FunctionNode: React.FC<FunctionNodeProps> = ({ data, isConnectable }) => {
  return (
    <div style={{ 
        width: 200, 
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
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: data.connectingFromAction ? 170 : 10,
          height: 130,
          top: '50%',
          transform: 'translate(0%, -50%)',
          background: 'transparent',
          border: 'None',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center'
        }} 
        isConnectable={isConnectable}
      >
        <div style={{ width: 6, height: 6, background: 'blue', borderRadius: '50%' }} />
      </Handle>
      <div>{data.name}</div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 40, height: 100, top: '50%', transform: 'translate(0%, -50%)', background: 'transparent', border: 'None', display: 'flex', justifyContent: 'right', alignItems: 'center' }} // Área maior invisível
        isConnectable={isConnectable}
      >
        <div style={{ width: 8, height: 8, background: 'green', borderRadius: '50%' }} />
      </Handle>
    </div>
  );
};

export { FunctionNode, functionShapes };
