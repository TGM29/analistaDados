import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { uploadCSV } from '../api';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleUpload = async () => {
    if (!file || !token) return;
    setLoading(true);
    setMsg('');
    try {
      await uploadCSV(file, token);
      setMsg('Upload realizado!');
      setFile(null);
    } catch {
      setMsg('Erro no upload');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper sx={{ p: 4, minWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>Upload de CSV</Typography>
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          Selecionar arquivo
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </Button>
        {file && <Typography variant="body2">{file.name}</Typography>}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: '100%' }}
          onClick={handleUpload}
          disabled={!file || loading}
        >
          Enviar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, width: '100%' }}
          onClick={() => navigate('/graficos')}
        >
          Ir para Gráficos
        </Button>
        {msg && <Typography sx={{ mt: 2 }}>{msg}</Typography>}
      </Paper>
    </Box>
  );
}
