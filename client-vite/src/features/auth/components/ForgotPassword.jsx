import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiMail, HiArrowLeft } from "react-icons/hi";
import { Button, Input } from "../../../shared/components/ui";
import { useForgotPassword } from "../hooks/useUserQueries";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
	const navigate = useNavigate();
	const { mutate: forgotPasswordMutation, isPending } = useForgotPassword();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = (data) => {
		forgotPasswordMutation(data.email, {
			onSuccess: () => {
				toast.success("Reset code sent to your email!");
				navigate("/reset-password");
			},
			onError: (error) => {
				toast.error(error?.response?.data?.message || "Failed to send reset code");
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Forgot Password
				</h2>
				<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Enter your email address and we'll send you a 6-digit code to reset your password.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<Input
					label="Email address"
					icon={HiMail}
					type="email"
					placeholder="you@university.edu"
					{...register("email")}
					error={errors.email?.message}
				/>

				<Button
					type="submit"
					className="w-full py-3"
					disabled={isPending}
				>
					{isPending ? "Sending code..." : "Send Reset Code"}
				</Button>

				<div className="text-center">
					<Link
						to="/welcome"
						className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
					>
						<HiArrowLeft className="mr-2 h-4 w-4" />
						Back to Login
					</Link>
				</div>
			</form>
		</div>
	);
};

export default ForgotPassword;
