import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useCallback, useState } from "react";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(false);

	const login = useCallback((uid) => {
		setIsLoggedIn(true);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;

	if (isLoggedIn) {
		routes = (
			<React.Fragment>
				<Route path="/" exact element={<Users />}>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
				<Route path="/:userId/places" exact element={<UserPlaces />} />
				<Route path="/places/:placeId" element={<UpdatePlace />} />
				<Route path="/places/new" element={<NewPlace />} />
			</React.Fragment>
		);
	} else {
		routes = (
			<React.Fragment>
				<Route path="/" exact element={<Users />}>
					<Route path="*" element={<Navigate to="/auth" replace />} />
				</Route>
				<Route path="/:userId/places" exact element={<UserPlaces />} />
				<Route path="/auth" element={<Auth />} />
			</React.Fragment>
		);
	}

	return (
		<AuthContext.Provider value={{
			isLoggedIn: isLoggedIn,
			userId: userId,
			login: login,
			logout: logout
		}}>
			<Router>
				<MainNavigation />
				<main>
					<Routes>
						{routes}
					</Routes>
				</main>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
