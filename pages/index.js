import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/Layout/NoData";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { Segment } from "semantic-ui-react";
import { baseUrl } from "../utils/baseUrl";
import { PostDeleteToastr } from "../components/Layout/Toastr";

const Index = ({ user, postsData, errorLoading }) => {
  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  const [showToastr, setShowToastr] = useState(false);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const [posts, setPosts] = useState(postsData);

  if (posts?.length === 0 || errorLoading) {
    return <NoPosts />;
  }

  return (
    <>
      {showToastr && <PostDeleteToastr />}
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
    </>
  );
};

Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
    });
    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Index;
