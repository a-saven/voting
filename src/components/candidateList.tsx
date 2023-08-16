export function CandidateList({ candidates }) {
  return (
    <div>
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
    </div>
  );
}
