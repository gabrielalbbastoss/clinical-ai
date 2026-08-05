import { useEffect, useState } from 'react';

export function App() {
  const [apiMessage, setApiMessage] = useState<string>('Carregando conexão...');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then((res) => res.json())
      .then((data) => setApiMessage(data.message))
      .catch(() => setApiMessage('Erro ao conectar com o Backend!'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ClinicalAI Dashboard</h1>
      <div style={{ 
        padding: '1rem', 
        borderRadius: '8px', 
        backgroundColor: '#e6f4ea', 
        color: '#137333',
        fontWeight: 'bold' 
      }}>
        Status da API: {apiMessage}
      </div>
    </div>
  );
}

export default App;