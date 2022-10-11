import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SearchResults from "./SearchResults";

function SearchForm() {
  const history = useHistory();
  const [number, setNumber] = useState("");
  const [searchResults, setSearchResults] = useState("");

  const handleChange = ({ target }) => {
    setNumber(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios
        .get(`http://localhost:5001/reservations?mobile_number=${number}`)
        .then((response) => {
          console.log(response.data.data);
          setSearchResults(response.data.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form name="newSearch" onSubmit={handleSubmit}>
        <h1>Search</h1>
        <label htmlFor="number">
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            value={number}
            placeholder="Please enter a phone number"
            onChange={handleChange}
          ></input>
        </label>
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.push("/dashboard")}>
          Cancel
        </button>
      </form>
      <div>
        {searchResults.length === 0 ? (
          <h2>No reservations found</h2>
        ) : (
          <SearchResults searchResults={searchResults} />
        )}
      </div>
    </div>
  );
}

export default SearchForm;
