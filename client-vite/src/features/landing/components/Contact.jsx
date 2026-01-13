import React from "react";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";

const Contact = () => {
	const infoItems = [
		{
			icon: HiMail,
			text: "hello@engiconnect.edu",
			label: "Email Us",
		},
		{
			icon: HiPhone,
			text: "+1 (555) 123-4567",
			label: "Call Us",
		},
		{
			icon: HiLocationMarker,
			text: "Engineering Block A, University Campus",
			label: "Visit Us",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<section id="contact" className="py-24 relative overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="bg-primary rounded-[3.5rem] p-8 md:p-16 lg:p-20 overflow-hidden relative shadow-2xl shadow-primary/20">
					{/* Background Decorations */}
					<div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
					<div
						className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse"
						style={{ animationDelay: "2s" }}
					></div>

					<div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
						<ContactInfo
							infoItems={infoItems}
							containerVariants={containerVariants}
							itemVariants={itemVariants}
						/>
						<ContactForm />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
