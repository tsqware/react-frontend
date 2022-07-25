import React from "react";
import { useParams } from "react-router-dom";
import { placeData } from "../components/placeData";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = placeData;

const UserPlaces = () => {
	const { userId } = useParams();
	const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

	return (
		<PlaceList items={loadedPlaces} />
	)
}

export default UserPlaces;