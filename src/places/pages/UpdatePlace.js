import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import './PlaceForm.css';

const UpdatePlace = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedPlace, setLoadedPlace] = useState();
	const placeId = useParams().placeId;

	const [formState, inputHandler, setFormData] = useForm({
		title: {
			value: '',
			isValid: false
		},
		description: {
			value: '',
			isValid: false
		}
	}, false);

	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const responseData = await sendRequest(`${process.env.REACT_APP_API_URL}/places/${placeId}`);
				setLoadedPlace(responseData.place);
				setFormData({
					title: {
						value: responseData.place.title,
						isValid: true
					},
					description: {
						value: responseData.place.description,
						isValid: true
					}
				}, true);
			} catch (err) { } // useHttpClient handles the error
		};
		fetchPlace();
	}, [sendRequest, placeId, setFormData]);

	const placeUpdateSubmitHandler = async event => {
		event.preventDefault();
		try {
			await sendRequest(
				`${process.env.REACT_APP_API_URL}/places/${placeId}`,
				'PATCH',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token
				}
			);
			navigate(`/${auth.userId}/places`);
		} catch (err) { }
	};

	if (isLoading) {
		return (
			<div className="center">
				<LoadingSpinner />
			</div>
		);
	}

	if (!loadedPlace && !error) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find place!</h2>
				</Card>
			</div>
		);
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{!isLoading && loadedPlace &&
				<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
					<Input
						id="title"
						element="input"
						type="text"
						label="Title"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a valid title."
						onInput={inputHandler}
						initialValue={formState.inputs.title.value}
						initialValid={formState.inputs.title.isValid}
					/>
					<Input
						id="description"
						element="textarea"
						label="Description"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid description."
						onInput={inputHandler}
						initialValue={formState.inputs.description.value}
						initialValid={formState.inputs.description.isValid}
					/>
					<Button upper type="submit" disabled={!formState.isValid}>Update Place</Button>
				</form>
			}
		</>
	)
};

export default UpdatePlace;