import React, { useState } from "react";
import { Form } from "semantic-ui-react";
import { postComment } from "../../utils/postActions";

const CommentInputField = ({ user, postId, setComments }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  {
    postComment;
  }
  return (
    <Form
      reply
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        await postComment(postId, user, text, setComments, setText);
        setLoading(false);
      }}
    >
      <Form.Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add comment"
        action={{
          color: "blue",
          icon: "edit",
          loading: loading,
          disabled: text === "" || loading,
        }}
      ></Form.Input>
    </Form>
  );
};

export default CommentInputField;
