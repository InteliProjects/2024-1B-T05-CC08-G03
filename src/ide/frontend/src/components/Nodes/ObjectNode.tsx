import React from 'react';
import { Handle, Position } from 'reactflow';

interface ObjectNodeProps {
    data: {
        label: string;
        name: string;
        code: string;
        connectingFromFunction: boolean;
        image?: string;
        audio?: string;
        x?: number;
        y?: number;
    };
    isConnectable: boolean;
}

const isValidConnection = (connection: any) => {
    const targetNode = connection.targetNode;
    console.log('Target node:', targetNode);
    return targetNode && targetNode.type === 'function';
};

const ObjectNode: React.FC<ObjectNodeProps> = ({ data, isConnectable }) => {
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
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    width: data.connectingFromFunction ? 100 : 10,
                    height: 100,
                    top: '50%',
                    transform: 'translate(0%, -50%)',
                    background: 'transparent',
                    display: 'flex',
                    border: 'None',
                    justifyContent: data.connectingFromFunction ? 'left' : 'center',
                    alignItems: 'center'
                }}
                isValidConnection={isValidConnection}
                isConnectable={isConnectable}
            >
                <div style={{ width: 8, height: 8, background: 'green', borderRadius: '50%' }} />
            </Handle>
            {data.image ? (
                <img src={data.image} alt="Node" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
                <div>{data.name}</div>
            )}
        </div>
    );
};

export { ObjectNode };
