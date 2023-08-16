import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import votingAbi from "./contracts/voting.json";
import { WalletConnection, Dashboard, VoteForm, CandidateList } from "./components";

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
      <WalletConnection
        isConnected={isConnected}
        accounts={accounts}
        onDisconnect={() => setAccounts([])}
        onConnect={connect}
      />
      {isConnected && (
        <div>
          <Dashboard
            userBalance={userBalance}
            currentRound={currentRound}
            votingHistory={votingHistory}
            onStartNewRound={startNewRound}
          />
          <hr className="my-4" />
          <CandidateList candidates={candidates} />
          <VoteForm
            onVote={handleVote}
            selectedCandidate={selectedCandidate}
            onSelectChange={(event) => setSelectedCandidate(parseInt(event.target.value))}
          />
        </div>
      )}
    </div>
  );
}

export default App;
