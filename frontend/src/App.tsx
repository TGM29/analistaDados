import React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UploadPage from './views/UploadPage';
import ChartsPage from './views/ChartsPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);
  return <>{children}</>;
}

function LoginPage({ onAuth }: { onAuth: (token: string) => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const { register, login } = require('./api');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await login(email, password);
        onAuth(res.data.token);
        navigate('/upload');
      } else {
        await register(email, password);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data || 'Erro');
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit} style={{ marginTop: 64 }}>
        <Typography variant="h5" gutterBottom>{isLogin ? 'Login' : 'Cadastro'}</Typography>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>{isLogin ? 'Entrar' : 'Cadastrar'}</Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)} sx={{ mt: 2 }}>
        {isLogin ? 'Criar conta' : 'Já tem conta? Entrar'}
      </Button>
    </Container>
  );
}

function App() {
  const [token, setToken] = React.useState<string | null>(localStorage.getItem('token'));
  const handleAuth = (t: string) => {
    setToken(t);
    localStorage.setItem('token', t);
  };
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Analista Dados</Typography>
          {token && <Button color="inherit" onClick={handleLogout}>Sair</Button>}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
        <Route path="/upload" element={<AuthGuard><UploadPage /></AuthGuard>} />
        <Route path="/graficos" element={<AuthGuard><ChartsPage /></AuthGuard>} />
        <Route path="*" element={<Navigate to={token ? '/upload' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
