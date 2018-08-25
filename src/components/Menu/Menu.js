import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';

export const styles = {
    root: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        position: 'relative',
    },
    padding: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    dense: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    subheader: {
        paddingTop: 0,
    },
};

class Menu extends React.Component {
    getChildContext() {
        return {
            dense: this.props.dense,
        };
    }

    render() {
        const {
            children,
            classes,
            className: classNameProp,
            component: Component,
            dense,
            disablePadding,
            level,
            subheader,
            ...other
        } = this.props;
        const className = classNames(
            classes.root,
            {
                [classes.dense]: dense && !disablePadding,
                [classes.padding]: !disablePadding,
                [classes.subheader]: subheader,
            },
            classNameProp,
        );

        return (
            <Component className={className} {...other}>
                {subheader}
                {children}
            </Component>
        );
    }
}

Menu.propTypes = {
    children: PropTypes.node,

    className: PropTypes.string,

    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),

    dense: PropTypes.bool,

    disablePadding: PropTypes.bool,

    subheader: PropTypes.node,
};

Menu.defaultProps = {
    component: 'ul',
    dense: false,
    disablePadding: false,
};

Menu.childContextTypes = {
    dense: PropTypes.bool,
};

export default withStyles(styles, { name: 'MuiMenu' })(Menu);
