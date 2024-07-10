'use client'

import React from 'react';
import { ActionNode } from './SideBarNodes/ActionNode';
import { FunctionNode } from './SideBarNodes/FunctionNode';
import { ObjectNode } from './SideBarNodes/ObjectNode';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CodeNode } from './SideBarNodes/CodeNode';

const nodesList = [
  { type: 'action', name: 'Quadrante1', code: '', image: 'cloud.png' },
  { type: 'action', name: 'Quadrante2', code: '', image: 'circle.png' },
  { type: 'action', name: 'Quadrante3', code: '', image: 'triangle.png' },
  { type: 'action', name: 'Quadrante4', code: '', image: 'heart.png' },
  { type: 'action', name: 'Quadrante5', code: '', image: 'moon.png' },
  { type: 'action', name: 'Quadrante6', code: '', image: 'square.png' },
  { type: 'action', name: 'Quadrante7', code: '', image: 'rhombus.png' },
  { type: 'action', name: 'Quadrante8', code: '', image: 'hexa.png' },
  { type: 'action', name: 'Quadrante9', code: '', image: 'star.png' },
  { type: 'function', name: 'Mover para Esquerda', code: 'mover(?, -3, 0);'},
  { type: 'function', name: 'Mover para Direita', code: 'mover(?, 3, 0);'},
  { type: 'function', name: 'Mover para Cima', code: 'mover(?, 0, 3);'},
  { type: 'function', name: 'Mover para Baixo', code: 'mover(?, 0, -3);'},
  { type: 'function', name: 'Tocar Som', code: 'tocar(!);' },
  { type: 'function', name: 'triangulo', code: '' },
  { type: 'function', name: 'quadrado', code: '' },
  { type: 'function', name: 'hexagono', code: '' },
  { type: 'function', name: 'retangulo', code: '' },
  { type: 'function', name: 'background', code: 'inicializar_com_imagem(!)' },
  { type: 'object', name: 'objeto', code: '', image: 'objectImage', image2: 'objectImage2' },
  { type: 'codeNode', name: 'codigo', code: '' }
];

const Sidebar = ({ onBlockClick }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, node: { type: string; name: string; code: string; image?: undefined; image2?: undefined; } | { type: string; name: string; code: string; image: string; image2: string; }) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>, node: { type: string; name: string; code: string; image?: undefined; image2?: undefined; } | { type: string; name: string; code: string; image: string; image2: string; }) => {
    if (event.key === 'KeyD') {
      onBlockClick(node);
      event.preventDefault();
    }
  };

  const renderNode = (node: { type: string; name: string; code: string; image?: undefined; image2?: undefined; } | { type: string; name: string; code: string; image: string; image2: string; }) => {
    switch (node.type) {
      case 'action':
        return <ActionNode data={{ name: node.name, label: node.type, code: node.code, image: node.image }} />;
      case 'function':
        return <FunctionNode data={{ name: node.name, label: node.type, code: node.code }} />;
      case 'object':
        return <ObjectNode data={{ name: node.name, label: node.type, code: node.code }} />;
      case 'code':
        return <CodeNode data={{ name: node.name, label: node.type, code: node.code }} isConnectable={false} />;
      default:
        return null;
    }
  };

  const renderNodesByType = (type: string) => {
    return nodesList.filter(node => node.type === type).map((node, index) => (
      <div
        key={index}
        className={`dndnode ${node.type}`}
        onDragStart={(event) => onDragStart(event, node)}
        draggable
        tabIndex={0}
        role="button"
        aria-label={`Drag ${node.type} node: ${node.name}`}
        onKeyPress={(event) => handleKeyPress(event, node)}
        onClick={() => onBlockClick(node)}
      >
        {renderNode(node)}
      </div>
    ));
  };

  return (
    <aside className="sidebar">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="actions-content" id="actions-header">
          Botões
        </AccordionSummary>
        <AccordionDetails id="actions-content">
          {renderNodesByType('action')}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="functions-content" id="functions-header">
          Ações
        </AccordionSummary>
        <AccordionDetails id="functions-content">
          {renderNodesByType('function')}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="object-content" id="object-header">
          Objeto
        </AccordionSummary>
        <AccordionDetails id="object-content">
          {renderNodesByType('object')}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="object-content" id="object-header">
          Importar Código
        </AccordionSummary>
        <AccordionDetails id="codeNode-content">
          {renderNodesByType('codeNode')}
        </AccordionDetails>
      </Accordion>
    </aside>
  );
};

export { Sidebar };
