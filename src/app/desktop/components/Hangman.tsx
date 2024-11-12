import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Alert, Space, Layout } from 'antd';

const { Title, Text } = Typography;
const { Content } = Layout;

const Hangman = () => {
  const [palabra, setPalabra] = useState('');
  const [palabras, setPalabras] = useState<string[]>([]);
  const [letrasAdivinadas, setLetrasAdivinadas] = useState(new Set<string>());
  const [intentosRestantes, setIntentosRestantes] = useState(6);
  const [gameStatus, setGameStatus] = useState<'jugando' | 'ganado' | 'perdido'>('jugando');
  const [loading, setLoading] = useState(true);

  const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  const fetchPalabras = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=10');
      const data = await response.json();
      // Convert words to uppercase for consistency
      setPalabras(data.map((word: string) => word.toUpperCase()));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
      // Fallback words in case the API fails
      setPalabras(['JAVASCRIPT', 'REACT', 'TYPESCRIPT', 'PROGRAMMING']);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPalabras();
  }, []);

  const iniciarJuego = () => {
    if (palabras.length === 0) {
      fetchPalabras();
      return;
    }
    const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
    setPalabra(palabraAleatoria);
    setLetrasAdivinadas(new Set());
    setIntentosRestantes(6);
    setGameStatus('jugando');
  };

  useEffect(() => {
    if (palabras.length > 0 && !palabra) {
      iniciarJuego();
    }
  }, [palabras]);

  const verificarLetra = (letra: string) => {
    if (gameStatus !== 'jugando') return;

    const nuevasLetrasAdivinadas = new Set(letrasAdivinadas);
    nuevasLetrasAdivinadas.add(letra);
    setLetrasAdivinadas(nuevasLetrasAdivinadas);

    if (!palabra.includes(letra)) {
      setIntentosRestantes(prev => prev - 1);
    }

    // Verificar victoria
    const todasLetrasAdivinadas = palabra.split('').every(letra => nuevasLetrasAdivinadas.has(letra));
    if (todasLetrasAdivinadas) {
      setGameStatus('ganado');
    }

    // Verificar derrota
    if (intentosRestantes <= 1 && !palabra.includes(letra)) {
      setGameStatus('perdido');
    }
  };

  const palabraMostrada = palabra.split('').map(letra =>
    letrasAdivinadas.has(letra) ? letra : '_'
  ).join(' ');

  const dibujarHangman = () => {
    const partes = [
      <circle key="head" cx="50" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="2" />,
      <line key="body" x1="50" y1="35" x2="50" y2="70" stroke="currentColor" strokeWidth="2" />,
      <line key="leftArm" x1="50" y1="50" x2="20" y2="60" stroke="currentColor" strokeWidth="2" />,
      <line key="rightArm" x1="50" y1="50" x2="80" y2="60" stroke="currentColor" strokeWidth="2" />,
      <line key="leftLeg" x1="50" y1="70" x2="20" y2="90" stroke="currentColor" strokeWidth="2" />,
      <line key="rightLeg" x1="50" y1="70" x2="80" y2="90" stroke="currentColor" strokeWidth="2" />
    ];

    const partesAMostrar = partes.slice(0, 6 - intentosRestantes);

    return (
      <svg width="100" height="100" style={{ border: '1px solid #d9d9d9', borderRadius: '8px', padding: '4px' }}>
        {/* Estructura base */}
        <line x1="10" y1="95" x2="90" y2="95" stroke="currentColor" strokeWidth="2" />
        <line x1="30" y1="95" x2="30" y2="5" stroke="currentColor" strokeWidth="2" />
        <line x1="30" y1="5" x2="50" y2="5" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="5" x2="50" y2="15" stroke="currentColor" strokeWidth="2" />
        {/* Partes del cuerpo */}
        {partesAMostrar}
      </svg>
    );
  };

  if (loading) {
    return (
      <Content style={{ padding: '24px' }}>
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%', alignItems: 'center' }}>
            <Title level={2}>Cargando...</Title>
          </Space>
        </Card>
      </Content>
    );
  }

  return (
    <Content style={{ padding: '24px' }}>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Juego del Ahorcado</Title>

          {/* Dibujo del ahorcado */}
          {dibujarHangman()}

          {/* Palabra a adivinar */}
          <Text style={{ fontSize: '2rem', fontFamily: 'monospace', letterSpacing: '0.5rem' }}>
            {palabraMostrada}
          </Text>

          {/* Intentos restantes */}
          <Text style={{ fontSize: '1.2rem' }}>
            Intentos restantes: {intentosRestantes}
          </Text>

          {/* Mensajes de estado */}
          {gameStatus !== 'jugando' && (
            <Alert
              message={
                gameStatus === 'ganado'
                  ? '¡Felicitaciones! ¡Has ganado!'
                  : `¡Game Over! La palabra era: ${palabra}`
              }
              type={gameStatus === 'ganado' ? 'success' : 'error'}
              showIcon
              style={{ width: '100%' }}
            />
          )}

          {/* Teclado */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 1fr)',
            gap: '4px',
            width: '100%',
            maxWidth: '600px'
          }}>
            {letras.map((letra) => (
              <Button
                key={letra}
                onClick={() => verificarLetra(letra)}
                disabled={letrasAdivinadas.has(letra) || gameStatus !== 'jugando'}
                type={letrasAdivinadas.has(letra) ? 'dashed' : 'primary'}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: 0,
                  minWidth: '30px'
                }}
              >
                {letra}
              </Button>
            ))}
          </div>

          {/* Botón de reinicio */}
          <Button
            type="primary"
            onClick={iniciarJuego}
            size="large"
          >
            Nuevo Juego
          </Button>
        </Space>
      </Card>
    </Content>
  );
};

export default Hangman;