import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
	const USERS = [
		{
			id: 'u1',
			name: 'Steve Jackson',
			image: '../../../images/avatar-da36a2457cb7886597ec530a912d71cf.jpg',
			places: 3
		}
	];
	return <UsersList items={USERS} />;
}

export default Users;