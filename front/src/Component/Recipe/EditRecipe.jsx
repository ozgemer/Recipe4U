import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "../Button/Button";
import ErrorModal from "../Modal-Backdrop/ErrorModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { UseSearch } from "../../Context/Session";
import { useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
let identifiers = [
  "spicy",
  "sweet",
  "salty",
  "vegan",
  "vegeterian",
  "dairy",
  "gluten free",
  "none",
];

function EditRecipe({
  id,
  identifier,
  title,
  image,
  time,
  servings,
  description,
  ingrediants,
  exitEditMode,
}) {
  const [ingrediantList, setIngrediantList] = React.useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [_identifier, setIdentifier] = React.useState(identifier);
  const index = useParams().index;
  const search = UseSearch();

  React.useEffect(() => {
    setIngrediantList(
      ingrediants.map((i, index) => (
        <Ingrediant key={index} count={index} value={i} />
      ))
    );
  }, []);

  const handleChange = (event) => {
    setIdentifier(event.target.value);
  };

  function addIngrediant() {
    setIngrediantList(
      ingrediantList.concat(
        <Ingrediant
          key={ingrediantList.length}
          count={ingrediantList.length}
          value={""}
        />
      )
    );
  }

  const Ingrediant = ({ count, value }) => {
    return (
      <Grid item xs={6}>
        <TextField
          fullWidth
          name={`Ingrediant${count + 1}`}
          label={`Ingrediant #${count + 1}`}
          type="textbox"
          id={`Ingrediant${count + 1}`}
          defaultValue={value}
          key={count}
        />
      </Grid>
    );
  };

  const formValidation = (data) => {
    return !(
      data.get("recipeTitle") === "" ||
      data.get("recipeServings") === "" ||
      data.get("recipePrepTime") === ""
    );
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!formValidation(data)) return;
    const ingList = [];
    ingrediantList.forEach((ing, index) => {
      const val = data.get(`Ingrediant${index + 1}`);
      if (val !== "") ingList.push(val);
    });
    if (ingList.length === 0) return;

    const requestOption = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageSrc: data.get("recipeImage"),
        title: data.get("recipeTitle"),
        time: data.get("recipePrepTime"),
        servings: data.get("recipeServings"),
        ingrediants: ingList,
        identifiers: _identifier,
        description: data.get("recipeDescription"),
      }),
    };
    fetch(`http://localhost:3000/recipe/update/${id}`, requestOption) //the db adress and the ver that has the task for the server
      .then((response) => (response.ok ? response.json() : { recipe: [] })) //give back the data that just enterd
      .then((data) => {
        const temp = search.result;
        temp[index] = data.recipe;
        search.setResult(temp);
        exitEditMode();
      });
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Box
        component="form"
        noValidate
        onSubmit={HandleSubmit}
        className="edit-from-container"
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="recipeTitle"
              required
              fullWidth
              id="recipeTitle"
              label="Recipe Title"
              defaultValue={title}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="recipeImage"
              fullWidth
              id="recipeImage"
              label="Link an image..."
              defaultValue={image}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="recipeServings"
              label="No. of servings"
              type="textbox"
              id="recipeServings"
              defaultValue={servings}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="identifiers"
              select
              label="identifiers"
              value={_identifier}
              onChange={handleChange}
              fullWidth
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                  getcontentanchorel: null,
                },
              }}
            >
              {identifiers.map((t, index) => {
                return (
                  <MenuItem key={index} value={t}>
                    {t}
                  </MenuItem>
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
              defaultValue={time}
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
              maxRows={4}
              defaultValue={description}
            />
          </Grid>
          {ingrediantList}
          <Grid item xs={12}>
            <Button
              className="btn btn--add-ingrediant"
              fullWidth
              onClick={addIngrediant}
            >
              Add Ingrediant
            </Button>
          </Grid>
        </Grid>
        <Link
          to={`/recipe/${index}`}
          onClick={() => {
            document.getElementById("publish").click();
          }}
        >
          <button type="submit" className="btn btn--submit">
            Publish
          </button>
        </Link>
        <button id="publish" type="submit" hidden></button>
      </Box>
    </>
  );
}

export default EditRecipe;
