import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import './Nav.css'
import Or from '../Or/Or'



const Nav = () => {
  const token = document.cookie.includes('authToken')
  const nav = useNavigate()


    const handleLogout = () => {

      axios({
        method: 'get',
        url: "http://localhost:3002/api/users/logout",
      })
      .then(res => {
        document.cookie = 'authToken=; Max-Age=0'
        nav('/login')
      })
      .catch(error => {
        console.log('Logout Failed', error)
      })
    }






  return (
     <nav>

{token ? (
  <>
  
  <Link to='/notes'>Notes</Link>
  
  <button onClick={handleLogout}>Logout</button>
  
  </>
) : (

  <>
  <div className='Continer'>

<br />
<br />
<br />
  {/* <Link to='/login'>Login </Link> */}
  <Link to='/login2'>Login </Link>

<br />
<br />

  <Link to='/reg'>Register</Link>
  
  <br />
  <br />
  <br />
  <Or />
  </div>
  </>
)}

</nav> 

  )
}

export default Nav