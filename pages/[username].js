import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { baseUrl } from "../utils/baseUrl";
import { NoProfile } from "../components/Layout/NoData";
import axios from "axios";

const ProfilePage = ({
  profile,
  followersLength,
  followingLength,
  errorLoading,
  user,
  userFollowStats,
}) => {
  const router = useRouter();
  const { username } = router.query;
  const [posts, setPosts] = useState([]);

  if (errorLoading) {
    return <NoProfile />;
  }

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { username } = router.query;
        const token = cookie.get("token");

        const res = await axios.get(
          `${baseUrl}/api/profile/posts/${username}`,
          { headers: { Authorization: token } }
        );

        setPosts(res.data);
      } catch (error) {
        alert("Error loading posts");
      }
      setLoading(false);
    };
    getPosts();
  }, []);

  return <div> HII {username}</div>;
};

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token },
    });
    const { profile, followersLength, followingLength } = res.data;

    return { profile, followersLength, followingLength };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default ProfilePage;
