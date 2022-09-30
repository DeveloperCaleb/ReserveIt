import React from "react";
import { useHistory } from "react-router";

function DateError() {
  const history = useHistory();
  return (
    <div>
      {" "}
      <p className="alert alert-danger">
        Reservation must be today or in the future. Closed on Tuesday!
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

export default DateError;
