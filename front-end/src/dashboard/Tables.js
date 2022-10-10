import axios from "axios";
import React, { useEffect, useState } from "react";
import TableCards from "./TableCards";

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

  return <TableCards tables={tables} />;
}

export default Tables;
