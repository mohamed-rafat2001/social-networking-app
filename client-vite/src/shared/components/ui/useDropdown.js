import { useState, useRef, useEffect } from "react";

export const useDropdown = (isOpenDefault = false) => {
	const [isOpen, setIsOpen] = useState(isOpenDefault);
	const triggerRef = useRef(null);
	const [coords, setCoords] = useState({
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	});

	const close = () => setIsOpen(false);

	const updateCoords = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.top,
				bottom: rect.bottom,
				left: rect.left,
				right: window.innerWidth - rect.right,
			});
		}
	};

	const toggle = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		updateCoords();
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("scroll", updateCoords, true);
			window.addEventListener("resize", updateCoords);
			return () => {
				window.removeEventListener("scroll", updateCoords, true);
				window.removeEventListener("resize", updateCoords);
			};
		}
	}, [isOpen]);

	return {
		isOpen,
		setIsOpen,
		triggerRef,
		coords,
		close,
		toggle,
		updateCoords,
	};
};
