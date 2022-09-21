import React, { useState } from "react";
import { useHistory } from "react-router-dom";

/**
 * * - Important information
 * ! - This isn't working
 * ? - I have a question about this
 * TODO - Needs completed
 */

function ReservationForm() {
  /*
  TODO create new form
    first name
    last name
    mobile_number
    res date
    res time
  TODO create on click handler
  TODO create on change handler
  */
  const history = useHistory();

  let initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    setFormData({ ...initialFormState });
  };

  return (
    <div>
      <form name="newReservation" onSubmit={handleSubmit}>
        <h1>New Reservation</h1>
        <label htmlFor="first_name">
          First Name:
          <input
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
          ></input>
        </label>
        <br />
        <label htmlFor="last_name">
          Last Name:
          <input
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
          ></input>
        </label>
        <br />
        <label htmlFor="mobile_number">
          Mobile:
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          ></input>
        </label>
        <br />
        <label htmlFor="reservation_date">
          Reservation Date:
          <input
            type="date"
            id="reservation_date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          ></input>
        </label>
        <br />
        <label htmlFor="reservation_time">
          Reservation Time:
          <input
            type="time"
            id="reservation_time"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          ></input>
        </label>
        <br />
        <label htmlFor="people">
          Party size:
          <input
            type="number"
            id="people"
            name="people"
            onChange={handleChange}
            value={formData.people}
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
    </div>
  );
}

export default ReservationForm;
