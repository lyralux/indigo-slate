import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import transitions, { duration } from '../../lib/transitions';

import { reflow, getTransitionProps } from '../../lib/util';

const styles = {
    entering: {
        opacity: 1,
    },
    entered: {
        opacity: 1,
    },
};

class Fade extends React.Component {
    handleEnter = node => {
        const { theme } = this.props;
        reflow(node); // So the animation always start from the start.

        const transitionProps = getTransitionProps(this.props, {
            mode: 'enter',
        });
        node.style.webkitTransition = transitions.create('opacity', transitionProps);
        node.style.transition = transitions.create('opacity', transitionProps);

        if (this.props.onEnter) {
            this.props.onEnter(node);
        }
    };

    handleExit = node => {
        const { theme } = this.props;
        const transitionProps = getTransitionProps(this.props, {
            mode: 'exit',
        });
        node.style.webkitTransition = transitions.create('opacity', transitionProps);
        node.style.transition = transitions.create('opacity', transitionProps);

        if (this.props.onExit) {
            this.props.onExit(node);
        }
    };

    render() {
        const { children, onEnter, onExit, style: styleProp, theme, ...other } = this.props;

        const style = {
            ...styleProp,
            ...(React.isValidElement(children) ? children.props.style : {}),
        };

        return (
            <Transition appear onEnter={this.handleEnter} onExit={this.handleExit} {...other}>
                {(state, childProps) => {
                    return React.cloneElement(children, {
                        style: {
                            opacity: 0,
                            willChange: 'opacity',
                            ...styles[state],
                            ...style,
                        },
                        ...childProps,
                    });
                }}
            </Transition>
        );
    }
}

Fade.propTypes = {

    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

    in: PropTypes.bool,

    onEnter: PropTypes.func,

    onExit: PropTypes.func,

    style: PropTypes.object,

    timeout: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
};

Fade.defaultProps = {
    timeout: {
        enter: duration.enteringScreen,
        exit: duration.leavingScreen,
    },
};

export default Fade;
