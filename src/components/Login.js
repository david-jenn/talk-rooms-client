import { useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';
import InputField from './InputField';


function Login({onLogin}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, setPending] = useState(false);

  const shouldValidate = false;

  const emailError = !email ? 'Email is required' : !email.includes('@') ? 'Email must include @ sign' : '';

  const passwordError = !password
    ? 'Password is required'
    : password.length < 8
    ? 'Password must be at least 8 characters'
    : '';


  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    console.log(newValue);
  }

  function onClickSubmit(evt) {
    evt.preventDefault();

    setError('');
    setSuccess('');
    setPending(true);
    console.log(process.env.REACT_APP_API_URL)
    axios(`${process.env.REACT_APP_API_URL}/api/user/login`, { method: 'post', data: {email, password}})
      .then((res) => {
        setPending(false);
        setSuccess(res.data.message);
        const authPayload = jwtDecode(res.data.token);
        console.log(authPayload);
        const auth = {
          email,
          userId: res.data.userId,
          token: res.data.token,
          payload: authPayload,
        };
        onLogin(auth);

      })
      .catch((err) => {
        console.error(err);
        setPending(false);
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
            console.log(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x) => <div>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      })
    
  }


  return (
    <div className="login">
    <h1>Login</h1>
    <form>
      <InputField
        label="Email"
        id="LoginForm-email"
        
        type="email"
        autoComplete="email"
        placeholder=""
        value={email}
        onChange={(evt) => onInputChange(evt, setEmail)}
        error={emailError}
        shouldValidate={shouldValidate || email}
      />
      <InputField
        label="Password"
        id="LoginForm-password"
      
        type="password"
        autoComplete="current-password"
        placeholder=""
        value={password}
        onChange={(evt) => onInputChange(evt, setPassword)}
        error={passwordError}
        shouldValidate={shouldValidate || password}
      />
      

      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex flex-direction-column">
          <button className="btn btn-primary me-3" type="submit" onClick={(evt) => onClickSubmit(evt)} >
           
            Log In
          </button>
          {pending && (
            <div>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
        {/* <div>
          <div>Don't have an account?</div>
          <Link to="/register">Register</Link>
        </div> */}
        
      </div>

      {error && <div className="mb-3 text-danger">{error}</div>}
      {success && <div className="mb-3 text-success">{success}</div>}
    </form>
  </div>
  )
}

export default Login;