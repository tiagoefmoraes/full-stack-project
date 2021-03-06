import { RECEIVE_CURRENT_USER } from '../../actions/session_actions';
import { RECEIVE_BILL } from '../../actions/bills_actions';

const userBillSharesReducer = (oldState = {}, action) => {
  Object.freeze(oldState);

  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.userBillShares ? action.userBillShares : {} ;
    case RECEIVE_BILL:
      let newState = Object.assign({}, oldState);
      Object.keys(newState).forEach( key => {
        if (newState[key].billId === action.billId) {
          delete newState[key];
        }
      });
      return Object.assign({}, newState, action.userBillShares);
    default:
      return oldState;
  }
};

export default userBillSharesReducer;