import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservationForm() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [formData, setFormData] = useState("");
  const [error, setError] = useState("");
  const [reservationError, setReservationError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function getReservation() {
      try {
        await axios
          .get(`http://localhost:5001/reservations/${reservation_id}`, {
            signal: abortController.signal,
          })
          .then((response) => {
            setFormData(response.data.data);
          });
      } catch (error) {
        console.error(error);
        setReservationError(error);
      }
    }
    getReservation();
    return () => {
      abortController.abort(); // Cancels any pending request or response
    };
  }, [reservation_id]);

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

  function validation() {
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

    const selectedTime = formData.reservation_time;

    const currentTime = new Date();

    const currentTimeFormatted = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

    if (
      selectedDateFormatted.getDay() === 2 ||
      selectedDateFormatted < todaysDateFormatted
    ) {
      return setError(
        "Reservation must be today or in the future. Closed on Tuesday!"
      );
    } else if (selectedTime < "10:30") {
      return setError("Not opened until 10:30AM!");
    } else if (selectedTime > "21:29") {
      return setError("Too soon to closing. Closed at 10:30PM!");
    } else if (
      selectedDate === todaysDate &&
      selectedTime < currentTimeFormatted
    ) {
      return setError(" Reservation must be in the future!");
    } else if (formData.status !== "booked") {
      return setError("Reservation must have a status of booked");
    }
    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (validation()) {
        await axios
          .put(`http://localhost:5001/reservations/${reservation_id}`, {
            data: formData,
          })
          .then(function (response) {
            history.push(`/dashboard?date=${formData.reservation_date}`);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {formData === "" ? (
        <div>Loading</div>
      ) : (
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
          <div>
            {" "}
            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() => history.goBack()}
              data-reservation-id-cancel={reservation_id}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <p className={error !== "" ? "alert alert-danger" : ""}>
        {error !== ""} {error}
      </p>
      <ErrorAlert error={reservationError} />
    </div>
  );
}

export default EditReservationForm;
