import React, {useState, useEffect, useRef} from 'react'
import { FooterMessage, HeaderMessage } from '../components/Common/WelcomeMessage'
import {Form, Button, Message, Segment, TextArea, Divider} from 'semantic-ui-react';
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
        facebook: '',
        youtube: '',
        twitter: '',
        instagram: ''
    });

    const {name, email, password, bio} = user;

    const [showSocialLink, setSocialLinks] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmit = e => e.preventDefault();

    const handleChange = (e) => {
        const {name, value} = e.target;

        setUser(prev => ({...prev, [name]: value}));
    };

    return (
        <>
            <HeaderMessage />
            <Form onSubmit={handleSubmit} loading={formLoading} error={errorMsg !== null}>
            <Message error header='Oops!' content={errorMsg} onDismiss={()=>setErrorMsg(null)} />
            <Segment>
                <Form.Input 
                    label="Name" 
                    placeholder='Name'
                    name='name' 
                    value={name} 
                    onChange={handleChange} 
                    fluid 
                    icon='user' 
                    iconPosition='left' 
                    required
                />
                <Form.Input 
                    required
                    label="Email" 
                    placeholder='Email'
                    name='email' 
                    value={email} 
                    onChange={handleChange} 
                    fluid 
                    icon='envelope' 
                    iconPosition='left' 
                    type='email'
                />
                <Form.Input 
                    label="Password" 
                    placeholder='Password'
                    name='password' 
                    value={password} 
                    onChange={handleChange} 
                    fluid 
                    icon={{
                        name: 'eye',
                        circular: true,
                        link: true,
                        onClick: () => setShowPassword(!showPassword)
                    }}
                    iconPosition='left' 
                    required
                    type={showPassword ? 'text' : 'password'}
                />

                <Form.Input 
                    loading={usernameLoading}
                    error={!usernameAvailable}
                    required
                    label="Username" 
                    placeholder='Username'
                    value={username} 
                    onChange={e => {
                        setUsername(e.target.value);
                        if(regexUserName.test(e.target.value)){
                            setUsernameAvailable(true);
                        } else {
                            setUsernameAvailable(false);
                        }
                    }} 
                    fluid 
                    icon={usernameAvailable ? 'check': 'close'}
                    iconPosition='left' 
                    type='email'
                />
            </Segment>
            </Form>
            <FooterMessage />
        </>
    )
}

export default Signup
