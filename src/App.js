import React, { Component } from 'react';
import classnames from 'classnames';
import AppBar from './components/AppBar/AppBar'
import SideNav from './components/SideNav/SideNav';
import ButtonBase from './components/Button/ButtonBase'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import transitions from './lib/transitions';
import Hamburger from "./components/Hamburger/Hamburger";
import menuData from './data/menu';
import './App.css';

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'PFDinTextPro','Meiryo','MS PGothic','Malgun Gothic','Dotum','Arial','Helvetica','Sans-serif'
        ].join(','),
    },
});



class App extends Component {
    state = {
        open: false,
        sideNavWidth: 0
    };
    sideNav = null;

    componentDidMount() {
        this.setState({sideNavWidth: this.sideNav.subNavContainer.clientWidth})
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

  render() {
      const { open } = this.state;
      const trans = transitions.create('background-color', {
          duration: transitions.duration.shortest,
      });

      const contentSlide = `${open ? 'initial' : `-${this.state.sideNavWidth}px`}`


        return (
            <MuiThemeProvider theme={theme}>
              <div className="App">
                  <AppBar className='AppBar'>
                          <ButtonBase onClick={open ? this.handleDrawerClose : this.handleDrawerOpen}><Hamburger active={open}/></ButtonBase>
                  </AppBar>
                  <SideNav open={open} data={menuData} user='Indigo Slate' ref={ref => {
                      this.sideNav = ref;
                  }}/>
                  <div style={{marginLeft: contentSlide}} className={classnames('App-Content', {
                      ['App-Content-Open']: open,
                  })}>
                      <div className='App-Toolbar' />
                      HEY
                  </div>
              </div>
            </MuiThemeProvider>
        );
  }
}

export default App;
