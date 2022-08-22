import './CreateTeamModel.css';

import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { appendValues } from './SheetsAPI/SheetsAPI'
import { generateUUID } from './Utils/UUID'

function CreateTeamModal() {
    const [isWorking, setIsWorking] = useState(false);

    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        setIsWorking(true);

        let id = generateUUID();
        appendValues(null, "A1:C1", [id, teamName, teamMembers], () =>{
            navigate("/FFXIV-Raid-Completionist/Team/" + id, {replace: true});
            setShow(false);
        });
    }
    const handleShow = () => setShow(true);

    const [teamName, setTeamName] = React.useState({});
    const [teamMembers, setTeamMembers] = React.useState({});

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create team
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content'>
                        <div className='input-field-container'>
                            <div className='input-field-label'>Team name</div>
                            <input className='input-field-input' type="text" onChange={event => setTeamName(event.target.value)}></input>
                        </div>
                        <div className='input-field-container' style={{ height: "250px" }}>
                            <div className='input-field-label'>Members, separated by new line</div>
                            <textarea className='input-field-input' onChange={event => setTeamMembers(event.target.value)}></textarea>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={isWorking} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={isWorking} onClick={handleConfirm}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>);
}

export default CreateTeamModal;