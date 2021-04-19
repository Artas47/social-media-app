import React from "react";
import axios from "axios";

const Index = ({ posts }) => {
  return (
    <div>
      {posts && posts.length > 0 && posts.map((post) => <h1>{post.title}Z</h1>)}
    </div>
  );
};

Index.getInitialProps = async (ctx) => {
  try {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const { name } = ctx.query;
    return { posts: res.data };
  } catch (err) {}
};

export default Index;
