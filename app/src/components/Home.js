import React from "react";
import { NavLink } from "react-router-dom";

import AddUser from "./AddUser";

const Home = props => {
    const { users, setUsers } = props;

    return(
        <>
            {users && users.map(user => {
                return <h2 key={user.id} >{user.name}</h2>
            })}
            <AddUser users={users} setUsers={setUsers} />
        </>
    )
}

export default Home;