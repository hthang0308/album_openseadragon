import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Album from "./components/Album";
import ChangePassword from "./components/ChangePassword";
import MainNavigation from "./components/layout/MainNavigation";
import AlbumShared from "./components/AlbumShared";
import PhotoShared from "./components/PhotoShared/index2";
import TestPage from "./pages/TestPage";
import HomePage from "./pages/HomePage";
import ThemeConfig from "./theme";
import Photo from "./components/Photo";
import OpenSeaDragon from "./components/OpenSeaDragon";
import { ToastContainer } from "react-toastify";
import { Container } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(document.cookie.includes("isLoggedIn=true"));

  return (
    <HashRouter>
      <ThemeConfig>
        <ToastContainer autoClose={2000} />
        <MainNavigation isLoggedIn={isLoggedIn} />
        <Container sx={{ m: 0, mt: 1 }} className="mx-auto">
          {isLoggedIn ? (
            <Routes>
              <Route path="/" element={<Album />} />
              <Route path="/album/:albumId/:photoId" element={<OpenSeaDragon />} />
              <Route path="/album" element={<Album />} />
              <Route path="/album/:albumId" element={<Photo />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/album-shared" element={<AlbumShared />} />
              <Route path="/photo-shared" element={<PhotoShared />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/album/:albumId/:photoId" element={<OpenSeaDragon />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<LogIn />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          )}
        </Container>
      </ThemeConfig>
    </HashRouter>
  );
}

// return (
//   <ThemeConfig>
//     <HashRouter>
//       <div>
//         <MainNavigation />
//         <div className="ml-4">
//           <Routes>
//             <Route path="/user" element={<SignUp />} />
//             <Route path="/sign-up" element={<SignUp />} />
//             <Route path="/log-in" element={<LogIn />} />
//             <Route path="/change-password" element={<ChangePassword />} />
//             <Route path="/my-albums" element={<SignUp />} />
//             <Route path="/create-album" element={<CreateAlbum />} />
//           </Routes>
//         </div>
//       </div>
//     </HashRouter>
//   </ThemeConfig>
// );

export default App;
