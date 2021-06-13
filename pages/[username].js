import React from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;

  return <div> HII {username}</div>;
};

export default ProfilePage;
