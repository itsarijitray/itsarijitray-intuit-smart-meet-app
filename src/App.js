import './App.css';
import { ToastContextProvider } from './components/toastContext';
import MainApp from './MainApp';

function App() {
  return (
    <div className="App">
      <ToastContextProvider>
        <MainApp>
        </MainApp>
      </ToastContextProvider>
    </div>
  );
}

export default App;
