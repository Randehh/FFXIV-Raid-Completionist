import './TeamDisplay.css';

import React, { useEffect, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const TeamDisplay = (props) => {
    const [isWorking, setIsWorking] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }

    const handleConfirm = () => {
        setIsWorking(true);
        props.onConfirm(teamName, teamMembers, () =>{
            setShow(false);
        });
    }
    
    const handleShow = () => {
        setIsWorking(false);
        setShow(true);
    }

    const [teamName, setTeamName] = React.useState("");
    const [teamMembers, setTeamMembers] = React.useState("");

    useEffect(() => {
        setTeamName(props.editTeam != null ? props.editTeam.teamName : "");
        setTeamMembers(props.editTeam != null ? props.editTeam.getTeamNames() : "");
    }, [props.editTeam])

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {props.buttonText}
            </Button>
            <Modal
                show={show}
                onHide={handleClose}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content'>
                        <div className='input-field-container'>
                            <div className='input-field-label'>Team name</div>
                            <input className='input-field-input' type="text" value={teamName} onChange={event => setTeamName(event.target.value)}></input>
                        </div>
                        <div className='input-field-container' style={{ height: "250px" }}>
                            <div className='input-field-label'>Members, separated by new line</div>
                            <textarea className='input-field-input' value={teamMembers} onChange={event => setTeamMembers(event.target.value)}></textarea>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={isWorking} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={isWorking} onClick={handleConfirm}>
                        {props.confirmText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>);
}

export default TeamDisplay;