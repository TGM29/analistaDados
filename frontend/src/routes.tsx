import React from 'react';
import { RouteObject } from 'react-router-dom';
import UploadPage from './views/UploadPage';
import ChartsPage from './views/ChartsPage';

export const routes: RouteObject[] = [
  { path: '/', element: <UploadPage /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/graficos', element: <ChartsPage /> },
];
