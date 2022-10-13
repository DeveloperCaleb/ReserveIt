import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SearchResults from "./SearchResults";
import ErrorAlert from "../layout/ErrorAlert";

function SearchForm() {
  const history = useHistory();
  const [number, setNumber] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setNumber(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    try {
      await axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/reservations?mobile_number=${number}`,
          {
            signal: abortController.signal,
          }
        )
        .then((response) => {
          setSearchResults(response.data.data);
        });
    } catch (error) {
      console.error(error);
      setError(error);
    }
    return () => {
      abortController.abort(); // Cancels any pending request or response
    };
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
      <ErrorAlert error={error} />
    </div>
  );
}

export default SearchForm;
