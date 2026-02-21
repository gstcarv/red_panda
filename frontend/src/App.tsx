import './App.css';
import { QueryClientProvider } from './lib/react-query';
import { Toaster } from 'sonner';
import { AppRouter } from './config/router';

function App() {
  return (
    <QueryClientProvider>
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
