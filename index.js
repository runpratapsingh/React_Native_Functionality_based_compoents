/**
 * @format
 */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';

AppRegistry.registerComponent(appName, () => App);

// Register background task handler
const MyHeadlessTask = async event => {
  console.log('[HeadlessTask] start:', event.taskId);
  BackgroundFetch.finish(event.taskId);
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
