import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState()

	const [formState, inputHandler, setFormData] = useForm({
		email: {
			value: '',
			isValid: false
		},
		password: {
			value: '',
			isValid: false
		}
	}, false);

	//console.log("isLoginMode:", isLoginMode);


	const switchModeHandler = () => {
		if (!isLoginMode) {
			setIsLoading(true);
			setFormData(
				{
					...formState.inputs,
					name: undefined
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData({
				...formState.inputs,
				name: {
					value: '',
					isValid: false
				}
			}, false);
		}
		setIsLoginMode(prevMode => !prevMode);
	};

	const authSubmitHandler = async event => {
		event.preventDefault();

		if (isLoginMode) {

		} else {
			try {
				const response = await fetch('http://localhost:5001/api/users/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
						image: "http://localhost:3000/images/blank-profile-picture-973460_640.png"
					})
				});

				const responseData = await response.json();
				console.log("response ok:", response.ok);
				console.log("responseData:", responseData);

				if (!response.ok) {
					throw new Error(responseData.message);
				}


				setIsLoading(false);
				auth.login();
			} catch (err) {
				console.log("authSubmit err:", err);
				setIsLoading(false);
				setError(err.message || 'Something went wrong when trying to sign up.');
				return;
			}
		}

		setIsLoading(false);



		auth.login();
	}

	const errorHandler = () => {
		setError(null)
	}

	return (
		<>
			<ErrorModal error={error} onClear={errorHandler} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode &&
						<Input
							element="input"
							id="name"
							type="text"
							label="Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a name."
							onInput={inputHandler}
						/>
					}
					<Input
						element="input"
						id="email"
						type="email"
						label="Email"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						type="password"
						label="Password"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid password."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? 'Login' : 'Signup'}
					</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'Signup' : 'Login'}</Button>
			</Card></>
	)
};

export default Auth;