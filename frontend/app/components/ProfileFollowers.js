import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollowers() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: ourRequest.token
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem: " + err);
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link
            to={`/profile/${follower.username}`}
            key={index}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} />{" "}
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollowers;
