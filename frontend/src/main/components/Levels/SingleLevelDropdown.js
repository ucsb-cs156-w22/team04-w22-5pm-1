import React, {useState} from "react";
import {Form} from "react-bootstrap";

const SingleLevelDropdown = ({levels, _level, setLevel, controlId, label="Course Level"}) => {
    const localSearchLevel = localStorage.getItem(controlId);
    const [levelState, setLevelState] = useState(localSearchLevel || "U");

    const handleLeveltoChange = (event) => {
        localStorage.setItem(controlId, event.target.value);
        setLevelState(event.target.value);
        setLevel(event.target.value);
    }

    return(
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" value={levelState} onChange={handleLeveltoChange} >
                {levels.map(function (object, i) {
                    return <option key={controlId + '-' + i} value={object[0]}>{object[1]}</option>;
                })}
            </Form.Control>
        </Form.Group>
    )
};

export default SingleLevelDropdown;
