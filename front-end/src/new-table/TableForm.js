import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function TableForm() {
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [postError, setPostError] = useState(null);

  const handleChange = ({ target }) => {
    if (target.name === "capacity") {
      setFormData({
        ...formData,
        [target.name]: parseInt(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/tables`, { data: formData })
      .then(function (response) {
        history.push("/dashboard");
      })
      .catch(function (error) {
        console.error(error);
        setPostError(error);
      });
  };

  return (
    <div>
      <form name="newTable" onSubmit={handleSubmit}>
        <h1>New Table</h1>
        <label htmlFor="table_name">
          Table Name{" "}
          <input
            id="table_name"
            type="text"
            name="table_name"
            onChange={handleChange}
            value={formData.table_name}
            required
          ></input>
        </label>
        <br />
        <label htmlFor="capacity">
          Capacity{" "}
          <input
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleChange}
            value={formData.capacity}
            min="1"
            required
          ></input>
        </label>
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
      <ErrorAlert error={postError} />
    </div>
  );
}

export default TableForm;
