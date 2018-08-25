import React from 'react';
import PropTypes from 'prop-types';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '../Menu/Menu'
import MenuItem from '../Menu/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '../Button/ButtonBase'
// import classNames from 'classnames';
import Modal from '../Modal/Modal';
import Slide from '../Slide/Slide';
import { duration } from '../../lib/transitions';

import './SubNav.css'

const style = theme => ({
    subHead: {
        color: '#CAB286',
        textTransform: 'uppercase',
        letterSpacing: 0.2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#f4f4f6',
        minHeight: 65,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        lineHeight: '40px',
        boxSizing: 'border-box',
        borderBottom: `1px solid ${theme.palette.divider}`
    }
})

const oppositeDirection = {
    left: 'right',
    right: 'left',
    top: 'down',
    bottom: 'up',
};


class SubNav extends React.Component {
    mounted = false;

    state = {
        activeSubMenu: null
    };

    componentDidMount() {
        this.mounted = true;
    }

    toggleSubMenu = (item) => {
        let active = null;
        if(this.state.activeSubMenu !== item.title) {
            active = item.title
        }
        this.setState({
            activeSubMenu: active
        })
    };

    render() {
        const {
            classes,
            className,
            ModalProps: { BackdropProps: BackdropPropsProp, ...ModalProps } = {},
            onClose,
            open,
            SlideProps,
            transitionDuration,
            data,
            ...other
        } = this.props;

        if(!data){
            return null
        }

        const anchor = 'right';
        const drawer = (
            <div className="SubNav">
                <Menu component="nav" level={2}
                      subheader={
                          <ListSubheader
                              classes={{ root: classes.subHead}}
                              className="SubNav-Header"
                              component="div">
                              <div>{data.title}</div>
                              <ButtonBase className="closeMenu" onClick={onClose}><span className="icon"/><span className="text">CLOSE</span></ButtonBase>
                          </ListSubheader>
                      }>
                    {data.children.map((item, index) => {
                       return <MenuItem level={2} onClickSub={this.toggleSubMenu} activeSubMenu={this.state.activeSubMenu} button data={item} key={index} />
                    })}
                </Menu>
            </div>
        );

        const slidingDrawer = (
            <Slide
                in={open}
                direction={oppositeDirection[anchor]}
                timeout={transitionDuration}
                appear={this.mounted}
                {...SlideProps}
            >
                {drawer}
            </Slide>
        );

        return (
            <Modal
                BackdropProps={{
                    ...BackdropPropsProp,
                    transitionDuration,
                }}
                className={className}
                open={open}
                onClose={onClose}
                {...other}
                {...ModalProps}
            >
                {slidingDrawer}
            </Modal>
        );



    }
}

SubNav.propTypes = {
    anchor: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),

    children: PropTypes.node,

    classes: PropTypes.object.isRequired,

    className: PropTypes.string,

    ModalProps: PropTypes.object,

    onClose: PropTypes.func,
    /**
     * If `true`, the drawer is open.
     */
    open: PropTypes.bool,

    SlideProps: PropTypes.object,

    transitionDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),

    variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary']),
};

SubNav.defaultProps = {
    anchor: 'right',
    open: false,
    transitionDuration: { enter: duration.enteringScreen, exit: duration.leavingScreen },
    variant: 'temporary', // Mobile first.
};

export default withStyles(style)(SubNav)
