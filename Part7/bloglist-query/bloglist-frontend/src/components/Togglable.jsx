import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { GeneralButton } from "../assets/Components.styled";

const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    useImperativeHandle(refs, () => {
        return { toggleVisibility };
    });

    return (
        <div>
            <div style={hideWhenVisible}>
                <GeneralButton onClick={toggleVisibility}>{props.buttonLabel}</GeneralButton>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <GeneralButton onClick={toggleVisibility}>cancel</GeneralButton>
            </div>
        </div>
    );
});
Togglable.displayName = "Togglable";
Togglable.propTypes={
    buttonLabel: PropTypes.string.isRequired
};

export default Togglable;