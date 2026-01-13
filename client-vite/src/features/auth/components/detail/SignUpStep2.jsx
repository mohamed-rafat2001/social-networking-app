import React from "react";
import { motion } from "framer-motion";
import {
	HiPhone,
	HiLocationMarker,
	HiUser,
	HiBriefcase,
	HiAcademicCap,
	HiChevronLeft,
} from "react-icons/hi";
import {
	Input,
	Select,
	Button,
	Spinner,
} from "../../../../shared/components/ui";

const SignUpStep2 = ({ register, errors, prevStep, isPending }) => {
	return (
		<motion.div
			key="step2"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-4"
		>
			<Input
				label="Phone Number"
				icon={HiPhone}
				placeholder="+1 234 567 890"
				{...register("phoneNumber")}
				error={errors.phoneNumber?.message}
			/>

			<div className="grid grid-cols-2 gap-4">
				<Input
					label="City"
					icon={HiLocationMarker}
					placeholder="New York"
					{...register("city")}
					error={errors.city?.message}
				/>
				<Input
					label="Country"
					icon={HiLocationMarker}
					placeholder="USA"
					{...register("country")}
					error={errors.country?.message}
				/>
			</div>

			<Select
				label="Gender"
				icon={HiUser}
				{...register("gender")}
				error={errors.gender?.message}
			>
				<option value="">Select gender</option>
				<option value="male">Male</option>
				<option value="female">Female</option>
			</Select>

			<Select
				label="Engineering Major"
				icon={HiAcademicCap}
				{...register("major")}
				error={errors.major?.message}
			>
				<option value="">Select your major</option>
				<option value="aerospace engineering">Aerospace Engineering</option>
				<option value="agricultural engineering">
					Agricultural Engineering
				</option>
				<option value="architectural engineering">
					Architectural Engineering
				</option>
				<option value="biomedical engineering">Biomedical Engineering</option>
				<option value="chemical engineering">Chemical Engineering</option>
				<option value="civil engineering">Civil Engineering</option>
				<option value="computer engineering">Computer Engineering</option>
				<option value="computer science">Computer Science</option>
				<option value="electrical engineering">Electrical Engineering</option>
				<option value="environmental engineering">
					Environmental Engineering
				</option>
				<option value="geological engineering">Geological Engineering</option>
				<option value="industrial engineering">Industrial Engineering</option>
				<option value="marine engineering">Marine Engineering</option>
				<option value="materials science and engineering">
					Materials Science & Engineering
				</option>
				<option value="mechanical engineering">Mechanical Engineering</option>
				<option value="mechatronics engineering">
					Mechatronics Engineering
				</option>
				<option value="mining engineering">Mining Engineering</option>
				<option value="nuclear engineering">Nuclear Engineering</option>
				<option value="petroleum engineering">Petroleum Engineering</option>
				<option value="software engineering">Software Engineering</option>
				<option value="systems engineering">Systems Engineering</option>
				<option value="other">Other</option>
			</Select>

			<Select
				label="Profession"
				icon={HiBriefcase}
				{...register("userType")}
				error={errors.userType?.message}
			>
				<option value="">Select your profession</option>
				<option value="engineering student">Engineering Student</option>
				<option value="engineering teacher">Engineering Teacher</option>
				<option value="engineer">Engineer</option>
				<option value="other">Other</option>
			</Select>

			<div className="grid grid-cols-2 gap-4 pt-2">
				<Button
					type="button"
					variant="secondary"
					onClick={prevStep}
					className="py-3 gap-2"
				>
					<HiChevronLeft size={20} /> Back
				</Button>
				<Button type="submit" className="py-3" disabled={isPending}>
					{isPending ? (
						<div className="flex items-center gap-2">
							<Spinner size="sm" variant="white" />
							Signing up...
						</div>
					) : (
						"Create Account"
					)}
				</Button>
			</div>
		</motion.div>
	);
};

export default SignUpStep2;
