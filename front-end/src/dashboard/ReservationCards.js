import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function ReservationCards({ reservations }) {
  const reservationCards = reservations.map((res, index) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            {res.first_name} {res.last_name}
          </Card.Title>
          <p> Mobile: {res.mobile_number}</p>
          <p>Reservation Time: {res.reservation_time}</p>
          <p>Party Size: {res.people}</p>
          <a href={`/reservations/${res.reservation_id}/seat`}>
            <Button>Seat</Button>
          </a>
        </Card.Body>
      </Card>
    );
  });

  return reservationCards;
}

export default ReservationCards;
