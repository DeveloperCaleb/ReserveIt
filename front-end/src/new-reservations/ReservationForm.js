import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { today } from "../utils/date-time";
import DateError from "./DateError";
import TimeError from "./TimeError";
const axios = require("axios");

/**
 * * - Important information
 * ! - This isn't working
 * ? - I have a question about this
 * TODO - Needs completed
 */

// TODO After submission make the minimum date require be the current day.

function ReservationForm() {
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
    if (target.name === "people") {
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
      .post("http://localhost:5001/reservations", { data: formData })
      .then(function (response) {
        console.log(response);
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function dateValidation() {
    const selectedDate = formData.reservation_date.split("-");
    const selectedDateFormatted = new Date(
      selectedDate[0],
      selectedDate[1] - 1,
      selectedDate[2]
    );

    const todaysDate = today().split("-");
    const todaysDateFormatted = new Date(
      todaysDate[0],
      todaysDate[1] - 1,
      todaysDate[2]
    );

    if (
      selectedDateFormatted.getDay() !== 2 &&
      selectedDateFormatted >= todaysDateFormatted
    ) {
      return true;
    }
  }

  function timeValidation() {
    const selectedTime = formData.reservation_time.split(":");
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (
      parseInt(selectedTime[0]) < 10 ||
      (parseInt(selectedTime[0]) <= 10 && parseInt(selectedTime[1]) < 30)
    ) {
      return "early";
    } else if (
      parseInt(selectedTime[0]) > 21 ||
      (parseInt(selectedTime[0]) >= 21 && parseInt(selectedTime[1]) >= 30)
    ) {
      return "late";
    } else if (
      parseInt(selectedTime[0]) <= hour ||
      (parseInt(selectedTime[0]) <= hour &&
        parseInt(selectedTime[1]) <= minutes)
    ) {
      return "past";
    }

    return true;
  }

  function validation() {
    if (dateValidation() && timeValidation() === true) {
      return (
        <div>
          {" "}
          <button type="submit">Submit</button>
          <button type="button" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
      );
    } else if (!dateValidation()) {
      return <DateError />;
    } else if (timeValidation() !== true) {
      return <TimeError error={timeValidation()} />;
    }
  }

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
        {validation()}
      </form>
    </div>
  );
}

export default ReservationForm;
