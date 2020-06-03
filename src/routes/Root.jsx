import React, { Component } from 'react';
import { Switch, Router, Route, HashRouter, Redirect } from 'react-router-dom';

import Test from '../containers/test/Test.jsx';

export default class Root extends Component {
    render() {
        return (
            <HashRouter>
                <Route
                    path="/"
                    component={Test}
                />
            </HashRouter>
        );
    }
}
