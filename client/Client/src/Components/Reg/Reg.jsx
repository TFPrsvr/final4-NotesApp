import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Reg.css'

const Reg = () => {
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    username: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const [reg, setReg] = useState(null)


  
  const handleRegister = () => {
    setReg(!reg)
}

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    axios({
      method: 'post',
      url: "http://localhost:3002/api/users/register",
      data: formData,
      withCredentials: true,   
    })
    .then(res => {
       console.log('reg res', res.data)
       nav('/login2')
      })
    .catch(error => {
      console.log('registration error', error.response || error.message)
    setError(error.response?.data?.msg || 'Registration failed')
       })
  }

  const handleTestReg = (e) => {
    e.preventDefault()


    axios({
      method: 'get',
      url: "http://localhost:3002/api/testReg",
    })
    .then((res) => {
      console.log("testReg res", res.data)
      res.json({msg: "testReg successful", testReg})
    })
    .catch(err => {
      console.log('testReg error', err.response || err.message)
    })
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   axios({
  //       method: 'post',
  //       url: "http://localhost:3002/api/register",
  //       data: { first, last, username, email, password }
  //   })
  //     .then((res) => {
  //       alert("Registration successful!");
  //       nav("/login");
  //     })
  //     .catch((err) => {
  //       alert("Error registering: " + err.response.data);
          //  setReg(!reg)
  //     });
  // };

  const handleLogin = () => {
    nav("/login2")
  }

  return (
<>
   
      <div id='regComp'>
        {console.log('registration:', formData)}
      <h2>Register</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
      {/* <form onSubmit={handleTestReg}> */}
    
      <input
          type="text"
          placeholder="First Name"
          name='first'
          onChange={handleChange}
          required
          /> 
      
        <input
          type="text"
          name='last'
          placeholder="Last Name"
          required
          onChange={handleChange}
          />
          
        <input
        type="email"
        placeholder="Email"
        name='email'
        required
        onChange={handleChange}
        />
        
        <input
        type="text"
        placeholder="Username"
        name= 'username'
        required
        onChange={handleChange}
        />
        
        
        <input
          type="password"
          placeholder="Password"
          name= 'password'
          onChange={handleChange}
          required
          />
         


        <button type="submit">Register</button>

      </form>
    </div>

    <div id="loginInstead">
      If Already A Registered User 
      <br />
      <br />
      <button onClick={() => handleLogin()}>Login</button>
    </div>
   
  </>
  );
};

export default Reg;
