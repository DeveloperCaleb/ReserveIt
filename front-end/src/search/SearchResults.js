import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function SearchResults({ searchResults }) {
  return searchResults.map((result) => {
    return (
      <div>
        <Card>
          <Card.Body>
            <Card.Title>
              {result.first_name} {result.last_name}
            </Card.Title>
            <p> Mobile: {result.mobile_number}</p>
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
          </Card.Body>
        </Card>
      </div>
    );
  });
}

export default SearchResults;
