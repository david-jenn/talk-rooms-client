import InputField from './InputField';
import { useState } from 'react';
import _ from 'lodash';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function Register({onLogin}) {
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const emailError = !email ? 'Email is required' : !email.includes('@') ? 'Email must include @ sign' : '';

  const emailConfirmError = !emailConfirm ? 'Must Confirm Email' : email !== emailConfirm ? 'Emails Must Match' : '';

  const passwordError = !password
    ? 'Password is required'
    : password.length < 8
    ? 'Password must be at least 8 characters'
    : '';

  const passwordConfirmError = !passwordConfirm
    ? 'Must Confirm Password'
    : password !== passwordConfirm
    ? 'Password Must Match'
    : '';

  const displayNameError = !displayName ? 'Must enter a display name' : '';

  const shouldValidate = false;

  function onClickRegister(evt) {
    evt.preventDefault();
   
    if (emailError || emailConfirmError || passwordError || passwordConfirmError || displayNameError) {
      setError("Please fix the issues above")
      return;
    } 
    setPending(true);
    setError(null);

    axios(`${process.env.REACT_APP_API_URL}/api/user/register`, {method: 'post', data: {
      email, password, displayName
    }})
      .then((res) => {
        const authPayload = jwtDecode(res.data.token);

        const auth = {
          email,
          userId: res.data.userId,
          token: res.data.token,
          payload: authPayload,
        }
        setPending(false);
        onLogin(auth);
      })
      .catch((err) => {
        setPending(false);
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
          
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

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
  }

  return (
    <div>
      <h2>Register page</h2>
      <form className="row">
        <div className="col-md-6">
          <InputField
            label="Email"
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(evt) => onInputChange(evt, setEmail)}
            error={emailError}
            shouldValidate={shouldValidate || email}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Confirm Email"
            id="register-email-confirm"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={emailConfirm}
            onChange={(evt) => onInputChange(evt, setEmailConfirm)}
            error={emailError}
            shouldValidate={shouldValidate || email}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Password"
            id="register-password"
            type="password"
            autoComplete="current-password"
            placeholder=""
            value={password}
            onChange={(evt) => onInputChange(evt, setPassword)}
            error={passwordError}
            shouldValidate={shouldValidate || password}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Confirm Password"
            id="register-password-confirm"
            type="password"
            autoComplete="current-password"
            placeholder=""
            value={passwordConfirm}
            onChange={(evt) => onInputChange(evt, setPasswordConfirm)}
            error={passwordConfirmError}
            shouldValidate={shouldValidate || password}
          />
        </div>
        <div className="col-md-6">
          <InputField
            label="Display Name"
            id="register-display-name"
            type="text"
            autoComplete=""
            placeholder=""
            value={displayName}
            onChange={(evt) => onInputChange(evt, setDisplayName)}
            error={displayNameError}
            shouldValidate={shouldValidate || password}
          />
        </div>
        

        <div className="mb-3 d-flex flex-direction-column justify-content-between">
          <button type="submit" className="btn btn-primary" onClick={(evt) => onClickRegister(evt)}>
            Register
          </button>
          {pending && (
            <div>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="text-danger">{error}</div>
        </div>
      </form>
    </div>
  );
}

export default Register;
