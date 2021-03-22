import { useKeycloak } from '@react-keycloak/web';
import * as React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

interface LoginProps {
    
};

const Login : React.FC<LoginProps> = (props) => {
    const { keycloak } = useKeycloak();
    const location = useLocation();

    const { from } : any = location.state || { from : {pathname: "/"} };

    if (keycloak.authenticated) {
        return <Redirect to={from} />
    }

    keycloak.login({
        redirectUri: `${window.location.origin}${process.env.REACT_APP_BASENAME}${from.pathname}`
    });

    return <div> Carregando... </div>
};

export default Login;