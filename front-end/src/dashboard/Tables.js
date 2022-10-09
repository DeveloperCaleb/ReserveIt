import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Tables() {
  const history = useHistory();
  const [tables, setTables] = useState([]);

  useEffect(() => {
    async function getTables() {
      try {
        await axios
          .get(`http://localhost:5001/tables`)
          .then((response) => setTables(response.data.data));
      } catch (e) {
        console.error(e);
      }
    }
    getTables();
  }, []);

  const handleClick = async (event) => {
    event.preventDefault();

    const tableId = event.target.value;

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5001/tables/${tableId}/seat`);
        history.go(0);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tableCards = tables.map((table, index) => {
    return (
      <div>
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
              value={table.table_id}
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
      </div>
    );
  });

  return tableCards;
}

export default Tables;
