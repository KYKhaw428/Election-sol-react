import React from 'react'
import Table from './Table'
import Form from './Form'

class Content extends React.Component {
  render() {
    return (
      <div>
        // Renders table and passed in candidates with props.
        <Table candidates={this.props.candidates} />
        <hr/>
        /* Passed in state via props and read that value to check if they have voted or not.
        If haven't vote yet, show the form, if voted then don't show anything. */
        { !this.props.hasVoted ?
          <Form candidates={this.props.candidates} castVote={this.props.castVote} />
          : null
        }
        /* Displaying account that is listed at the bottom 
        of the content section with the value that is passed in by props. */
        <p>Your account: {this.props.account}</p>
      </div>
    )
  }
}

export default Content
