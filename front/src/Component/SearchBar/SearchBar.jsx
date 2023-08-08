import "./SearchBar.css";
import React from "react";
import { Disclosure } from "@headlessui/react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import SearchIcon from "../../Images/search.png";
import FilterIcon from "../../Images/filter.png";
import { UseSearch } from "../../Context/Session.jsx";
import { orange } from "@mui/material/colors";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

let RECIPE_ARR = [];
let identifiers = [];

function SearchBar() {
  React.useEffect(() => {
    fetch("http://localhost:3000/recipe/identifiers")
      .then((res) => res.json())
      .then((data) => (identifiers = data.identifiers));
  }, []);
  const [searchParam, setsearchParam] = React.useState({
    title: "",
    identifier: "none",
    servings: 0,
  });

  const handleSearch = () => {
    const requestOption = {
      //request to the json db server (this is a format)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...searchParam,
        title: document.getElementById("searchText").value,
      }),
    };
    fetch("http://localhost:3000/recipe/search", requestOption) //the db adress and the ver that has the task for the server
      .then((response) => (response.ok ? response.json() : { recipe: [] })) //give back the data that just enterd
      .then((data) => {
        RECIPE_ARR = data.recipe;
        setResult(RECIPE_ARR);
      });
  };

  const setResult = UseSearch().setResult;
  const hideFilters = () => {
    const filters = document.getElementById("filters");
    filters && (filters.style.display = "none");
  };
  return (
    <div>
      <Disclosure>
        <div className="search-container">
          <Disclosure.Button className="search-toggle grow">
            <img src={FilterIcon} width={30} alt="filter" />
          </Disclosure.Button>
          <input
            id="searchText"
            className="search"
            placeholder=" search for a recipe..."
          />
          <button
            className="search-button grow"
            onClick={() => {
              handleSearch();
              hideFilters();
            }}
          >
            <img src={SearchIcon} width={35} alt="search" />
            SEARCH
          </button>
        </div>
        <Disclosure.Panel>
          <FiltersContainer
            getSearchParam={() => searchParam}
            setSearchParam={(value) => setsearchParam(value)}
          ></FiltersContainer>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}

function FiltersContainer(props) {
  const [value, setValue] = React.useState("none");
  const handleChange = (e) => {
    props.setSearchParam({
      ...props.getSearchParam(),
      identifier: e.target.value,
    });
    setValue(e.target.value);
  };
  const servingsHandleChange = (e) => {
    props.setSearchParam({
      ...props.getSearchParam(),
      servings: e.target.value.trim(),
    });
  };

  return (
    <div className="filter-container" id="filters">
      <FormControl className="radio-container">
        <FormLabel id="demo-controlled-radio-buttons-group">Filters:</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
          className="radio-group"
        >
          {identifiers.map((t, index) => {
            return (
              <FormControlLabel
                value={t}
                label={t}
                key={index}
                control={
                  <Radio
                    sx={{
                      color: orange[500],
                      "&.Mui-checked": {
                        color: orange[400],
                      },
                    }}
                  />
                }
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <Box className="servings">
        <TextField
          id="servings"
          type="number"
          label="No. of servings"
          variant="standard"
          onChange={servingsHandleChange}
        />
      </Box>
    </div>
  );
}
export default SearchBar;
