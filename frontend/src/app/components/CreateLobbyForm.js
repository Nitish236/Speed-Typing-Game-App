import { useState } from "react";

const CreateLobbyForm = ({ onCreateLobby }) => {
  const [difficulty, setDifficulty] = useState("easy");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the selected difficulty to the parent component
    onCreateLobby(difficulty);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <button type="submit">Create Lobby</button>
    </form>
  );
};

export default CreateLobbyForm;
