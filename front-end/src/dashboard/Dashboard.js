import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useHistory, useLocation } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import ReservationCards from "./ReservationCards";

/**
 * * - Important information
 * ! - This isn't working
 * ? - I have a question about this
 * TODO - Needs completed
 */

/**
 * Defines the dashboard page.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const { search } = useLocation();
  const history = useHistory();

  /* 
  ? I want my page to render based on the date in the query string 
  ? but want it to be current day by default if no query is provided. 
  ? The only reason this dashboard is rendering correctly is because 
  ? it renders each time the date changes. The way i"m currently doing 
  ? this seems expensive.
  */

  //sets init to be either the query string or the current date
  const initDate = search ? new URLSearchParams(search).get("date") : today();

  /*
  ! Currently component really only works because of this here, dashboard 
  ! button will not render the page correctly without this if I try to go
  ! to it after going to a previous or next date
  */

  setDate(initDate);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(getReservations, [date]);

  /*
  * Component was originally rendered using this provided function
  *
  *function loadDashboard() {
  * console.log("load");
  *  const abortController = new AbortController();
  *  setReservationsError(null);
  *  listReservations(date, abortController.signal)
  *    .then(setReservations)
  *    .catch(setReservationsError);
  *  return () => abortController.abort();
  }
*/

  async function getReservations() {
    await axios
      .get(`http://localhost:5001/reservations?date=${date}`)
      .then((response) => {
        return setReservations(response.data.data);
      })
      .catch((e) => console.log(e));
  }

  /*
  ? I dont feel like I need to push to history and setDate for this page 
  ? to rerender. Shouldn't the routing handle it if there is a query string
  ? or not?
  */
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
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
