import React from "react";
import { motion } from "framer-motion";
import { HiUser, HiMail, HiLockClosed, HiChevronRight } from "react-icons/hi";
import { Input, Button } from "../../../../shared/components/ui";

const SignUpStep1 = ({ register, errors, nextStep }) => {
	return (
		<motion.div
			key="step1"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			className="space-y-4"
		>
			<div className="grid grid-cols-2 gap-4">
				<Input
					label="First Name"
					icon={HiUser}
					placeholder="John"
					{...register("firstName")}
					error={errors.firstName?.message}
				/>
				<Input
					label="Last Name"
					icon={HiUser}
					placeholder="Doe"
					{...register("lastName")}
					error={errors.lastName?.message}
				/>
			</div>

			<Input
				label="University Email"
				icon={HiMail}
				type="email"
				placeholder="john.doe@university.edu"
				{...register("email")}
				error={errors.email?.message}
			/>

			<Input
				label="Password"
				icon={HiLockClosed}
				type="password"
				placeholder="••••••••"
				{...register("password")}
				error={errors.password?.message}
			/>

			<Input
				label="Confirm Password"
				icon={HiLockClosed}
				type="password"
				placeholder="••••••••"
				{...register("confirmPassword")}
				error={errors.confirmPassword?.message}
			/>

			<div className="pt-2">
				<Button type="button" onClick={nextStep} className="w-full py-3 gap-2">
					Next Details <HiChevronRight size={20} />
				</Button>
			</div>
		</motion.div>
	);
};

export default SignUpStep1;
