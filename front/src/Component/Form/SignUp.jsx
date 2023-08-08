import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { Button } from "@material-ui/core";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import Modal from "../Modal-Backdrop/Modal";
import { AiFillCloseCircle } from "react-icons/ai";
import classes from "./SignUp.module.css";
import { UseSession } from "../../Context/Session";
import ErrorModal from "../Modal-Backdrop/ErrorModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

const theme = createTheme({
  typography: {
    htmlFontSize: 10.75,
    fontFamily: "Lato",
  },
});

export default function SignUp(props) {
  const [showSign, setShowSign] = useState(true);

  const [emailError, setEmailError] = useState(true);
  const [firstEmail, setFirstEmail] = useState(false);

  const [passwordError, setPasswordError] = useState(true);
  const [firstPassword, setFirstPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState(true);
  const [firstFirstName, setfirstFirstName] = useState(false);

  const [lastNameError, setLastNameError] = useState(true);
  const [firstLastName, setFirstLastName] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const session = UseSession();

  const closeFormHandler = () => {
    setShowSign(false);
    props.closeForm();
  };

  const changeFirstNameHandler = (event) => {
    const first = event.target.value;
    if (first === "") {
      console.log("first:error");
      setFirstNameError(true);
    } else setFirstNameError(false);
    setfirstFirstName(true);
  };

  const changeLastNameHandler = (event) => {
    const last = event.target.value;
    if (last === "") {
      console.log("last:error");
      setLastNameError(true);
    } else setLastNameError(false);
    setFirstLastName(true);
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
    const password = data.get("password");
    const email = data.get("email");
    const name = `${data.get("firstName")} ${data.get("lastName")}`;

    try {
      const request = await sendRequest(
        "http://localhost:3000/users/signup",
        "POST",
        JSON.stringify({
          name,
          email,
          password,
          userName: "1",
        }),
        {
          "Content-Type": "application/json",
        }
      );

      closeFormHandler();
      session.setSession({
        userId: request.user.id,
        name: request.user.name,
        email: request.user.email,
        bookmarks: [],
      });
    } catch (err) {}

    //to do:connect to log in toogle
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showSign}
        onCancel={closeFormHandler}
        header={
          <AiFillCloseCircle
            onClick={closeFormHandler}
            className={classes.icon}
          />
        }
        contentClass="recipe-item__modal-content"
        footerClass="recipe-item__modal-actions"
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
              <h2>Sign up</h2>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={firstFirstName && firstNameError}
                      onChange={changeFirstNameHandler}
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={firstLastName && lastNameError}
                      onChange={changeLastNameHandler}
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      // value={lasttName}
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={firstEmail && emailError}
                      onChange={changeEmailHandler}
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      // value={email}
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      error={firstPassword && passwordError}
                      onChange={changePasswordHandler}
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      // value={password}
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  disabled={
                    emailError ||
                    passwordError ||
                    firstNameError ||
                    lastNameError
                  }
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid
                  container
                  justifyContent="flex-end"
                  sx={{ marginBottom: "1rem" }}
                ></Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </Modal>
    </>
  );
}
