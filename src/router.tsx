import { createBrowserRouter } from 'react-router-dom';
import { InitialExperience } from './pages/InitialExperience';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <InitialExperience />,
  },
]);