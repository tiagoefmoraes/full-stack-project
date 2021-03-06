import React from 'react';
import AddBillUsersSelector from './add_bill_users_selector';
import PaidSelector from './paid_selector';
import { Decimal } from 'decimal.js';

class AddBillModal extends React.Component {
  constructor(props) {
    super(props);

    let { id, description, amount, note, payerId, associatedFriends, payerName } = this.props;

    this.state = {
      description: description,
      amount: amount,
      note: note,
      payerId: payerId,
      associatedFriends: associatedFriends,
      openPaidSelector: false,
      payerName: payerName,
      id: id
    };

    this.addAssociatedFriend = this.addAssociatedFriend.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addPayerContext = this.addPayerContext.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addAssociatedFriend(friend) {
    if (!this.state.associatedFriends.includes(friend)) {
      let newArr = [...this.state.associatedFriends, friend];
      this.setState({ associatedFriends: newArr });
    };
  }

  addPayerContext(user) {
    return () => {
      this.setState({ payerId: user.id, payerName: user.name, openPaidSelector: false });
    };
  }

  handleInput(field) {
    return (e) => {
      this.setState({ [field]: e.target.value });
    };
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ openPaidSelector: true });
  }

  handleSubmit(e) {
    e.preventDefault();

    let { id, amount, associatedFriends, description, note, payerId } = this.state;

    if (description === "") {
      alert("Description can't be blank!");
      return;
    }

    //calculate share
    let associatedUsers = [...associatedFriends, this.props.currentUser];
    let shareNum = associatedUsers.length;
    let shareAmt = (new Decimal(amount)) / shareNum;

    //build shares
    let userShares = associatedUsers.map( user => (
      { user_id: user.id, amount: shareAmt }
    ));
    
    this.props.billAction(
      { amount: amount, description: description, note: note, payer_id: payerId, shares: userShares, id: id }
    );
  }

  render() {
    let { friends, modalTitle, closeModal } = this.props;

    return (
      <div className="modal-child bill">

        <header>
          {modalTitle}
          <button onClick={closeModal}>X</button>
        </header>

        <form onSubmit={this.handleSubmit}>
          <AddBillUsersSelector 
            friends={friends}
            addAssociatedFriend={this.addAssociatedFriend}
            associatedFriends={this.state.associatedFriends}
          />
          
          <div className="middle-form">
            <div className="i-border"><i className="fas fa-receipt"></i></div>
            <div className="middle-form-inputs">
              <input 
                onChange={this.handleInput("description")}
                value={this.state.description}
                placeholder="Enter a description"
                className="description"
              />

              <label className="amount">$
                <input 
                  onChange={this.handleInput("amount")}
                  value={this.state.amount}
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>

          <div className="form-split-context">
            <h4>
              Paid by
              <button onClick={this.handleClick} className="green-text">
                {this.state.payerName}
              </button>
              and split
              <span className="green-text">
                equally
              </span>
            </h4>
          </div>

          <PaidSelector 
            openPaidSelector={this.state.openPaidSelector}
            associatedUsers={[...this.state.associatedFriends, this.props.currentUser]}
            addPayerContext={this.addPayerContext}
          />

        <input 
          type="submit" value="Save" className="bill-submit" />
        </form>
      </div>
    );
  }
}

export default AddBillModal;