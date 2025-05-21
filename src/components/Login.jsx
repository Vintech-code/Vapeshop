import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/login', {
        username: username.trim(),
        password: password.trim(),
      });

      const { token, role } = response.data;

      // Save token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'cashier') {
        navigate('/poscashier');
      } else {
        setErrorMsg('Unauthorized role');
      }
    } catch (error) {
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <LoginContainer>
      <Overlay />
      <LoginFormContainer>
        <Logo>Login</Logo>
        <Subtitle>Sign in to continue</Subtitle>
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
        <form onSubmit={handleLogin}>
          <InputLabel>Username</InputLabel>
          <InputField
            type="text"
            placeholder="Enter 'admin' or 'cashier'"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
          />

          <InputLabel>Password</InputLabel>
          <PasswordContainer>
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
            />
            <TogglePassword onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </TogglePassword>
          </PasswordContainer>

          <LoginButton type="submit">Log In</LoginButton>
        </form>

        <Divider />
      </LoginFormContainer>
    </LoginContainer>
  );
};

export default LoginPage;

const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  background-image: url('/background1.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  justify-content: center; // <-- center horizontally
  align-items: center;     // <-- center vertically
  position: relative;
`;


const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const LoginFormContainer = styled.div`
  position: relative;
  z-index: 2;
  background-color: #ffffffee;
  padding: 30px 35px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 340px;
  text-align: left;
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 22px;
`;

const ErrorText = styled.p`
  color: red;
  margin-bottom: 10px;
  font-size: 13px;
`;

const InputLabel = styled.label`
  font-size: 13px;
  color: #333;
  font-weight: 500;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px 14px;
  margin: 8px 0 18px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: 0.3s;

  &:focus {
    border-color: #1a73e8;
    outline: none;
    background-color: #fff;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const TogglePassword = styled.span`
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 12px;
  cursor: pointer;
  color: #1a73e8;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #1a73e8;
  color: white;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.3s;

  &:hover {
    background-color: #155ab6;
  }
`;

const Extras = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin: -8px 0 18px 0;
  color: #555;

  a {
    text-decoration: none;
    color: #1a73e8;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #ddd;
  margin: 18px 0;
`;

const OtherOptions = styled.div`
  text-align: center;
  font-size: 13px;

  a {
    color: #1a73e8;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: #155ab6;
      text-decoration: underline;
    }
  }
`;
