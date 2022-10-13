import axios from "axios";
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function TableCards({ tables }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  const handleClick = async (event) => {
    event.preventDefault();

    const tableId = event.target.dataset.tableIdFinish;
    const resId = event.target.value;

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/tables/${tableId}/seat`
        );

        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/reservations/${resId}/status`,
          {
            data: { status: "finished" },
          }
        );
        history.go(0);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
  };

  return tables.map((table, index) => {
    return (
      <div key={table.table_id}>
        {table.reservation_id !== null ? (
          <Card className="bg-danger">
            <Card.Body>
              <Card.Title>Table {table.table_name}</Card.Title>
              <p> Capacity {table.capacity}</p>
              <p data-table-id-status={table.table_id}>Occupied</p>
            </Card.Body>
            <button
              type="button"
              onClick={handleClick}
              data-table-id-finish={table.table_id}
              value={table.reservation_id}
            >
              Finished
            </button>
          </Card>
        ) : (
          <Card className="bg-success">
            <Card.Body>
              <Card.Title>Table {table.table_name}</Card.Title>
              <p> Capacity {table.capacity}</p>
              <p data-table-id-status={table.table_id}>Free</p>
            </Card.Body>
            <button
              type="button"
              onClick={handleClick}
              data-table-id-finish={table.table_id}
              value={table.table_id}
            >
              Finished
            </button>
          </Card>
        )}
        <ErrorAlert error={error} />
      </div>
    );
  });
}

export default TableCards;
