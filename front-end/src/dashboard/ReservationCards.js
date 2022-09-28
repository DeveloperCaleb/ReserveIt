import React from "react";
import Card from "react-bootstrap/Card";

function ReservationCards({ reservations }) {
  // console.log("res", reservations.reservations[0].first_name);
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
        </Card.Body>
      </Card>
    );
  });

  return reservationCards;
}

export default ReservationCards;
