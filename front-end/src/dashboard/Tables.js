import axios from "axios";
import React, { useEffect, useState } from "react";
import TableCards from "./TableCards";
import ErrorAlert from "../layout/ErrorAlert";

function Tables() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function getTables() {
      try {
        await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/tables`, {
            signal: abortController.signal,
          })
          .then((response) => setTables(response.data.data));
      } catch (e) {
        console.error(e);
        setError(e);
      }
    }
    getTables();
    return () => {
      abortController.abort(); // Cancels any pending request or response
    };
  }, []);

  return (
    <div>
      <TableCards tables={tables} />
      <ErrorAlert error={error} />
    </div>
  );
}

export default Tables;
