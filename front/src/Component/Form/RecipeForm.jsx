import * as React from "react";
import { Button } from "@material-ui/core";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "../Modal-Backdrop/Modal";
import { AiFillCloseCircle } from "react-icons/ai";
import classes from "./SignUp.module.css";
import Avatar from "@mui/material/Avatar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useHttpClient } from "../hooks/http-hook";
import { UseSession } from "../../Context/Session";
import ErrorModal from "../Modal-Backdrop/ErrorModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import MenuItem from "@mui/material/MenuItem";

const theme = createTheme({
  typography: {
    htmlFontSize: 10.75,
    fontFamily: "Lato",
  },
});

const Ingrediant = ({ count }) => {
  return (
    <Grid item xs={6}>
      <TextField
        fullWidth
        name={`Ingrediant${count + 1}`}
        label={`Ingrediant #${count + 1}`}
        type="textbox"
        id={`Ingrediant${count + 1}`}
      />
    </Grid>
  );
};
let identifiers = [
  "none",
  "spicy",
  "sweet",
  "salty",
  "vegan",
  "vegeterian",
  "dairy",
  "gluten free",
];
export default function RecipeForm(props) {
  const [authorError, setAuthorError] = React.useState(false);
  const [ingrediantList, setIngrediantList] = React.useState([]);
  const [titleError, setTitleError] = React.useState(false);
  const [servingsError, setServingsError] = React.useState(false);
  const [timeError, setTimeError] = React.useState(false);
  const [ingrediantError, setIngrediantError] = React.useState(false);
  const [showForm, setShowForm] = React.useState(true);
  const [identifier, setIdentifier] = React.useState("");

  const handleChange = (event) => {
    setIdentifier(event.target.value);
  };
  const session = UseSession();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const closeFormHandler = (hideForm) => {
    setShowForm(false);
    hideForm(false);
  };

  const addIngrediant = () => {
    setIngrediantList(
      ingrediantList.concat(
        <Ingrediant key={ingrediantList.length} count={ingrediantList.length} />
      )
    );
  };

  const formValidation = (data) => {
    setTitleError(data.get("recipeTitle") === "");
    setServingsError(data.get("recipeServings") === "");
    setTimeError(data.get("recipePrepTime") === "");
    setAuthorError(data.get("recipeAuthour") === "");
    return !(
      data.get("recipeTitle") === "" ||
      data.get("recipeServings") === "" ||
      data.get("recipePrepTime") === "" ||
      data.get("recipeAuthour") === ""
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!formValidation(data)) return;
    const ingList = [];
    ingrediantList.forEach((ing, index) => {
      const val = data.get(`Ingrediant${index + 1}`);
      if (val !== "") ingList.push(val);
    });
    setIngrediantError(ingList.length === 0);
    if (ingList.length === 0) return;
    try {
      const newRecipe = await sendRequest(
        "http://localhost:3000/recipe/add",
        "POST",
        JSON.stringify({
          imageSrc: data.get("recipeImage"),
          title: data.get("recipeTitle"),
          time: data.get("recipePrepTime"),
          servings: data.get("recipeServings"),
          ingrediants: ingList,
          description: data.get("recipeDescription"),
          publisher: session.session.name,
          userNameId: session.session.userId,
          identifiers: identifier,
          address: data.get("recipeAddress"),
        }),
        { "Content-Type": "application/json" }
      );
      console.log(newRecipe);
    } catch (err) {}
    closeFormHandler(props.closeForm);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showForm}
        onCancel={() => closeFormHandler(props.closeForm)}
        header={
          <AiFillCloseCircle
            onClick={() => closeFormHandler(props.closeForm)}
            className={classes.icon}
          />
        }
        footer={<></>}
      >
        {isLoading && <LoadingSpinner asOverlay />}
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
                <RestaurantIcon />
              </Avatar>
              <h2>Create A New Recipe</h2>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="recipeTitle"
                      error={titleError}
                      required
                      fullWidth
                      id="recipeTitle"
                      label="Recipe Title"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="recipeImage"
                      fullWidth
                      id="recipeImage"
                      label="Link an image..."
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="recipeServings"
                      label="No. of servings"
                      type="textbox"
                      id="recipeServings"
                      required
                      error={servingsError}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        marginTop: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      id="identifiers"
                      select
                      label="identifiers"
                      value={identifier}
                      onChange={handleChange}
                      SelectProps={{
                        native: true,
                      }}
                      fullWidth
                    >
                      {identifiers.map((t, index) => {
                        return (
                          <option key={index} value={t}>
                            {t}
                          </option>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="recipePrepTime"
                      label="Prep Time"
                      type="textbox"
                      id="recipePrepTime"
                      required
                      error={timeError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="recipeDescription"
                      label="write down recipe description..."
                      type="textbox"
                      id="recipeDescription"
                      multiline
                      maxRows={5}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={() => addIngrediant()}
                      fullWidth
                      variant={ingrediantError ? "outlined" : "text"}
                      color={ingrediantError ? "secondary" : "default"}
                    >
                      Add Ingrediant
                    </Button>
                  </Grid>
                  {ingrediantList}
                  <Grid item xs={12}>
                    <TextField
                      name="recipeAddress"
                      fullWidth
                      id="recipeAddress"
                      label="address"
                    />
                  </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained">
                  Publish
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </Modal>
    </>
  );
}
