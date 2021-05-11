import React, { useRef, useState } from "react";
import { Form, Message, Image, Icon, Divider, Button } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";

const CreatePost = ({ user, setPosts }) => {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error uploading image");
      }
    }
    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  const addStyles = () => ({
    textAlign: "center",
    height: "150px",
    width: "150px",
    border: "dotted",
    paddingTop: media === null && "60px",
    cursor: "pointer",
    borderColor: highlighted ? "green" : "black",
  });

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />
        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder="Whats happening?"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add location"
            icon="map marker alternate"
            placeholder="Want to add location?"
          />
          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image"
          />
        </Form.Group>

        <div
          onClick={() => inputRef.current.click()}
          onDrag={(e) => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(true);
            const droppedFile = Array.from(e.dataTransfer.files);
            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
          style={addStyles()}
        >
          {media === null ? (
            <Icon name="plus" size="big" />
          ) : (
            <>
              <Image
                src={mediaPreview}
                style={{ height: "150px", width: "150px" }}
                alt="PostImage"
                centered
                size="medium"
              />
            </>
          )}
        </div>
        <Divider hidden />
        <Button
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          loading={loading}
          icon="send"
          style={{ backgroundColor: "#1DA1F2", color: "#fff" }}
        />
      </Form>
      <Divider />
    </>
  );
};

export default CreatePost;
