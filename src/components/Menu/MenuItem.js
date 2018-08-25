import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '../Button/ButtonBase';
import Avatar from '../Avatar/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import {isMuiElement} from '@material-ui/core/utils/reactHelpers'
import Menu from './Menu'
import Collapse from '@material-ui/core/Collapse'
import './Menu.css'


export const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
        textDecoration: 'none',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'left',
        paddingTop: 12,
        paddingBottom: 12,
        color: '#fff',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(0,0,0,0.12)'
    },
    container: {
        position: 'relative',
    },
    focusVisible: {
        backgroundColor: theme.palette.action.hover
    },
    default: {},
    dense: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    disabled: {
        opacity: 0.5,
    },
    divider: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundClip: 'padding-box',
    },
    gutters: theme.mixins.gutters(),
    button: {
        transition: theme.transitions.create('background-color', {
            duration: theme.transitions.duration.standard,
        }),
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: theme.palette.action.hover,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
    secondaryAction: {
        paddingRight: 32,
    },
    primary: {
        color: "rgba(0,0,0)",
        letterSpacing: 0.2,
        lineHeight: '32px'
    },
    submenuText: {
        color: '#ED2228'
    },
    collapseMenu: {
        // backgroundColor: '#101820'
        backgroundColor: '#fff',
    }
});

class MenuItem extends React.Component {
    getChildContext() {
        return {
            dense: this.props.dense || this.context.dense || false,
        };
    }

    render() {
        const {
            button,
            children: childrenProp,
            classes,
            className: classNameProp,
            component: componentProp,
            ContainerComponent,
            ContainerProps: { className: ContainerClassName, ...ContainerProps } = {},
            dense,
            disabled,
            disableGutters,
            divider,
            onClick,
            level,
            activeSubMenu,
            data,
            onClickSub,
            focusVisibleClassName,
            ...other
        } = this.props;

        const isDense = dense || this.context.dense || false;
        const children = React.Children.toArray(childrenProp);
        const hasAvatar = level === 1;
        const hasSecondaryAction =
            children.length && isMuiElement(children[children.length - 1], ['ListItemSecondaryAction']);

        const className = classNames(
            classes.root,
            classes.default,
            {
                [classes.dense]: isDense || hasAvatar,
                [classes.gutters]: !disableGutters,
                [classes.divider]: divider,
                [classes.disabled]: disabled,
                [classes.button]: button,
                [classes.secondaryAction]: hasSecondaryAction,
            },
            classNameProp,
        );

        const componentProps = { className, disabled, ...other };
        let Component = componentProp || 'li';

        if (button) {
            componentProps.component = componentProp || 'div';
            componentProps.focusVisibleClassName = classNames(
                classes.focusVisible,
                focusVisibleClassName,
            );
            Component = ButtonBase;
        }
        let avatar;
        if(hasAvatar) {
            avatar = (
                <Avatar src="https://via.placeholder.com/40x40"/>
            )
        }

        //HAS CHILDREN
        if (data.children) {
            Component = !componentProps.component && !componentProp ? 'div' : Component;

            // Avoid nesting of li > li.
            if (ContainerComponent === 'li') {
                if (Component === 'li') {
                    Component = 'div';
                } else if (componentProps.component === 'li') {
                    componentProps.component = 'div';
                }
            }

            //LEVEL 2 MENU WITH COLLAPSE
            if(level === 2) {
                let menuOpen = activeSubMenu === data.title;
                return (
                    <ContainerComponent
                        className={classNames(classes.container, ContainerClassName)}
                        {...ContainerProps}
                    >
                        <Component {...componentProps} onClick={() => onClickSub(data)}>
                            <ListItemText classes={{ primary: classes.primary }} primary={data.title}/>
                            <div className={`${menuOpen ? 'buttonLevel2 open' : 'buttonLevel2'}`}/>
                        </Component>
                        <Collapse in={menuOpen} className={classes.collapseMenu} timeout="auto" unmountOnExit>
                            <Menu component="div" disablePadding>
                                {data.children.map((item, idx) => {
                                    return (
                                        <Component className={classNames(classes.root, classes.button)} button key={`${item.title}-${idx}`}>
                                            <ListItemText classes={{ primary: classes.primary }} inset primary={item.title} />
                                        </Component>
                                    )
                                })}

                            </Menu>
                        </Collapse>
                    </ContainerComponent>
                );
            }

            return (
                <ContainerComponent
                    className={classNames(classes.container, ContainerClassName)}
                    {...ContainerProps}
                >
                    <Component {...componentProps} onClick={() => onClick(data)}>
                        {avatar}
                        <ListItemText classes={{ primary: classes.primary }} primary={data.title}/>
                        <div className='buttonLevel1' />
                    </Component>
                    {children.pop()}
                </ContainerComponent>
            );
        }

        return <Component {...componentProps}>
            {avatar}
            <ListItemText classes={{ primary: classes.primary }}
                          primary={data.title}/>
            </Component>;
    }
}

MenuItem.propTypes = {

    button: PropTypes.bool,

    children: PropTypes.node,

    className: PropTypes.string,

    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),

    ContainerComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),

    ContainerProps: PropTypes.object,

    dense: PropTypes.bool,

    disabled: PropTypes.bool,

    disableGutters: PropTypes.bool,

    divider: PropTypes.bool,

    focusVisibleClassName: PropTypes.string,
};

MenuItem.defaultProps = {
    button: false,
    ContainerComponent: 'li',
    dense: false,
    disabled: false,
    disableGutters: false,
    divider: false,
    activeSubMenu: null,
};

MenuItem.contextTypes = {
    dense: PropTypes.bool,
};

MenuItem.childContextTypes = {
    dense: PropTypes.bool,
};

export default withStyles(styles, { name: 'MuiMenuItem' })(MenuItem);
