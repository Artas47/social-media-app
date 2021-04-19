import React, { useEffect, useState, useRef } from "react";
import {
  FooterMessage,
  HeaderMessage,
} from "../components/Common/WelcomeMessage";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import { regexUserName } from "../utils/utils";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { registerUser } from "../utils/authUser";
import uploadPic from "../utils/uploadPicToCloudinary";

let cancel;

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });
  const { name, email, password, bio } = user;
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [media, setMedia] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      errorMsg !== null && setErrorMsg(null);
      if (res.data === "available") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      }
    } catch (error) {
      console.log(`error`, error);
      setErrorMsg("Username not available");
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    if (username === "") {
      setUsernameAvailable(false);
    } else {
      checkUsername();
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }
    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMsg("Error uploading image");
    }
    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const inputRef = useRef();

  return (
    <>
      <HeaderMessage />
      <Form
        onSubmit={handleSubmit}
        loading={formLoading}
        error={errorMsg !== null}
      >
        <Message
          error
          header="Oops!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
        <Segment>
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            media={media}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />
          <Form.Input
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            required
          />
          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
          />
          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            required
            type={showPassword ? "text" : "password"}
          />

          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            required
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (regexUserName.test(e.target.value)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            type="text"
          />
          <CommonInputs
            user={user}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
            handleChange={handleChange}
          />
          <Divider hidden />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default Signup;
