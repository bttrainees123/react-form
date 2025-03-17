import './App.css';
import Display from './component/Display';
import Form from './component/Form';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './component/Home';
import UserList from './component/UserList';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/display" element={<Display/>} />
          <Route path="/form" element={<Form/>} />
          <Route path="/users" element={<UserList/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
