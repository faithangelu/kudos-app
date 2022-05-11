import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoops, we can't find that page</h2>
        <p className="lead text-muted">
          Please visit this page to navigate to <Link to="/">Homepage</Link>{" "}
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
