import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function ProfilePosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token
        });
        setPosts(response.data);
        setIsLoading(false);
        console.log(username);
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
      {posts.map(post => {
        return <Post noAuthor={true} key={post._id} post={post} />;
      })}
    </div>
  );
}

export default ProfilePosts;
