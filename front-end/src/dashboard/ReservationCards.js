import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ReservationCards({ reservations }) {
  const reservationCards = reservations.map((res, index) => {
    return (
      <Card key={res.reservation_id}>
        {res.status !== "finished" ? (
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
          </Card.Body>
        ) : (
          <></>
        )}
      </Card>
    );
  });

  return reservationCards;
}

export default ReservationCards;
