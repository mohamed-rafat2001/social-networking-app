import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "../shared/hooks/useUser";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { user } = useUser();

	useEffect(() => {
		if (user?._id) {
			const newSocket = io(
				import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
			);

			newSocket.emit("addUser", user._id);

			newSocket.on("getUsersOnLine", (users) => {
				setOnlineUsers(users);
			});

			setSocket(newSocket);

			return () => {
				newSocket.disconnect();
			};
		}
	}, [user?._id]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
