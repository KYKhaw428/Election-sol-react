// Declare version of solidity being used.
pragma solidity ^0.5.0;

// Declaring contract named Election.
contract Election {
    /* Model a Candidate (to describe a candidate what it looks like 
        by using struct which will define the properties of a candidate). */
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    /* Store accounts that have voted by using mapping which takes in key and value type pairs.
        Where key = address & value = bool.
        Mapping is then referred as "voters". */
    mapping(address => bool) public voters;
    /* Store & Fetch Candidates (a place to store our candidates which was 
        being defined in the struct Candidate above.) 
        This is done by defining a mapping which requires a key and value type pairs.
        In this case, key = uint & value = Candidate (from the struct we created). 
        Lastly, the mapping is then being referred as "candidates". 
        This will change the state of our contract by writing & storing it to the blockchain. */ 
    mapping(uint => Candidate) public candidates;
    /* Store Candidates Count (to fetch ever possible candidates in the mapping 
        and determine how many candidates by using a state variable called "candidatesCount"). */
    uint public candidatesCount;

    // vote event
    event votedEvent (
        uint indexed _candidateId
    );

    /* Constructor will run whenever we initialize our smart contracts upon migration. 
        In this case, we are setting the value of candidates name. */
    constructor() public {
        /* Calls the addCandidate function inside the constructor so only the smart contracts
            will be in control of how many candidates will be in the election.
            This function will run whenever our contract is migrated and deployed. */ 
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    /* A private function that takes in the candidate name, and apply it to the Candidate struct 
        with id, name and voteCount.
        In this case, id = candidatesCount, name = _name and voteCount = 0. */
    function addCandidate (string memory _name) private {
        /* Increment the count of candidates each time a new candidate is added, 
            and it is being used to represent candidate ID as well. */
        candidatesCount ++;
        /* Create candidate by referencing its mapping and passing in the key 
            (aka ID of the candidate we want to create), which is obtained from candidatesCount.
            And lastly, assigning the values to the key as a new candidate. */
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Voting function for users to cast vote.
    function vote (uint _candidateId) public {
        /* require that they haven't voted before 
            (require that this address is not in this mapping). */
        require(!voters[msg.sender], "Account have already voted.");

        /* require a valid candidate 
            (making sure the candidate Id is greater than 0, 
            and less than or equals to the number of total candidates).
            Anything from 1 to greatest number of candidates will be valid. 
            If requirement turns out to be false, function will stop execution and throws an exception.*/
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        /* record that voter has voted by referencing voters mapping, then reading the account
         from out of the mapping and setting its value to true if it has voted.
         Lastly, adding the sender of this function to the list of addresses that have already voted. */
        voters[msg.sender] = true;

        /* update candidate vote Count.
         By referecing the candidate mapping and read the value of the candidate struct 
         that is being vote by taking _candidateId that is being passed in. */ 
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
