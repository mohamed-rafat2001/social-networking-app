import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { Button, Input } from "../../../ui";
import { useLogin } from "../hooks/useUserQueries";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
	const navigate = useNavigate();
	const { mutate: loginMutation, isPending } = useLogin();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data) => {
		loginMutation(data, {
			onSuccess: () => {
				toast.success("Welcome back!");
				// Small delay to ensure token is stored and query invalidated
				setTimeout(() => {
					navigate("/feed");
				}, 100);
			},
			onError: (error) => {
				const serverErrors = error?.response?.data?.validation;
				if (serverErrors && Array.isArray(serverErrors)) {
					serverErrors.forEach((err) => {
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
					toast.error(error?.response?.data?.message || "Login failed");
				}
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<Input
				label="Email address"
				icon={HiMail}
				type="email"
				placeholder="you@university.edu"
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

			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
					/>
					<label
						htmlFor="remember-me"
						className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
					>
						Remember me
					</label>
				</div>

				<div className="text-sm">
					<a
						href="#"
						className="font-medium text-primary hover:text-primary/80 transition-colors"
					>
						Forgot your password?
					</a>
				</div>
			</div>

			<Button type="submit" className="w-full py-3" disabled={isPending}>
				{isPending ? (
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						Signing in...
					</div>
				) : (
					"Sign in"
				)}
			</Button>
		</form>
	);
};

export default Login;
