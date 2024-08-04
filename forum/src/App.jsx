
import { useEffect, useState } from 'react';
import './index.css';          
import './App.css';            
import './styles/styles.css';  
import Home from './views/Home';
import AllPosts from './views/AllPosts';
import CreatePost from './views/CreatePost';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './views/NotFound';
import SinglePost from './views/SinglePost';
import { AppContext } from './state/app.context';
import Login from './views/Login';
import Authenticated from './hoc/Authenticated';
import Register from './views/Register';
import ProfileEdit from './views/ProfileEdit';  
import AdminPanel from './views/AdminPanel';    
import { auth } from './config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    isAdmin: false,  
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState((prevState) => ({ ...prevState, user }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        const userData = data[Object.keys(data)[0]];
        setAppState((prevState) => ({
          ...prevState,
          userData,
          isAdmin: userData?.isAdmin || false,  
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts' element={<Authenticated><AllPosts /></Authenticated>} />
          <Route path='/posts/:id' element={<Authenticated><SinglePost /></Authenticated>} />
          <Route path='/posts-create' element={<Authenticated><CreatePost /></Authenticated>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile-edit' element={<Authenticated><ProfileEdit /></Authenticated>} />  // Profile Edit route
          <Route path='/admin-panel' element={<Authenticated><AdminPanel /></Authenticated>} />  // Admin Panel route
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
}

function Footer() {
  return <footer>&copy; 2024 Culinary Forum. All rights reserved.</footer>;
}

export default App;
