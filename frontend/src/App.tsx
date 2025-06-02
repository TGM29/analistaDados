import React, { useState } from 'react';
import { CssBaseline, Container, Box, Typography, Button, TextField, Paper, AppBar, Toolbar } from '@mui/material';
import { register, login, uploadCSV, fetchData } from './api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AuthForm({ onAuth }: { onAuth: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await login(email, password);
        onAuth(res.data.token);
      } else {
        await register(email, password);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data || 'Erro');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>{isLogin ? 'Login' : 'Cadastro'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Senha" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>{isLogin ? 'Entrar' : 'Cadastrar'}</Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)} sx={{ mt: 2 }}>
        {isLogin ? 'Criar conta' : 'Já tem conta? Entrar'}
      </Button>
    </Paper>
  );
}

function UploadForm({ token, onUpload }: { token: string, onUpload: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const handleUpload = async () => {
    if (!file) return;
    setMsg('');
    try {
      await uploadCSV(file, token);
      setMsg('Upload realizado!');
      onUpload();
    } catch {
      setMsg('Erro no upload');
    }
  };
  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} />
      <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }} disabled={!file}>Enviar CSV</Button>
      {msg && <Typography>{msg}</Typography>}
    </Paper>
  );
}

function DataCharts({ token }: { token: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    setLoading(true);
    fetchData(token).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [token]);
  if (loading) return <Typography>Carregando dados...</Typography>;
  if (!data.length) return <Typography>Nenhum dado encontrado.</Typography>;
  return (
    <Box sx={{ mt: 4 }}>
      {data.map((file: any, idx: number) => (
        <Paper key={idx} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6">{file.file}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={file.data}>
              <XAxis dataKey={Object.keys(file.data[0])[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(file.data[0]).filter(k => k !== Object.keys(file.data[0])[0]).map((key, i) => (
                <Bar dataKey={key} fill={['#1976d2', '#388e3c', '#fbc02d', '#d32f2f'][i % 4]} key={key} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      ))}
    </Box>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refresh, setRefresh] = useState(0);
  const handleAuth = (t: string) => {
    setToken(t);
    localStorage.setItem('token', t);
  };
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Analista Dados</Typography>
          {token && <Button color="inherit" onClick={handleLogout}>Sair</Button>}
        </Toolbar>
      </AppBar>
      <Container>
        {!token ? (
          <AuthForm onAuth={handleAuth} />
        ) : (
          <>
            <UploadForm token={token} onUpload={() => setRefresh(r => r + 1)} />
            <DataCharts token={token} key={refresh} />
          </>
        )}
      </Container>
    </>
  );
}

export default App;
