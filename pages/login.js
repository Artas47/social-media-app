import React, {useState, useEffect} from 'react';
import {HeaderMessage, FooterMessage} from '../components/Common/WelcomeMessage';
import {Form, Button, Message, Segment, Divider} from 'semantic-ui-react';

const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setUser(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const {email, password} = user;

    useEffect(() => {
        const isUser = Object.values({email,password}).every(item =>Boolean(item));  
        isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
    }, [user])

    return (
        <>
            <HeaderMessage />
            <Form onSubmit={handleSubmit} loading={formLoading} error={errorMsg !== null}>
            <Message error header='Oops!' content={errorMsg} onDismiss={()=>setErrorMsg(null)} />
            <Segment>
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
                <Divider hidden />
                <Button icon='signup' content='Login' type='submit' color='orange' disabled={submitDisabled} />
            </Segment>
            </Form>
            <FooterMessage />
        </>
    )
}

export default Login
