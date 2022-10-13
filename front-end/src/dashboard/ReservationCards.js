import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationCards({ reservations }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  const handleClick = async ({ target }) => {
    const reservation_id = target.value;
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
        history.go(0);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
  };
  const reservationCards = reservations.map((res, index) => {
    return (
      <Card key={res.reservation_id}>
        {res.status !== "finished" && res.status !== "cancelled" ? (
          <Card.Body>
            <Card.Title>
              {res.first_name} {res.last_name}
            </Card.Title>
            <p> Mobile: {res.mobile_number}</p>
            <p>Reservation Time: {res.reservation_time}</p>
            <p>Party Size: {res.people}</p>
            <p data-reservation-id-status={res.reservation_id}>{res.status}</p>
            {res.status !== "seated" ? (
              <a href={`/reservations/${res.reservation_id}/seat`}>
                <Button>Seat</Button>
              </a>
            ) : (
              <></>
            )}
            <br />
            <a href={`/reservations/${res.reservation_id}/edit`}>
              <Button>Edit</Button>
            </a>
            <br />
            <Button
              value={res.reservation_id}
              onClick={handleClick}
              data-reservation-id-cancel={res.reservation_id}
            >
              Cancel reservation
            </Button>
          </Card.Body>
        ) : (
          <></>
        )}
      </Card>
    );
  });

  return (
    <div>
      {reservationCards}
      <ErrorAlert error={error} />
    </div>
  );
}

export default ReservationCards;
