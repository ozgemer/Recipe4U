import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import classes from "./SignUp.module.css";
import Modal from "../Modal-Backdrop/Modal";
import "../RecipeItem/RecipeItem.css";
import ErrorModal from "../Modal-Backdrop/ErrorModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { UseSession } from "../../Context/Session";
// import { responsiveFontSizes } from "@material-ui/core";

const theme = createTheme({
  typography: {
    htmlFontSize: 10.75,
    fontFamily: "Lato",
  },
});

export default function SignIn(props) {
  const [showSign, setShowSign] = useState(true);
  const [emailError, setEmailError] = useState(true);
  const [firstEmail, setFirstEmail] = useState(false);
  const [passwordError, setPasswordError] = useState(true);
  const [firstPassword, setFirstPassword] = useState(false);
  const session = UseSession();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const closeFormHandler = () => {
    setShowSign(false);
    props.closeForm();
  };

  const changeEmailHandler = (event) => {
    const email = event.target.value;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError(true);
    } else setEmailError(false);
    setFirstEmail(true);
  };

  const changePasswordHandler = (event) => {
    const password = event.target.value;
    if (password.length < 6) {
      setPasswordError(true);
    } else setPasswordError(false);
    setFirstPassword(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const request = await sendRequest(
        "http://localhost:3000/users/login",
        "POST",
        JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
        { "Content-Type": "application/json" }
      );

      await fetch(`http://localhost:3000/bookmark/get/${request.user.id}`)
        .then((res) => (res.ok ? res.json() : { user: [] }))
        .then((data) => (request.user.bookmarks = data.user))
        .then(closeFormHandler)
        .then(() =>
          session.setSession({
            userId: request.user.id,
            name: request.user.name,
            email: request.user.email,
            bookmarks: request.user.bookmarks,
          })
        );
    } catch (err) {
      return;
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showSign}
        contentClass="recipe-item__modal-content"
        footerClass="recipe-item__modal-actions"
        onCancel={closeFormHandler}
        header={
          <AiFillCloseCircle
            onClick={closeFormHandler}
            className={classes.icon}
          />
        }
        footer={<></>}
      >
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "#f4aa8a" }}>
                <LockOutlinedIcon />
              </Avatar>
              <h2>Sign in</h2>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  error={firstEmail && emailError}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={changeEmailHandler}
                />
                <TextField
                  error={firstPassword && passwordError}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={changePasswordHandler}
                />
                <Button
                  disabled={emailError || passwordError}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </Modal>
    </>
  );
}
