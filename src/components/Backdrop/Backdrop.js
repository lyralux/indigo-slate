import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Fade from '../Fade/Fade';

import './Backdrop.css'

function Backdrop(props) {
    const { classes, className, invisible, open, transitionDuration, ...other } = props;

    return (
        <Fade appear in={open} timeout={transitionDuration} {...other}>
            <div
                data-mui-test="Backdrop"
                className={classNames(
                    'Backdrop',
                    {
                        ['Backdrop-invisible']: invisible,
                    },
                    className,
                )}
                aria-hidden="true"
            />
        </Fade>
    );
}

Backdrop.propTypes = {

    className: PropTypes.string,

    invisible: PropTypes.bool,

    open: PropTypes.bool.isRequired,

    transitionDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
};

Backdrop.defaultProps = {
    invisible: false,
};

export default Backdrop;
