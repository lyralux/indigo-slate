import React, { Component } from 'react'
import PropTypes from 'prop-types'

import spannify from '../../lib/spannify'
import animate from '../../lib/animate'

import './WordAnimation.css';

class WordAnimation extends Component {
    static defaultProps = {
        delay: 1,
        duration: 1,
        easing: 'ease',
        transform: 'translateY(30px)',
        start: false
    }
    static propTypes = {
        delay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        easing: PropTypes.string,
        transform: PropTypes.string
    }
    constructor(props) {
        super(props)
        this.state = {
            animationShown: false
        }
    }
    componentWillMount() {
        if (this.props.children) {
            this.text = spannify(this.props.children, 'word');
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.text && nextProps.children) {
            this.text = spannify(nextProps.children, 'word');
        }
    }
    componentDidMount() {
        if (this.text && this.props.start) {
            this.startAnimation();
        }
    }
    componentDidUpdate() {
        if (!this.state.animationShown && this.text && this.props.start) {
            this.startAnimation();
        }
    }

    startAnimation() {
        const { delay, duration, easing, transform } = this.props;
        const words = this.node.children;

        if (!this.state.animationShown && words.length) {
            for(let i = 0; i < words.length; i++) {
                let word = words[i];
                let animDelay = delay + duration / words.length * i;
                word.style.transform = transform;
                word.style.opacity = 0;
                animate({
                    easing: easing,
                    el: word,
                    translate: 0,
                    opacity: 1,
                    duration: duration,
                    delay: animDelay
                });
            }
            this.setState({
                animationShown: true
            });
        }
    }
    render() {
        return (
            <span ref={ (span) => this.node = span } className="word-animation">{this.text}</span>
        )
    }
}

export default WordAnimation
