import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import votingAbi from "./contracts/voting.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [votingContract, setVotingContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [userBalance, setUserBalance] = useState("0");
  const [votingHistory, setVotingHistory] = useState([]);
  const isConnected = accounts && accounts.length > 0;

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  const connect = async () => {
    if (web3) {
      const accounts = await web3.eth.requestAccounts();
      setAccounts(accounts);
      const contractAddress = "0xef61287b986d2d5c0c743fa7324b32473601d226"; // Replace with your contract address
      const contractInstance = new web3.eth.Contract(votingAbi.abi, contractAddress);
      setVotingContract(contractInstance);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (votingContract) {
        const round = await votingContract.methods.currentRound().call();
        setCurrentRound(round);

        // Fetching account balance
        const balance = await web3.eth.getBalance(accounts[0]);
        setUserBalance(web3.utils.fromWei(balance, "ether"));

        // Fetching voting history for user
        const history = [];
        for (let i = 1; i <= currentRound; i++) {
          const hasVoted = await votingContract.methods.voterRounds(accounts[0], i).call();
          if (hasVoted) history.push(i);
        }
        setVotingHistory(history);

        const count = await votingContract.methods.candidatesCount().call();
        const candidatesList = [];
        for (let i = 0; i < count; i++) {
          const candidate = await votingContract.methods.candidates(i).call();
          candidatesList.push({
            id: i,
            name: candidate.name,
            voteCount: parseInt(candidate.voteCount),
          });
        }
        setCandidates(candidatesList);
      }
    };
    fetchData();
  }, [votingContract, accounts, currentRound, web3]);

  const handleVote = async () => {
    if (votingContract && accounts.length > 0) {
      try {
        await votingContract.methods.vote(1).send({ from: accounts[0] });
        alert("Vote successful");
      } catch (error) {
        console.error("Error while voting:", error);
      }
    }
  };

  const startNewRound = async () => {
    if (votingContract && accounts.length > 0) {
      try {
        await votingContract.methods.startNewVotingRound().send({ from: accounts[0] });
        alert("New voting round started!");
      } catch (error) {
        console.error("Error while starting a new round:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Connect your wallet</h1>
      {isConnected ? (
        <div>
          <div className="text-xl font-bold mb-2">Wallet Connected: {accounts[0]}</div>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setAccounts([])}>
            Disconnect Wallet
          </button>
          <hr className="my-4" />
          <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
          <h3 className="text-xl font-semibold mb-2">Voting History:</h3>
          <ul>
            {votingHistory.map((round) => (
              <li key={round}>Voted in Round: {round}</li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mb-2 mt-4">Account Balance:</h3>
          <p>{userBalance} ETH</p>
          <h3 className="text-xl font-semibold mb-2">Current Round: {currentRound}</h3>
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={startNewRound}>
            Start New Round
          </button>
          <hr className="my-4" />
          <h3 className="text-xl font-semibold mb-2">Candidate List</h3>
          <ul className="list-none">
            {candidates.map((candidate) => (
              <li key={candidate.id} className="border-b-2 border-gray-300 py-2">
                <div>Id: {candidate.id}</div>
                <div>Name: {candidate.name}</div>
                <div>Vote Count: {candidate.voteCount}</div>
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mb-2 mt-4">Vote for your favorite candidate:</h3>
          <form>
            <label className="block mb-2" htmlFor="candidate">
              Select a candidate:
            </label>
            <input
              className="border-2 border-gray-300 rounded px-2 py-1 mb-2"
              type="number"
              id="candidate"
              value={selectedCandidate}
              onChange={(event) => setSelectedCandidate(parseInt(event.target.value))}
            />
            <br />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="button" onClick={handleVote}>
              Vote
            </button>
          </form>
        </div>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={connect}>
          Connect With MetaMask
        </button>
      )}
    </div>
  );
}

export default App;
