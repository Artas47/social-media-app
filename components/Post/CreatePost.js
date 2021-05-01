import React, { useRef, useState } from "react";
import { Form } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";

const CreatePost = ({user, setPosts}) => {
    const [newPost, setNewPost] = useState({text: '', location: ''})
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const [error, setError] = useState(null);
    const [highlighted, setHighlighted] = useState(false);
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
     
    const handleChange = e => {
        const {name, value, files} = e.target;

        if(name === 'media'){
            setMedia(files[0]);
            setMediaPreview(URL.createObjectURL(files[0]))
        }
        setNewPost(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }
  return <>
  <Form error={error !== null} onSubmit={handleSubmit}>
    <Message error onDismiss={() => setError(null)} content={error} header='Oops!'/>
    <Form.Group>
        <Image src={user.profilePicUrl} circular avatar inline />
        <Form.TextArea placeholder='Whats happening?' name='text' value={newPost.text} onChange={handleChange} rows={4} width={14}/>
    </Form.Group>
  </Form>
  </>;
};

export default CreatePost;
