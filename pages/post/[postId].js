import React from "react";
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  return <div>{router.query.postId}</div>;
};

export default Post;
