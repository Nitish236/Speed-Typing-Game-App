"use client";
import lobby from "@/app/styles/lobby.module.css";

import { useState } from "react";
import CreateLobbyForm from "../../components/CreateLobbyForm";
import { io } from "socket.io-client";
import Link from "next/link";

const LobbyPage = () => {
  const [createdLobby, setCreatedLobby] = useState(null);

  const handleCreateLobby = async (difficulty) => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log(socket.connected);
    });

    socket.emit("joinLobby", difficulty, (lobbyID) => {
      console.log(lobbyID);
      setCreatedLobby(lobbyID); // Set the created lobby ID from the server response
    });
  };

  return (
    <div className={lobby.main}>
      {createdLobby == null && (
        <h1 className={lobby.heading}>Create a Lobby</h1>
      )}
      {createdLobby == null && (
        <CreateLobbyForm onCreateLobby={handleCreateLobby} />
      )}
      {createdLobby && (
        <div className={lobby.result}>
          <h2>Lobby Created</h2>
          <p>
            Lobby ID : <span>{createdLobby}</span>
          </p>
          <p className={lobby.button}>
            <Link href={`/multiplayer/game/${createdLobby}`}>Join</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
