import React, { useState } from 'react';
import styled from 'styled-components';
import { app } from '../Firebase';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth} from 'firebase/auth'
import {useNavigate} from 'react-router-dom' 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const auth = getAuth(app);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login data:', { email: formData.email, password: formData.password });
      signInWithEmailAndPassword(auth, formData.email, formData.password)
      navigate('/todo')
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Signup data:', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
      navigate('/todo')
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthTabs>
          <AuthTab active={isLogin} onClick={() => setIsLogin(true)}>
            Login
          </AuthTab>
          <AuthTab active={!isLogin} onClick={() => setIsLogin(false)}>
            Sign Up
          </AuthTab>
        </AuthTabs>

        <AuthForm onSubmit={handleSubmit}>
          {!isLogin && (
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </FormGroup>

          {!isLogin && (
            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </FormGroup>
          )}

          <SubmitButton type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </SubmitButton>
        </AuthForm>

        <AuthFooter>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <AuthLink onClick={() => setIsLogin(false)}>Sign Up</AuthLink>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <AuthLink onClick={() => setIsLogin(true)}>Login</AuthLink>
            </>
          )}
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
};

// Styled Components
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
`;

const AuthTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
`;

const AuthTab = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  background: ${props => props.active ? '#ffffff' : '#f5f5f5'};
  color: ${props => props.active ? '#764ba2' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover {
    background: ${props => props.active ? '#ffffff' : '#f0f0f0'};
  }
`;

const AuthForm = styled.form`
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s ease;

  &:focus {
    border-color: #764ba2;
    outline: none;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  color: #666;
  font-size: 14px;
`;

const AuthLink = styled.span`
  color: #764ba2;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
    text-decoration: underline;
  }
`;

export default AuthPage;