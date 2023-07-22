import lobb from "@/app/styles/lobby.module.css";

const OpenLobbiesList = ({ openLobbies, handleJoinLobby }) => {
  return (
    <div className={lobb.lobyList}>
      <h2 className={lobb.heading}>Open Lobbies</h2>
      {openLobbies.length === 0 ? (
        <p>No open lobbies found.</p>
      ) : (
        <ul>
          {openLobbies.map((lobby) => (
            <li key={lobby._id}>
              <span>Difficulty: {lobby.difficulty}</span>
              <button onClick={() => handleJoinLobby(lobby._id)}>
                Join Lobby
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OpenLobbiesList;
