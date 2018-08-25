import React from 'react';
import PropTypes from 'prop-types';
import SubNav from '../SubNav/SubNav'
import Menu from "../Menu/Menu"
import MenuItem from "../Menu/MenuItem"
import { duration } from '../../lib/transitions';
import Slide from '../Slide/Slide';
import './SideNav.css'

const oppositeDirection = {
    left: 'right',
    right: 'left',
    top: 'down',
    bottom: 'up',
};

class SideNav extends React.Component {
    mounted = false
    subNavContainer = null

    state = {
        subOpen: false,
        subData: null
    }

    componentDidMount() {
        this.mounted = true;
    }

    handleDrawerOpen = (data) => {
        this.setState({ subOpen: true, subData: data });
    };


    handleDrawerClose = () => {
        this.setState({ subOpen: false, subData: null });
    };

    render() {
        const {
            children,
            ModalProps: { BackdropProps: BackdropPropsProp, ...ModalProps } = {},
            onClose,
            open,
            PaperProps,
            SlideProps,
            theme,
            transitionDuration,
            variant,
            user,
            data,
            ...other
        } = this.props;

        const { subOpen, subData } = this.state;

        const anchor = 'left';
        const drawer = (
            <div className="SideNav" ref={ref => {
                this.subNavContainer = ref;
            }}>
                <div className='SideNav-Toolbar'/>
                <div className='SideNav-Welcome'>
                    <div>Hello {user}</div>
                </div>
                <SubNav open={subOpen} exit="true" onClose={this.handleDrawerClose} data={subData} ModalProps={{container: this.subNavContainer, ...ModalProps}}/>
                <Menu level={1} component="nav">
                    { data.map((item, index) => {
                            return <MenuItem button level={1} onClick={this.handleDrawerOpen} data={item} key={index}/>
                        }
                    )}
                </Menu>
                {children}
            </div>
        );

        const slidingDrawer = (
            <Slide
                in={open}
                direction={oppositeDirection[anchor]}
                timeout={transitionDuration}
                appear={this.mounted}
                exit={true}
                enter={true}
                {...SlideProps}
            >
                {drawer}
            </Slide>
        );
            return (
                <div className='SideNav-Wrapper' {...other} >
                    {slidingDrawer}
                </div>
            );
    }
}

SideNav.propTypes = {

    anchor: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),

    children: PropTypes.node,

    className: PropTypes.string,

    onClose: PropTypes.func,

    open: PropTypes.bool,

    SlideProps: PropTypes.object,

    transitionDuration: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    ]),

    variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary']),
};

SideNav.defaultProps = {
    anchor: 'left',
    open: false,
    transitionDuration: { enter: duration.enteringScreen, exit: duration.leavingScreen },
    variant: 'temporary', // Mobile first.
};

export default SideNav
