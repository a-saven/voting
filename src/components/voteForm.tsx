export function VoteForm({ onVote, selectedCandidate, onSelectChange }) {
  return (
    <div>
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
          onChange={onSelectChange}
        />
        <br />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="button" onClick={onVote}>
          Vote
        </button>
      </form>
    </div>
  );
}
