/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

console.out = data => {
    console.log(JSON.stringify(data, null, 2));
};

AppRegistry.registerComponent(appName, () => App);
