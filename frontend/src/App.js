import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './component/home';
import Login from './component/login';
import Navbar from './component/navbar';
import Register from './component/register';
import Slug from './component/comment/[slug]';
import Allies from './component/allies';
import Search from './component/search';
import Profile from './component/profile/[slug]';
import Addpost from './component/addpost';
import Forgot from './component/forgot';
function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
        <Route path='/search' element={<Search/>}></Route>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/comment/:slug' element={<Slug/>}></Route>
          <Route path='/allies' element={<Allies/>}></Route>
          <Route path='/profile/:id' element={<Profile/>}/>
          <Route path='/addpost' element={<Addpost/>}/>
          <Route path='/forgot' element={<Forgot/>}/>
        </Routes>
        </BrowserRouter>
        </>
  );
}

export default App;
