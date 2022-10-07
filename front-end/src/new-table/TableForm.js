import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function TableForm() {
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

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
    console.log(formData);

    await axios
      .post("http://localhost:5001/tables", { data: formData })
      .then(function (response) {
        console.log(response);
        history.push("/dashboard");
      })
      .catch(function (error) {
        console.log(error);
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
            required
          ></input>
        </label>
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TableForm;
