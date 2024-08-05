
// import { useEffect, useState } from 'react';
// import './index.css';          // Глобални стилове
// import './App.css';            // Специфични стилове за компоненти
// import './styles/styles.css';  // Основен CSS файл за допълнителна стилизация
// import Home from './views/Home';
// import AllPosts from './views/AllPosts';
// import CreatePost from './views/CreatePost';
// import Header from './components/Header';  
// import Sidebar from './components/Sidebar'; 
// import Profile from './components/Profile'; 
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import NotFound from './views/NotFound';
// import SinglePost from './views/SinglePost';
// import { AppContext } from './state/app.context';
// import Login from './views/Login';
// import Authenticated from './hoc/Authenticated';
// import Register from './views/Register';
// import { auth } from './config/firebase-config';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { getUserData } from './services/users.service';

// function App() {
//   const [appState, setAppState] = useState({
//     user: null,
//     userData: null,
//   });
//   const [user, loading, error] = useAuthState(auth);

//   useEffect(() => {
//     if (appState.user !== user) {
//       setAppState((prevState) => ({ ...prevState, user }));
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!user) return;

//     const fetchUserData = async () => {
//       try {
//         const data = await getUserData(user.uid);
//         const userData = data[Object.keys(data)[0]];
//         setAppState((prevState) => ({ ...prevState, userData }));
//       } catch (error) {
//         console.error('Failed to fetch user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   return (
//     <BrowserRouter>
//       <AppContext.Provider value={{ ...appState, setAppState }}>
//         <Header /> {/* Използвай Header компонента тук */}
//         <Sidebar />
//         <div className="content">
//           <Profile /> {/* Използвай Profile компонента тук */}
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/posts' element={<Authenticated><AllPosts /></Authenticated>} />
//             <Route path='/posts/:id' element={<Authenticated><SinglePost /></Authenticated>} />
//             <Route path='/posts-create' element={<Authenticated><CreatePost /></Authenticated>} />
//             <Route path='/login' element={<Login />} />
//             <Route path='/register' element={<Register />} />
//             <Route path='*' element={<NotFound />} />
//           </Routes>
//           <Footer />
//         </div>
//       </AppContext.Provider>
//     </BrowserRouter>
//   );
// }

// function Footer() {
//   return <footer>&copy; 2024 Culinary Forum. Всички права запазени.</footer>;
// }

// export default App;
import { useEffect, useState } from 'react';
import './index.css';          // Global styles
import './App.css';            // Component specific styles
import './styles/styles.css';  // Main CSS file for additional styles
import Home from './views/Home';
import AllPosts from './views/AllPosts';
import CreatePost from './views/CreatePost';
import Header from './components/Header';  
import Sidebar from './components/Sidebar'; 
import Profile from './components/Profile'; 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './views/NotFound';
import SinglePost from './views/SinglePost';
import { AppContext } from './state/app.context';
import Login from './views/Login';
import Authenticated from './hoc/Authenticated';
import Register from './views/Register';
import { auth } from './config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
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
        setAppState((prevState) => ({ ...prevState, userData }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header /> {/* Use Header component here */}
        <Sidebar />
        <div className="content">
          <Profile /> {/* Use Profile component here */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/posts' element={<Authenticated><AllPosts /></Authenticated>} />
            <Route path='/posts/:id' element={<Authenticated><SinglePost /></Authenticated>} />
            <Route path='/posts-create' element={<Authenticated><CreatePost /></Authenticated>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

function Footer() {
  return <footer>&copy; 2024 Culinary Forum. A Culinary Project by Telerik. All rights reserved.</footer>;
}


export default App;
