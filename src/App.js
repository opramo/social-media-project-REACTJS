import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import AccountSettings from "./Pages/AccountSettings";
import MyKitchen from "./Pages/MyKitchen";
import NewRecipe from "./Pages/NewRecipe";
import VerifyAcc from "./Pages/VerifyAcc";
import Verification from "./Pages/Verification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditRecipe from "./Pages/EditRecipe";
import { useSelector } from "react-redux";
import ModalRestriction from "./components/ModalRestriction";
import RecipeDetails from "./Pages/RecipeDetail";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";
import NotFound404 from "./Pages/NotFound404";

// css

function App() {
  const { is_verified } = useSelector((state) => state.user);
  const location = useLocation();

  return (
    <>
      <NavBar />
      {!is_verified &&
      (location.pathname === "/home" || location.pathname === "/account") ? (
        <ModalRestriction />
      ) : null}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/accountsettings" element={<AccountSettings />} />
        <Route path="/account" element={<MyKitchen />} />
        <Route path="/newrecipe" element={<NewRecipe />} />
        <Route path="/editrecipe" element={<EditRecipe />} />
        <Route path="/recipe/:post_id" element={<RecipeDetails />} />
        <Route path="/verifyaccount" element={<VerifyAcc />} />
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile/:profile_username" element={<Profile />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <ToastContainer
        pauseOnFocusLoss={false}
        autoClose={1000}
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
