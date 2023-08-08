import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button.jsx";
import SearchBar from "../SearchBar/SearchBar";
import Canvas from "../Canvas.jsx";
import { UseSession } from "../../Context/Session.jsx";
import LogInForm from "../Form/LogIn";
import SignUp from "../Form/SignUp";
import RecipeForm from "../Form/RecipeForm";
import "./NavBar.css";

function NavBar() {
  const [showRecipeForm, setShowRecipeForm] = React.useState(false);
  const [showLoginForm, setShowLoginForm] = React.useState(false);
  const [showSignupForm, setShowSignupForm] = React.useState(false);
  const [buttonList, setButtonList] = React.useState(false);

  const buttonListToggle = () => setButtonList(!buttonList);
  const session = UseSession();
  return (
    <header>
      <nav className="nav-bar flex-container">
        <Link to="/">
          <Canvas className="logo" />
        </Link>

        <SearchBar />
        <div className="logButtons">
          {session.session.userId === null && (
            <>
              <NavBarButton onClick={() => setShowLoginForm(true)}>
                Log In
              </NavBarButton>
              <NavBarButton onClick={() => setShowSignupForm(true)}>
                Sign up
              </NavBarButton>
            </>
          )}
          {session.session.userId !== null && (
            <>
              <NavBarButton onClick={() => setShowRecipeForm(true)}>
                New Recipe
              </NavBarButton>
              <NavBarButton className="profile-btn" onClick={buttonListToggle}>
                <img
                  width={30}
                  src="https://img.icons8.com/ios-filled/50/000000/user.png"
                />
              </NavBarButton>
              <div className="buttons-popup">
                {buttonList && (
                  <ProfileSlider
                    toggle={() => setButtonList((prev) => !prev)}
                    logout={session.setSession}
                  />
                )}
              </div>
            </>
          )}
        </div>
        {showRecipeForm && (
          <RecipeForm closeForm={() => setShowRecipeForm(false)} />
        )}
        {showLoginForm && (
          <LogInForm closeForm={() => setShowLoginForm(false)} />
        )}
        {showSignupForm && (
          <SignUp closeForm={() => setShowSignupForm(false)} />
        )}
      </nav>
    </header>
  );
}

function ProfileSlider({ logout, toggle }) {
  return (
    <>
      <div className="button-group" onMouseLeave={toggle}>
        <Link to="/profile">
          <Button className="btn user-button">My Profile</Button>
        </Link>
        <Link to="/">
          <Button
            className="btn user-button"
            onClick={() =>
              logout({
                userId: null,
                name: null,
                email: null,
                bookmarks: null,
              })
            }
          >
            Log Out
          </Button>
        </Link>
      </div>
    </>
  );
}
export function NavBarButton(props) {
  return (
    <Button
      onClick={props.onClick}
      className={`btn btn--margin nav-btn ${props.className}`}
    >
      {props.children}
    </Button>
  );
}
export default NavBar;
