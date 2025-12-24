import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiMail, HiLockClosed, HiUser, HiIdentification } from "react-icons/hi";
import { Button, Input } from "../../../ui";
import { useSignUp } from "../hooks/useUserQueries";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const signUpSchema = z
	.object({
		firstName: z.string().min(2, "First name is too short"),
		lastName: z.string().min(2, "Last name is too short"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
		idNumber: z.string().min(5, "ID Number must be at least 5 digits"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const SignUp = () => {
	const navigate = useNavigate();
	const { mutate: signUpMutation, isPending } = useSignUp();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = (data) => {
		// eslint-disable-next-line no-unused-vars
		const { confirmPassword, ...userData } = data;
		signUpMutation(userData, {
			onSuccess: () => {
				toast.success("Account created successfully!");
				navigate("/feed");
			},
			onError: (error) => {
				toast.error(error?.response?.data?.message || "Registration failed");
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
				label="Student ID Number"
				icon={HiIdentification}
				placeholder="20240001"
				{...register("idNumber")}
				error={errors.idNumber?.message}
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
				<Button type="submit" className="w-full py-3" disabled={isPending}>
					{isPending ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Creating account...
						</div>
					) : (
						"Create Account"
					)}
				</Button>
			</div>

			<p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4">
				By signing up, you agree to our{" "}
				<a href="#" className="text-primary hover:underline">
					Terms of Service
				</a>{" "}
				and{" "}
				<a href="#" className="text-primary hover:underline">
					Privacy Policy
				</a>
				.
			</p>
		</form>
	);
};

export default SignUp;
