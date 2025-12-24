import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "../hooks/useUser";

const SocketContext = createContext(null);

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const { user } = useUser();

	useEffect(() => {
		if (user?._id) {
			const newSocket = io("http://localhost:5000", {
				query: { userId: user._id },
			});

			setSocket(newSocket);

			return () => {
				newSocket.disconnect();
			};
		}
	}, [user?._id]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
