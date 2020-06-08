import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './styles/main.less';
import React from 'react';
import { render } from 'react-dom';
import Root from './routes/Root';

render(
    <Root />,
    document.getElementById('app')
);
