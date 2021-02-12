import React, {Component} from 'react';

import Menu from '../menu/menu';
import MainView from '../main-view/dashboardView';

class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = { 
            selectedScreen: 0
         }

         this.setScreen = this.setScreen.bind(this);
    }

    setScreen(screen){
        let state = this.state;
        state.selectedScreen = screen;
        this.setState(state);
    }

    render(){
        return(
            <div className="dashboard-container">
                <Menu setScreen={this.setScreen} logout={this.props.logout}/>
                <MainView selectedScreen={this.state.selectedScreen} />
            </div>
        )
    }
}

export default Dashboard;
