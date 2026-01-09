import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiMail, HiLockClosed, HiUser, HiIdentification } from "react-icons/hi";
import { Button, Input, Spinner } from "../../../shared/components/UI";
import { useSignUp } from "../hooks/useUserQueries";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const signUpSchema = z
	.object({
		firstName: z.string().min(3, "First name must be at least 3 characters"),
		lastName: z.string().min(3, "Last name must be at least 3 characters"),
		email: z.string().email("Invalid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^A-Za-z0-9]/,
				"Password must contain at least one special character"
			),
		confirmPassword: z.string(),
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
		setError,
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
				// Small delay to ensure token is stored and query invalidated
				setTimeout(() => {
					navigate("/feed");
				}, 100);
			},
			onError: (error) => {
				const serverErrors = error?.response?.data?.validation;
				if (serverErrors && Array.isArray(serverErrors)) {
					serverErrors.forEach((err) => {
						// Map server field names to client field names if they differ
						const fieldName = err.path || err.param;
						if (fieldName) {
							setError(fieldName, {
								type: "server",
								message: err.msg || err.message,
							});
						}
					});
					toast.error("Please fix the errors below");
				} else {
					toast.error(error?.response?.data?.message || "Registration failed");
				}
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
							<Spinner size="sm" variant="white" />
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
