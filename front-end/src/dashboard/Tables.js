import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";

function Tables() {
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
          </Card>
        ) : (
          <Card className="bg-success">
            <Card.Body>
              <Card.Title>Table {table.table_name}</Card.Title>
              <p> Capacity {table.capacity}</p>
              <p data-table-id-status={table.table_id}>Free</p>
            </Card.Body>
          </Card>
        )}
      </div>
    );
  });

  return tableCards;
}

export default Tables;
