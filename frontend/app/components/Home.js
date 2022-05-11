import React, { useEffect, useContext } from "react";
import Page from "./Page";
import StateContext from "../StateContext";

function Home() {
  const appState = useContext(StateContext);

  return (
    <Page title="Your Feed">
      <h2 className="text-center">
        Hello <strong>{appState.user.username}</strong>,
      </h2>
      <p className="lead text-muted text-center">
        Welcome TIP Kudos app. Here, you can check your kudos and recognitions
        from clients and leads onshore.
      </p>
    </Page>
  );
}

export default Home;
