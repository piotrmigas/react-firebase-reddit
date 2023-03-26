import { Route, Routes, Outlet, useLocation } from 'react-router-dom';
import { Provider } from './context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Sub from './pages/Sub';
import Post from './pages/SinglePost';
import Submit from './pages/CreatePost';
import UserProfile from './pages/UserProfile';
import CreateSub from './pages/CreateSub';

function App() {
  const authRoutes = ['/register', '/login'];
  const location = useLocation();
  const authRoute = authRoutes.includes(location.pathname);

  return (
    <Provider>
      {!authRoute && <Navbar />}
      <div className={authRoute ? '' : 'pt-12'}>
        <Routes>
          <Route index path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route index path='/r/:subname' element={<Sub />} />
          <Route path='/r/:subname/:id/:postname' element={<Post />} />
          <Route path='/r/:subname/submit' element={<Submit />} />
          <Route path='/u/:username' element={<UserProfile />} />
          <Route path='/subs/create' element={<CreateSub />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
