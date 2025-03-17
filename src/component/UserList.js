import React, { useState } from 'react'
import axios from 'axios'

const UserList = () => {

    const [users, setUsers] = useState([])

    const fetchUserData = async (req, res) => {
        const usersData = axios.get("https://jsonplaceholder.typicode.com/users")
        console.log("+++++",usersData);
        setUsers(usersData)
        console.log("-----", users);
        
    }
    return (
        <>
            <div>UserList</div>
            <button onClick={fetchUserData}>Fetch</button>
        </>
    )
}

export default UserList