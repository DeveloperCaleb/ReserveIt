import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useHistory, useLocation } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import ReservationCards from "./ReservationCards";
import Tables from "./Tables";

/**
 * Defines the dashboard page.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { search } = useLocation();
  const history = useHistory();

  //sets init to be either the query string or the current date
  const initDate = search ? new URLSearchParams(search).get("date") : today();
  const [date, setDate] = useState(initDate);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function getReservations() {
      try {
        await axios
          .get(`http://localhost:5001/reservations?date=${date}`, {
            signal: abortController.signal,
          })
          .then((response) => {
            return setReservations(response.data.data);
          });
      } catch (e) {
        console.error(e);
        setReservationsError("Unable to get reservations");
      }
    }

    getReservations();
    return () => {
      abortController.abort(); // Cancels any pending request or response
    };
  }, [date]);

  const prevOnClick = (event) => {
    event.preventDefault();
    const previousDate = previous(date);
    history.push(`/dashboard?date=${previousDate}`);
    return setDate(previousDate);
  };

  const nextOnClick = (event) => {
    event.preventDefault();
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`);
    return setDate(nextDate);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <Button variant="outline-secondary" onClick={prevOnClick}>
          Previous
        </Button>
        <Button variant="outline-secondary" onClick={nextOnClick}>
          Next
        </Button>
      </div>
      {reservations.length > 0 ? (
        <ReservationCards reservations={reservations} />
      ) : (
        "No Reservations"
      )}
      <h4>Tables</h4>
      <Tables />
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
