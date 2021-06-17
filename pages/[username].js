import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { baseUrl } from "../utils/baseUrl";
import { NoProfile } from "../components/Layout/NoData";
import axios from "axios";
import { Grid } from "semantic-ui-react";

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
  const [activeItem, setActiveItem] = useState("profile");
  const [loggedUserFollowStats, setLoggedUserFollowStats] = useState(
    userFollowStats
  );

  const ownAccount = profile.iser._id === user._id;

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

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  if (errorLoading) {
    return <NoProfile />;
  }

  return (
    <>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
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
