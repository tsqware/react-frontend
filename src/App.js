import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));



const App = () => {
	const { token, login, logout, userId } = useAuth();

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
					<Suspense fallback={<div className="center"><LoadingSpinner /></div>}>
						<Routes>{routes}</Routes>
					</Suspense>
				</main>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
