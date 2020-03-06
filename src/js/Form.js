import React from 'react'

class from extends React.Component {
  render() {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        // On submit handler which calls castVote and pass in candidateId value.
        this.props.castVote(this.candidateId.value)
      }}>
        <div class='form-group'>
          <label>Select Candidate</label>
          {/* Cause an anonymous function that assigns a candidateId
           to the component from this select value. */}
          <select ref={(input) => this.candidateId = input} class='form-control'>
          {/* Mapping over the candidates passed in by props,
          and render select option by candidate id and candidate name. */}
            {this.props.candidates.map((candidate) => {
              return <option value={candidate.id}>{candidate.name}</option>
            })}
          </select>
        </div>
        <button type='submit' class='btn btn-primary'>Vote</button>
        <hr />
      </form>
    )
  }
}

export default from
