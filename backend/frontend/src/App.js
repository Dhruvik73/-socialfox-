import { createBrowserRouter, RouterProvider, Outlet,Navigate } from 'react-router-dom';
import './App.css';
import Home from './component/home';
import Login from './component/login';
import Navbar from './component/navbar';
import Register from './component/register';
import Allies from './component/allies';
import Profile from './component/profile/[slug]';
import Addpost from './component/addpost';
import Forgot from './component/forgot';
import Story from './component/story';
import Showstory from './component/showstory';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorView from './component/ErrorView';
import ChatRoom from './component/ChatRoom'
const router = new createBrowserRouter([{
  path: "/",
  element: <Authenticate><NavbarWrapper /></Authenticate>,
  children: [
    {
      path: "/",
      element: <Home />
    }
  ,
    {
      path: "/allies",
      element: <Allies />
    },
    { path: "/profile/:id", 
      element: <Profile />
    },
    { path: "/chat", 
      element: <ChatRoom />
    },
    {
      path: "/addpost",
      element: <Addpost />
    },
    {
      path: "/story/:id",
      element: <Story />
    }]
},
{
  path: "/register",
  element: <Authenticate isLoginPages={true}><Register /></Authenticate>
},
{
  path: "/login",
  element: <Authenticate isLoginPages={true}><Login /></Authenticate>
},
{
  path: "/forgot",
  element: <Authenticate isLoginPages={true}><Forgot /></Authenticate>
}])

function NavbarWrapper() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
function Authenticate({children,isLoginPages}) {
  const token=localStorage.getItem("token");
    return isLoginPages?token?<Navigate to={'/'}></Navigate>:children:token?children:<Navigate to={'/login'}></Navigate>
}
function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
