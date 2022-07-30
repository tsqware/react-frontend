import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useCallback, useState, useEffect } from "react";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

const App = () => {
	const [token, setToken] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();
	const [userId, setUserId] = useState(false);

	const login = useCallback((uid, token, expirationDate) => {
		setToken(token);
		setUserId(uid);
		const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		localStorage.setItem(
			'userData',
			JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);
		setTokenExpirationDate(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
			login(storedData.userId, storedData.token, new Date(storedData.expiration));
		}
	}, [login]);

	let routes;

	if (token) {
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
			isLoggedIn: !!token,
			token: token,
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
