import React, { Component } from 'react';
import './Login.css';

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            wrongPass: false
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.firebaseLogin = this.firebaseLogin.bind(this);
        this.wrongPassword = this.wrongPassword.bind(this);
    }

    async firebaseLogin(){
        let login = await FirebaseControllerFunctions.firebaseLogin(this.state.email, this.state.password);
        if(login){
            this.props.login();
        } else {
            this.wrongPassword();
        }
    }

    setEmail(event) {
        let state = this.state;
        state.email = event.target.value;
        this.setState(state);
    }
    setPassword(event){
        let state = this.state;
        state.password = event.target.value;
        this.setState(state);
    }

    wrongPassword(){
        let state = this.state;
        state.wrongPass = true;
        this.setState(state);

        setTimeout(()=>{
            state.wrongPass = false;
            this.setState(state);
        },5000);
    }

    render(props) {
        return (
            <div className="container">
                <div className="login-form">
                    <div>
                        <h1 className="login-header">Bem vindo!</h1>
                    </div>

                    <div className="email-set">
                        <span>Email</span>
                        <input className="login-input" type="email" autoFocus required value={this.state.email} onChange={this.setEmail} />
                    </div>

                    <div className="password-set">
                        <span>Senha</span>
                        <input className="login-input" type="password" required value={this.state.password} onChange={this.setPassword} />
                    </div>

                    <button onClick={this.firebaseLogin} className="login-button">Login</button>
                    {this.state.wrongPass ? <p className="wrong-password">Login ou senha incorretos</p> : <></> }
                </div>
            </div>
        )
    }

}

export default Login;