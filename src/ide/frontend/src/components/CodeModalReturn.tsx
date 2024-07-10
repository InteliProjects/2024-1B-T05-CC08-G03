// import React from 'react';

// // Interface para definir as props do modal, ó pai
// interface ModalProps {
//   isOpen: boolean; // se o modal tá aberto, visse?
//   onClose: () => void; // função pra fechar o modal
//   text: { tipo: string; valor: string; linha: string }[]; // array de objetos com tipo, expressão e linha
// }

// // Componente funcional CodeModalReturn, bora lá ver
// const CodeModalReturn: React.FC<ModalProps> = ({ isOpen, onClose, text }) => {
//   // Se o modal não tiver aberto, nem mostra nada
//   if (!isOpen) return null;


//   return (
//     // Div principal que cobre a tela toda quando o modal tá aberto
//     <div style={{
//       position: 'fixed', // Fixo na tela, pra não mexer não
//       top: 0,
//       left: 0,
//       width: '100%', // Pega a largura toda, viu?
//       height: '100%', // E a altura também
//       backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor de fundo com uma transparência preta
//       display: 'flex', // Usa flexbox pra centralizar
//       justifyContent: 'center', // Centraliza horizontalmente
//       alignItems: 'center', // E verticalmente também
//       zIndex: 1000 // Fica no topo de tudo
//     }}>
//       {/* Div que contém o conteúdo do modal */}
//       <div style={{
//         backgroundColor: '#FFFFFF', // Fundo branco pra destacar
//         padding: '20px', // Um espaçinho bom
//         width: '80%', // Usa 80% da largura
//         maxWidth: '600px', // Mas não passa de 600px
//         height: '80%', // Altura do conteúdo dentro do modal
//         overflowY: 'auto', // Adiciona uma barra de rolagem se precisar
//         borderRadius: '10px', // Bordas arredondadas pra ficar estiloso
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Uma sombrinha pra dar um charme
//       }}>
//         {/* Título do modal */}
//         <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Resultado da Compilação</h2>
//         {/* Tabela pra organizar os dados */}
//         <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', borderRadius: '5px' }}>
//           <thead>
//             <tr>
//               {/* Cabeçalho da tabela */}
//               <th style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid black' }}>Tipo</th>
//               <th style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid black' }}>Expressão</th>
//               <th style={{ textAlign: 'left', padding: '10px' }}>Linha</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Mapeamento dos dados passados pra tabela */}
//             {text.map((item, index) => (
//               <tr key={index}>
//                 <td style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid black' }}>{item.tipo}</td>
//                 <td style={{ textAlign: 'left', padding: '10px', borderRight: '1px solid black' }}>{item.valor}</td>
//                 <td style={{ textAlign: 'left', padding: '10px' }}>{item.linha}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* Botão pra fechar o modal */}
//         <button 
//           onClick={onClose} 
//           style={{ 
//             marginTop: '20px',
//             padding: '10px 20px',
//             backgroundColor: '#4CAF50', // Um verde bonito aqui, viu?
//             color: '#FFFFFF', // Letra branca pra destacar
//             border: 'none', // Sem borda
//             borderRadius: '5px', // Arredondado também
//             cursor: 'pointer', // Muda o cursor pra mãozinha
//             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Outra sombrinha aqui
//             transition: 'background-color 0.3s ease', // Efeito suave ao mudar cor
//           }}
//         >
//           Voltar
//         </button>
//       </div>
//     </div>
//   );
// };

// // Exporta o componente pra poder usar em outros lugares da aplicação
// export { CodeModalReturn };


import React from 'react';

// Interface para definir as props do modal, ó pai
interface ModalProps {
  isOpen: boolean; // se o modal tá aberto, visse?
  onClose: () => void; // função pra fechar o modal
  text: string; // array de objetos com tipo, expressão e linha
}

// Componente funcional CodeModalReturn, bora lá ver
const CodeModalReturn: React.FC<ModalProps> = ({ isOpen, onClose, text }) => {
  // Se o modal não tiver aberto, nem mostra nada
  if (!isOpen) return null;


  return (
    // Div principal que cobre a tela toda quando o modal tá aberto
    <div style={{
      position: 'fixed', // Fixo na tela, pra não mexer não
      top: 0,
      left: 0,
      width: '100%', // Pega a largura toda, viu?
      height: '100%', // E a altura também
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor de fundo com uma transparência preta
      display: 'flex', // Usa flexbox pra centralizar
      justifyContent: 'center', // Centraliza horizontalmente
      alignItems: 'center', // E verticalmente também
      zIndex: 1000 // Fica no topo de tudo
    }}>
      {/* Div que contém o conteúdo do modal */}
      <div style={{
        backgroundColor: '#FFFFFF', // Fundo branco pra destacar
        padding: '20px', // Um espaçinho bom
        width: '80%', // Usa 80% da largura
        maxWidth: '600px', // Mas não passa de 600px
        height: '80%', // Altura do conteúdo dentro do modal
        overflowY: 'auto', // Adiciona uma barra de rolagem se precisar
        borderRadius: '10px', // Bordas arredondadas pra ficar estiloso
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Uma sombrinha pra dar um charme
      }}>
        {/* Título do modal */}
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Resultado da Compilação</h2>
        {/* Tabela pra organizar os dados */}
        {text}
        {/* Botão pra fechar o modal */}
        <button 
          onClick={onClose} 
          style={{ 
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50', // Um verde bonito aqui, viu?
            color: '#FFFFFF', // Letra branca pra destacar
            border: 'none', // Sem borda
            borderRadius: '5px', // Arredondado também
            cursor: 'pointer', // Muda o cursor pra mãozinha
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Outra sombrinha aqui
            transition: 'background-color 0.3s ease', // Efeito suave ao mudar cor
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

// Exporta o componente pra poder usar em outros lugares da aplicação
export { CodeModalReturn };




