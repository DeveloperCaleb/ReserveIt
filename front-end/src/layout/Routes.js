import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import EditReservationForm from "../edit-reservation/EditReservationForm";
import ReservationForm from "../new-reservations/ReservationForm";
import TableForm from "../new-table/TableForm";
import SearchForm from "../search/SearchForm";
import SeatingForm from "../seating/SeatingForm";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatingForm />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservationForm />
      </Route>
      <Route path="/search">
        <SearchForm />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
