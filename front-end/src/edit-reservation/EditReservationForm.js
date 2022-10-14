import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ResForm from "../res-form/ResForm";
import { today } from "../utils/date-time";

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
          .get(
            `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservation_id}`,
            {
              signal: abortController.signal,
            }
          )
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

    const yearMatchesToday = selectedDate[0] === todaysDate[0];
    const monthMatchesToday = selectedDate[1] === todaysDate[1];
    const dayMatchesToday = selectedDate[2] === todaysDate[2];

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
    } else if (
      yearMatchesToday &&
      monthMatchesToday &&
      dayMatchesToday &&
      selectedTime < currentTimeFormatted
    ) {
      return setError(" Reservation must be in the future!");
    } else if (selectedTime < "10:30") {
      return setError("Not opened until 10:30AM!");
    } else if (selectedTime > "21:29") {
      return setError("Too soon to closing. Closed at 10:30PM!");
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
          .put(
            `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservation_id}`,
            {
              data: formData,
            }
          )
          .then(function (response) {
            history.push(`/dashboard?date=${formData.reservation_date}`);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ResForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      error={error}
      axiosError={reservationError}
    />
  );
}

export default EditReservationForm;
