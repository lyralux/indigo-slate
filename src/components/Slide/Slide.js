import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EventListener from 'react-event-listener';
import debounce from 'debounce'; // < 1kb payload overhead when lodash/debounce is > 3kb.
import Transition from 'react-transition-group/Transition';
import ownerWindow from '../../utils/ownerWindow';
import transitions, { duration } from '../../lib/transitions';
import { reflow, getTransitionProps } from '../../lib/util';

const GUTTER = 24;

function getTranslateValue(props, node) {
    const { direction } = props;
    const rect = node.getBoundingClientRect();

    let transform;

    if (node.fakeTransform) {
        transform = node.fakeTransform;
    } else {
        const computedStyle = ownerWindow(node).getComputedStyle(node);
        transform =
            computedStyle.getPropertyValue('-webkit-transform') ||
            computedStyle.getPropertyValue('transform');
    }

    let offsetX = 0;
    let offsetY = 0;

    if (transform && transform !== 'none' && typeof transform === 'string') {
        const transformValues = transform
            .split('(')[1]
            .split(')')[0]
            .split(',');
        offsetX = parseInt(transformValues[4], 10);
        offsetY = parseInt(transformValues[5], 10);
    }

    if (direction === 'left') {
        return `translateX(100vw) translateX(-${rect.left - offsetX}px)`;
    }

    if (direction === 'right') {
        return `translateX(-${rect.left + rect.width + GUTTER - offsetX}px)`;
    }

    if (direction === 'up') {
        return `translateY(100vh) translateY(-${rect.top - offsetY}px)`;
    }

    // direction === 'down'
    return `translateY(-${rect.top + rect.height + GUTTER - offsetY}px)`;
}

export function setTranslateValue(props, node) {
    const transform = getTranslateValue(props, node);

    if (transform) {
        node.style.webkitTransform = transform;
        node.style.transform = transform;
    }
}

class Slide extends React.Component {
    mounted = false;

    transition = null;

    handleResize = debounce(() => {
        if (this.props.in || this.props.direction === 'down' || this.props.direction === 'right') {
            return;
        }

        if (this.transitionRef) {
            setTranslateValue(this.props, this.transitionRef);
        }
    }, 166); // Corresponds to 10 frames at 60 Hz.

    componentDidMount() {
        if (!this.props.in) {
            this.updatePosition();
        }

        this.mounted = true;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.direction !== this.props.direction && !this.props.in) {

            this.updatePosition();
        }
    }

    componentWillUnmount() {
        this.handleResize.clear();
    }

    handleEnter = node => {
        setTranslateValue(this.props, node);
        reflow(node);

        if (this.props.onEnter) {
            this.props.onEnter(node);
        }
    };

    handleEntering = node => {
        const { theme } = this.props;

        const transitionProps = getTransitionProps(this.props, {
            mode: 'enter',
        });
        node.style.webkitTransition = transitions.create('-webkit-transform', {
            ...transitionProps,
            easing: transitions.easing.easeOut,
        });
        node.style.transition = transitions.create('transform', {
            ...transitionProps,
            easing: transitions.easing.easeOut,
        });
        node.style.webkitTransform = 'translate(0, 0)';
        node.style.transform = 'translate(0, 0)';
        if (this.props.onEntering) {
            this.props.onEntering(node);
        }
    };

    handleExit = node => {
        const { theme } = this.props;

        const transitionProps = getTransitionProps(this.props, {
            mode: 'exit',
        });
        node.style.webkitTransition = transitions.create('-webkit-transform', {
            ...transitionProps,
            easing: transitions.easing.sharp,
        });
        node.style.transition = transitions.create('transform', {
            ...transitionProps,
            easing: transitions.easing.sharp,
        });
        setTranslateValue(this.props, node);

        if (this.props.onExit) {
            this.props.onExit(node);
        }
    };

    handleExited = node => {
        // No need for transitions when the component is hidden
        node.style.webkitTransition = '';
        node.style.transition = '';

        if (this.props.onExited) {
            this.props.onExited(node);
        }
    };

    updatePosition() {
        if (this.transitionRef) {
            this.transitionRef.style.visibility = 'inherit';
            setTranslateValue(this.props, this.transitionRef);
        }
    }

    render() {
        const {
            children,
            onEnter,
            onEntering,
            onExit,
            onExited,
            style: styleProp,
            ...other
        } = this.props;

        let style = {};

        if (!this.props.in && !this.mounted) {
            style.visibility = 'hidden';
        }

        style = {
            ...style,
            ...styleProp,
            ...(React.isValidElement(children) ? children.props.style : {}),
        };

        return (
            <EventListener target="window" onResize={this.handleResize}>
                <Transition
                    onEnter={this.handleEnter}
                    onEntering={this.handleEntering}
                    onExit={this.handleExit}
                    onExited={this.handleExited}
                    appear
                    style={style}
                    ref={ref => {
                        this.transitionRef = ReactDOM.findDOMNode(ref);
                    }}
                    {...other}
                >
                    {children}
                </Transition>
            </EventListener>
        );
    }
}

Slide.propTypes = {

    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
    /**
     * If `true`, show the component; triggers the enter or exit animation.
     */
    in: PropTypes.bool,

    onEnter: PropTypes.func,

    onEntering: PropTypes.func,

    onExit: PropTypes.func,

    onExited: PropTypes.func,

    style: PropTypes.object,

    timeout: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),
};

Slide.defaultProps = {
    direction: 'down',
    timeout: {
        enter: duration.enteringScreen,
        exit: duration.leavingScreen,
    },
};

export default Slide;
