import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import './PlaceForm.css';

const NewPlace = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm({
		title: {
			value: '',
			isValid: false
		},
		description: {
			value: '',
			isValid: false
		},
		address: {
			value: '',
			isValid: false
		},
		image: {
			value: '',
			isValid: false
		}
	}, false);

	const navigate = useNavigate();

	const placeSubmitHandler = async event => {
		event.preventDefault();
		try {
			await sendRequest(
				'http://localhost:5001/api/places',
				'POST',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
					address: formState.inputs.address.value,
					image: formState.inputs.image.value,
					creator: auth.userId
				}),
				{ 'Content-Type': 'application/json' }
			);
			navigate('/');
		} catch (err) { }
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<form className="place-form" onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id="title"
					name="title"
					element="input"
					type="text"
					label="Title"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid title."
					onInput={inputHandler}
				/>
				<Input
					id="description"
					name="description"
					element="textarea"
					label="Description"
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid description."
					onInput={inputHandler}
				/>
				<Input
					id="address"
					name="address"
					element="textarea"
					label="Address"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid address."
					onInput={inputHandler}
				/>
				<Input
					id="image"
					element="input"
					label="Image URL"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter an image URL."
					onInput={inputHandler}
				/>
				<Button upper type="submit" disabled={!formState.isValid}>Add Place</Button>
			</form>
		</>
	)
};

export default NewPlace;