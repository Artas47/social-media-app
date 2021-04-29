import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/Layout/NoData";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { Segment } from "semantic-ui-react";

const Index = ({ user, postsData, errorLoading }) => {
  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);
  console.log(`postsData`, postsData);
  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);

  if (posts?.length === 0 || errorLoading) {
    return <NoPosts />;
  }

  return (
    <Segment>
      <CreatePost user={user} setPosts={setPosts} />
      {posts.map((post) => {
        return (
          <CardPost
            key={post._id}
            post={post}
            user={user}
            setPosts={setPosts}
            setShowToastr={setShowToastr}
          />
        );
      })}
    </Segment>
  );
};

Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
    });
    console.log(`res`, res);
    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Index;
