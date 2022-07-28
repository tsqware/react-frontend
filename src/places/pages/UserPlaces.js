import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
	const { userId } = useParams();
	const [loadedPlaces, setLoadedPlaces] = useState([]);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	useEffect(() => {
		const fetchUserPlaces = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:5001/api/places/user/${userId}`);
				setLoadedPlaces(responseData.places);
			} catch (err) { }
		};
		fetchUserPlaces();
	}, [sendRequest, userId]);

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <div className="center"><LoadingSpinner /></div>}
			{!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
		</>
	)
}

export default UserPlaces;