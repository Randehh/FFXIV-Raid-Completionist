import './App.css';
import Main from './Main';
import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className='App-content'>
        <Main/>
      </div>
    </div>
  );
}

export default App;