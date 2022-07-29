import React, { useContext, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";

import './PlaceItem.css';

const PlaceItem = props => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	console.log("auth:", auth);
	console.log("props:", props);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const openMapHandler = () => setShowMap(true);
	const closeMapHandler = () => setShowMap(false);

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				`http://localhost:5001/api/places/${props.id}`,
				'DELETE'
			);
			props.onDelete(props.id);
		} catch (err) { }
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass="place-item__modal-content"
				footerClass="place-item__modal-actions"
				footer={<Button upper onClick={closeMapHandler}>Close</Button>}
			>
				<div className="map-container">
					<Map center={props.coordinates} zoom={16} />
				</div>
			</Modal>
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header="Are you sure?"
				footerClass="place-item__modal-actions"
				footer={
					<React.Fragment>
						<Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
						<Button danger onClick={confirmDeleteHandler}>Delete</Button>
					</React.Fragment>
				}
			>
				<p>Do you want to proceed and delete this place? It cannot be undone.</p>
			</Modal>
			<li className="place-item">
				<Card className="place-item__content">
					{isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
					<div className="place-item__image">
						<img src={`http://localhost:5001/${props.image}`} alt={props.title} />
					</div>
					<div className="place-item__info">
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className="place-item__actions">
						<Button upper inverse onClick={openMapHandler}>View on Map</Button>
						{auth.userId === props.creator && (
							<React.Fragment>
								<Button upper to={`/places/${props.id}`}>Edit</Button>
								<Button upper danger onClick={showDeleteWarningHandler}>Delete</Button>
							</React.Fragment>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;