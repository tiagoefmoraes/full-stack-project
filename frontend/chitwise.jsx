import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/store';
import Root from './components/root';
import { friendBills } from './reducers/entities/bills_selector';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  let store;
  if (window.currentUser) {
    const preloadedState = {
      entities: {
        users: { [window.currentUser.id]: window.currentUser }
      },
      session: { currentUserId: window.currentUser.id }
    };
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  // TOFIX: TEST
    window.getState = store.getState;
    window.dispatch = store.dispatch;
    window.friendBills = friendBills;
  // testing

  ReactDOM.render(<Root store={store} />, root)
});