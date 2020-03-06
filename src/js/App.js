import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Election from '../../build/contracts/Election.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'

// Uses component state in react to manage our app state.
class App extends React.Component {
  constructor(props) {
    super(props)
    /* Manage some basic things such as:
    1) Account thats connected
    2) Candidates that will be in the election
    3) Have the accounts voted
    4) Is the app loading?
    5) Is the app is currently voting? */ 
    this.state = {
      account: '0x0',
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
    }

    // Configure web3, this is how we allow our Dapp to talk to the blockchain.
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    /* Get an abstraction of our contract
    (Creating truffle contract from the JSON file using TruffleContract library).
    Solves the problem of having to keep changing the ABI,
    when theres a change in environment when using web3. */
    this.election = TruffleContract(Election)
    this.election.setProvider(this.web3Provider)

    /* Binding functions to the scope of this App component, 
    because it will be passed down to other components. */
    this.castVote = this.castVote.bind(this)
    this.watchEvents = this.watchEvents.bind(this)
  }

  // Getting all the values from the blockchain and updating the state of our app.
  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.election.deployed().then((electionInstance) => {
        this.electionInstance = electionInstance
        this.watchEvents()
        /*Loading up the candidates from the smart contract solidity mapping,
        and adding them to an array of candidates in the state. */
        this.electionInstance.candidatesCount().then((candidatesCount) => {
          for (var i = 1; i <= candidatesCount; i++) {
            this.electionInstance.candidates(i).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                id: candidate[0],
                name: candidate[1],
                voteCount: candidate[2]
              });
              this.setState({ candidates: candidates })
            });
          }
        })
        /* Reading from smart contract to see if this user has voted or not, 
        and writing that value to state. */
        this.electionInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted, loading: false })
        })
      })
    })
  }

  // Watching for voted events to see if they are voting or not.
  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.electionInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  // Talks to our smart contract which calls the vote function.
  castVote(candidateId) {
    this.setState({ voting: true })
    this.electionInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }

  /* Re-render something every a state changes in react. 
  If it is loading or voting, website will display "Loading...", 
  or else it will render the content.*/
  render() {
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <h1>Election Results</h1>
          <br/>
          { this.state.loading || this.state.voting
            ? <p class='text-center'>Loading...</p>
            : <Content
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                castVote={this.castVote} />
          }
        </div>
      </div>
    )
  }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
