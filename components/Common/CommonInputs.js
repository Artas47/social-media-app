import React from 'react';
import {Form, Button, Message, Segment, TextArea, Divider} from 'semantic-ui-react';


const CommonInputs = ({user:{bio, facebook, instagram, youtube, twitter}, handleChange, showSocialLinks, setShowSocialLinks}) => {
    return (
        <>
            <Form.Field 
                required 
                control={TextArea} 
                name='bio' 
                value={bio} 
                onChange={handleChange}
                placeholder='bio'
            />
            <Button 
                content='Add social links' 
                color='red' 
                icon='at' 
                type='button' 
                onClick={() => setShowSocialLinks(!showSocialLinks)}
            />
            {showSocialLinks && <>
            <Divider />
            <Form.Input 
                icon='facebook' 
                iconPosition='left'
                name="facebook"
                value={facebook}
                onChange={handleChange}
            />
            <Form.Input 
                icon='twitter' 
                iconPosition='left'
                name="twitter"
                value={twitter}
                onChange={handleChange}
            />
            <Form.Input 
                icon='instagram' 
                iconPosition='left'
                name="instagram"
                value={instagram}
                onChange={handleChange}
            />
            <Form.Input 
                icon='youtube' 
                iconPosition='left'
                name="youtube"
                value={youtube}
                onChange={handleChange}
            />
            </>}
        </>
    )
}

export default CommonInputs
