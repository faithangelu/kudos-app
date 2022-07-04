import React, { useEffect, useContext } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post("/getHomeFeed", {
          token: appState.user.token,
          cancelToken: ourRequest.token
        });
        setState(draft => {
          (draft.isLoading = false), (draft.feed = response.data);
        });
      } catch (err) {
        console.log("There was a problem: " + err);
      }
    }

    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center ">The Latest from those you follow</h2>
          <div className="list-group">
            {state.feed.map(post => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>,
          </h2>
          <p className="lead text-muted text-center">
            Welcome TIP Kudos app. Here, you can check your kudos and
            recognitions from clients and leads onshore.
          </p>
        </>
      )}
    </Page>
  );
}

export default Home;
