import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchData } from '../api';

export default function ChartsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchData(token).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [token]);

  if (!token) return <Typography>Faça login para ver os gráficos.</Typography>;
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
