'use client'

import Navbar from '@/components/navbar';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaCode, FaExclamation, FaPlay, FaTimes, FaTrash } from 'react-icons/fa';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  NodeMouseHandler,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sidebar } from '../components/Sidebar';
import './index.css';
import Modal from '@/components/Modal';
import Landing from '@/pages/landing';
import CodePreviewModal from '../components/CodePreviewModal';
import { ModalReturn } from '../components/ModalReturn';
import { ActionNode } from '../components/Nodes/ActionNode';
import { FunctionNode } from '../components/Nodes/FunctionNode';
import { ObjectNode } from '../components/Nodes/ObjectNode';
import './index.css';
import { gerador } from '@/api/submitCode';

let id = 0;
const getId = () => `dndnode_${id++}`;
const path = '';

const nodeTypes = {
  action: (nodeProps) => (
    <div style={{ position: 'relative' }}>
      {nodeProps.data.showDeleteIcon && (
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', color: 'red', fontSize: '15px', zIndex: 0 }}>
          <FaTimes />
        </div>
      )}
      <ActionNode {...nodeProps} />
    </div>
  ),
  function: (nodeProps) => (
    <div style={{ position: 'relative' }}>
      {nodeProps.data.showDeleteIcon && (
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', color: 'red', fontSize: '15px', zIndex: 10 }}>
          <FaTimes />
        </div>
      )}
      <FunctionNode {...nodeProps} />
    </div>
  ),
  object: (nodeProps) => (
    <div style={{ position: 'relative' }}>
      {nodeProps.data.showDeleteIcon && (
        <div style={{ position: 'absolute', top: 'px', right: '0px', color: 'red', fontSize: '15px', zIndex: 10 }}>
          <FaTimes />
        </div>
      )}
      <ObjectNode {...nodeProps} />
    </div>
  ),
};

const DnDFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [landing, setLanding] = useState(true);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<null | any>(null); // Permitir nulo ou nó
  const [selectedEdge, setSelectedEdge] = useState<null | Edge>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isModalReturnOpen, setIsModalReturnOpen] = useState(false);
  const [codeResultString, setCodeResultString] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [combinedCode, setCombinedCode] = useState('');
  const [isCodePreviewModalOpen, setIsCodePreviewModalOpen] = useState(false);
  const [codePreview, setCodePreview] = useState('');
  const [editedCode, setEditedCode] = useState(''); // Novo estado para armazenar o código editado
  const [selectedBlock, setSelectedBlock] = useState(null);

  const [removingNode, setRemovingNode] = useState(false);
  const [connectingFromFunction, setConnectingFromFunction] = useState(false);
  const [connectingFromAction, setConnectingFromAction] = useState(false);

  const trashRef = useRef<HTMLDivElement>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [boardBackground, setBoardBackground] = useState('white');
  const functionShapes = ['triangulo', 'quadrado', 'circulo', 'hexagono'];

  const onClickDelete = () => {
    setRemovingNode((prev) => !prev);
    setIsOverTrash((prev) => !prev);
    setBoardBackground((prev) => (prev === 'white' ? 'gray' : 'white'));
  };
  const onNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const onNodeDragStop: NodeMouseHandler = (_, node) => {
    if (removingNode) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      return;
    }
    if (node.type === 'object' || node.type === 'codeNode') { // Verifica também se o tipo é "code"
      setSelectedNode(node);
      setIsModalOpen(true);
    }
  };

  const deleteSelectedEdge = (_, edge) => {
    if (removingNode) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  };

  const onConnectStart = (_, { nodeId, handleType }) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node && node.type === 'function') {
      setConnectingFromFunction(true);
    }
    if (node && node.type === 'action') {
      setConnectingFromAction(true);
    }
  };

  const onConnectEnd = () => {
    setConnectingFromFunction(false);
    setConnectingFromAction(false);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      if (isValidConnection(params)) {
        setEdges((eds) => addEdge({ ...params, animated: true }, eds));
      } else {
        console.error('Conexão inválida');
      }
    },
    [nodes, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        console.error('ReactFlow not initialized or wrapper not found.');
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeDataString = event.dataTransfer.getData('application/reactflow');
      const nodeData = JSON.parse(nodeDataString);

      if (typeof nodeData === 'undefined' || !nodeData) {
        console.error('Node data is undefined ou empty.');
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type: nodeData.type,
        position,
        data: {
          label: `${nodeData.type}`,
          name: nodeData.name,
          code: nodeData.code,
          showDeleteIcon: removingNode,
          figura: nodeData.figura || false,
          image: nodeData.image || null,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, removingNode]
  );


  const updateNodeText = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
    );
    setIsModalOpen(false);
  };

  const onButtonClickSubmitcode = async () => {
    try {
      const code = editedCode || generateCode(); // Use o código editado se disponível
      const zipBlob = await gerador(code);

      const formData = new FormData();
      formData.append('zip-file', new File([zipBlob], 'projeto.zip'));

      const response = await axios.post('http://localhost:3003/upload-zip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setCodeResultString(response.data.message);
      } else {
        setCodeResultString('Falha ao fazer o upload do arquivo.');
      }
      setIsCodeModalOpen(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsModalReturnOpen(false);
    }
  };

  const onPlayButtonClick = async () => {
    await onButtonClickSubmitcode();
    setTimeout(() => {
      window.location.href = 'http://localhost:8081';
    }, 2000); 
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };


  const isValidConnection = (connection: any) => {
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (sourceNode && targetNode) {
      console.log(sourceNode)
      console.log(targetNode)
      if ((sourceNode.type === 'action') && (targetNode.type === 'function' && targetNode.data.name === 'background')) {
        console.log("Nao esotu aqui")
        return false;
      }
      if ((sourceNode.type === 'function' && sourceNode.data.name === 'background') && (targetNode.type === 'action')) {
        return false;
      }
      if ((sourceNode.type === 'action') && (targetNode.type === 'object')) {
        return false;
      }
      if ((sourceNode.type === 'object') && (targetNode.type === 'action')) {
        return false;
      }
      if (sourceNode.type === 'codeNode' || targetNode.type === 'codeNode') {
        return false;
      }
    }
    return true;
  };

  const generateCode = () => {
    const codeNode = nodes.find((node) => node.type === 'codeNode');
  
    if (codeNode) {
      return codeNode.data.code;
    }
  
    const presetCode = 'programa "Dinâmica do jogo"\nvar\n';
    let i = 0;
  
    let variableDeclarations = nodes
      .filter((node) => node.type === 'object')
      .map((node) => `numero objeto${i++};`)
      .join('\n');
  
    variableDeclarations += '\nnumero quadrante;\n';
  
    i = 0;
  
    const declaringVariables = nodes
      .filter((node) => node.type === 'object')
      .map((node) => {
        const funcNode = edges.find((e) => e.target === node.id && nodes.find((n) => n.id === e.source)?.type === 'function');
        const funcNodeData = funcNode ? nodes.find((n) => n.id === funcNode.source) : null;
  
        if (funcNodeData && funcNodeData.data.name.toLowerCase() !== 'background') {
          if (functionShapes.includes(funcNodeData.data.name.toLowerCase())) {
            return `objeto${i++}: criar_figura("${funcNodeData.data.name.toLowerCase()}", "${funcNodeData.data.cor}", ${funcNodeData.data.x}, ${funcNodeData.data.y}, ${funcNodeData.data.tamanho});`;
          } else if (funcNodeData.data.name.toLowerCase() === 'mover' || funcNodeData.data.name.toLowerCase() !== 'tocar som') {
            return `objeto${i++}: criar_imagem("${path}${node.data.image2}", ${node.data.x}, ${node.data.y});`;
          }
        }
      })
      .filter(Boolean) // Filtra os valores undefined
      .join('\n');
  
    const readQuadrant = 'quadrante: consultar();\n';
  
    const loopReading = 'enquanto(v)';
  
    let ifs = '';
    const actionsMap: Record<string, string[]> = {};
  
    let backgroundInitialization = '';
  
    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
  
      if (sourceNode && targetNode && sourceNode.type === 'action' && targetNode.type === 'function') {
        const objectEdge = edges.find((e) => e.source === targetNode.id && nodes.find((n) => n.id === e.target)?.type === 'object');
        const objectNode = objectEdge ? nodes.find((n) => n.id === objectEdge.target) : null;
  
        if (objectNode) {
          const objectIndex = nodes.filter((n) => n.type === 'object').indexOf(objectNode);
  
          let updatedCode = targetNode.data.code.replace('?', `objeto${objectIndex}`);
          if (targetNode.data.name.toLowerCase() === 'background') {
            const backgroundFileName = objectNode.data.image2; // Use o arquivo de imagem associado ao objeto
            backgroundInitialization = `inicializar_com_imagem("${path}${backgroundFileName}");`;
          } else if (targetNode.data.name.toLowerCase() === 'tocar som') {
            const audioFileName = objectNode.data.audio;
            updatedCode = updatedCode.replace('!', `"${path}${audioFileName}"`);
          }
          const actionIndex = sourceNode.data.name.match(/\d+/)?.[0];
  
          if (!actionsMap[actionIndex!]) {
            actionsMap[actionIndex!] = [];
          }
  
          actionsMap[actionIndex!].push(updatedCode);
        }
      } else if (sourceNode && sourceNode.type === 'function' && sourceNode.data.name.toLowerCase() === 'background') {
        const objectEdge = edges.find((e) => e.source === sourceNode.id && nodes.find((n) => n.id === e.target)?.type === 'object');
        const objectNode = objectEdge ? nodes.find((n) => n.id === objectEdge.target) : null;
  
        if (objectNode) {
          const backgroundFileName = objectNode.data.image2; // Use o arquivo de imagem associado ao objeto
          backgroundInitialization = `inicializar_com_imagem("${path}${backgroundFileName}");`;
        }
      }
    });
  
    Object.keys(actionsMap).forEach((actionIndex) => {
      ifs += `se (quadrante = ${actionIndex}) {\n`;
      actionsMap[actionIndex].forEach((action) => {
        ifs += `${action}\n`;
      });
      ifs += `}\n`;
    });
  
    return `${presetCode}${variableDeclarations}\n{\n${declaringVariables}\n${backgroundInitialization}\n${loopReading}{\n${readQuadrant}\n${ifs}}\n\n}`;
  };
  
  const openCodePreviewModal = () => {
    const code = editedCode || generateCode(); // Use o código editado se disponível
    console.log(code);
    setCodePreview(code);
    setIsCodePreviewModalOpen(true);
  };

  const handleBlockClick = (block: React.SetStateAction<null>) => {
    setSelectedBlock(block);
  };

  const addBlockToCanvas = (block: any) => {
    if (!reactFlowWrapper.current || !reactFlowInstance) {
      console.error('ReactFlow not initialized or wrapper not found.');
      return;
    }

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: reactFlowBounds.width / 2,
      y: reactFlowBounds.height / 2,
    });

    const newNode = {
      id: getId(),
      type: block.type,
      position,
      data: {
        label: `${block.type}`,
        name: block.name,
        code: block.code,
        figura: block.figura || false,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.code === 'Enter' || event.code === 'Space') && selectedBlock) {
        addBlockToCanvas(selectedBlock);
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBlock]);

  return (
    <div > 
      {landing
      ?
      (<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
          <Navbar/>
        </div>
        <div style={{ marginTop: '60px' }}> {/* Ajuste o valor de marginTop conforme a altura da Navbar */}
          <Landing setLanding={setLanding}/>
        </div>
      </div>)
      :
      (
        <div className={`dndflow`} onMouseMove={onMouseMove} aria-label="Diagrama de código" role="button">

          <Sidebar onBlockClick={handleBlockClick} />
          <div className="reactflow-wrapper" ref={reactFlowWrapper} aria-label="React Flow Container" role="button">
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  showDeleteIcon: removingNode,
                  connectingFromFunction,
                  connectingFromAction,
                },
                style: {},
              }))}
              edges={edges.map((edge) => ({
                ...edge,
                animated: true,
                style: removingNode ? { stroke: 'red' } : { stroke: '#222' },
              }))}
              onNodesChange={onNodesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStop={onNodeDragStop}
              onEdgeClick={deleteSelectedEdge}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
              isValidConnection={isValidConnection}
              nodeTypes={nodeTypes}
            >
              <Controls />
              <MiniMap />
              <Background gap={12} size={1} />
            </ReactFlow>
    
            <div
              ref={trashRef}
              aria-label="Botão de deletar nodo" role="button"
              style={{
                position: 'absolute',
                right: '10%',
                top: '5%',
                zIndex: 1000,
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onClick={onClickDelete}
            >
              {isOverTrash ? <FaExclamation /> : <FaTrash />}
            </div>
    
            <button
              style={{
                position: 'absolute',
                right: '5%',
                top: '5%',
                zIndex: 1000,
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onClick={onPlayButtonClick}
            >
              <FaPlay />
            </button>
            <button
              style={{
                position: 'absolute',
                right: '15%',
                top: '5%',
                zIndex: 1000,
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onClick={openCodePreviewModal}
            >
              <FaCode />
            </button>
          </div>
          {isModalOpen && selectedNode && (
            <Modal
              node={selectedNode}
              onClose={() => setIsModalOpen(false)}
              onSubmit={updateNodeText}
              onDelete={(nodeId) => {
                setNodes((nds) => nds.filter((node) => node.id !== nodeId));
                setIsModalOpen(false);
              }}
            />
          )}
          {isModalReturnOpen && (
            <ModalReturn
              isOpen={isModalReturnOpen}
              onClose={() => setIsModalReturnOpen(false)}
              submitCode={onButtonClickSubmitcode}
            />
          )}
          {isCodeModalOpen && (
            <CodeModalReturn
              isOpen={isCodeModalOpen}
              onClose={() => setIsCodeModalOpen(false)}
              text={codeResultString}
            />
          )}
          <CodePreviewModal
            isOpen={isCodePreviewModalOpen}
            onClose={() => setIsCodePreviewModalOpen(false)}
            code={codePreview}
            onSave={(newCode) => {
              setCodePreview(newCode);
              setEditedCode(newCode); // Salvar o novo código editado
            }}
          />
        </div>
      )}
    </div>
      
  );
};

export default DnDFlow;
