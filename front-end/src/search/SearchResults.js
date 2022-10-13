import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

function SearchResults({ searchResults }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  const searchResultCards = searchResults.map((result) => {
    const handleClick = async ({ target }) => {
      const reservation_id = target.value[0];

      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        try {
          await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/reservations/${reservation_id}/status`,
            {
              data: { status: "cancelled" },
            }
          );
          history.push(`/dashboard?date=${result.reservation_date}`);
        } catch (error) {
          console.error(error);
          setError(error);
        }
      }
    };

    return (
      <div>
        <Card>
          <Card.Body>
            <Card.Title>
              {result.first_name} {result.last_name}
            </Card.Title>
            <p> Mobile: {result.mobile_number}</p>
            <p>Reservation Date: {result.reservation_date}</p>
            <p>Reservation Time: {result.reservation_time}</p>
            <p>Party Size: {result.people}</p>
            <p>{result.status}</p>
            {result.status !== "seated" ? (
              <a href={`/reservations/${result.reservation_id}/seat`}>
                <Button>Seat</Button>
              </a>
            ) : (
              <></>
            )}
            <br />
            <a href={`/reservations/${result.reservation_id}/edit`}>
              <Button>Edit</Button>
            </a>
            <br />
            <Button
              value={(result.reservation_id, result.reservation_date)}
              onClick={handleClick}
              data-reservation-id-cancel={result.reservation_id}
            >
              Cancel reservation
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  });

  return (
    <div>
      {searchResultCards}
      <ErrorAlert error={error} />
    </div>
  );
}

export default SearchResults;
