import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import './PlaceForm.css';


const NewPlace = () => {
	const auth = useContext(AuthContext);
	console.log("auth:", auth);
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
			value: null,
			isValid: false
		}
	}, false);

	const navigate = useNavigate();

	const placeSubmitHandler = async event => {
		event.preventDefault();


		/*for (const pair of formData.entries()) {
			console.log(`${pair[0]}, ${pair[1]}`);
		}*/

		try {
			const formData = new FormData();
			formData.append('title', formState.inputs.title.value);
			formData.append('description', formState.inputs.description.value);
			formData.append('address', formState.inputs.address.value);
			formData.append('image', formState.inputs.image.value);
			formData.append('creator', auth.userId);

			console.log("token:", auth.token);

			await sendRequest(
				'http://localhost:5001/api/places',
				'POST',
				formData,
				{ Authorization: 'Bearer ' + auth.token }
			);
			navigate('/');
		} catch (err) { console.log("save place err:", err); }
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

				<ImageUpload
					center
					id="image"
					onInput={inputHandler}
					errorText="Please provide an image." />

				<Button upper type="submit" disabled={!formState.isValid}>Add Place</Button>
			</form>
		</>
	)
};

export default NewPlace;