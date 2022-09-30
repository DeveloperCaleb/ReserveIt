import React from "react";
import { useHistory } from "react-router";

function TimeError({ error }) {
  console.log(error);
  const history = useHistory();

  if (error === "early") {
    return (
      <div>
        {" "}
        <p className="alert alert-danger">Not opened until 10:30AM!</p>{" "}
        <button disabled type="submit">
          Submit
        </button>{" "}
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </div>
    );
  } else if (error === "late") {
    return (
      <div>
        {" "}
        <p className="alert alert-danger">
          Too soon to closing at 10:30PM or already closed!
        </p>{" "}
        <button disabled type="submit">
          Submit
        </button>{" "}
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </div>
    );
  } else if (error === "past") {
    return (
      <div>
        {" "}
        <p className="alert alert-danger">
          Reservation must be in the future!
        </p>{" "}
        <button disabled type="submit">
          Submit
        </button>{" "}
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </div>
    );
  }
}

export default TimeError;
