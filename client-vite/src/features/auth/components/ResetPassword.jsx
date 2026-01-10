import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiLockClosed, HiShieldCheck, HiArrowLeft } from "react-icons/hi";
import { Button, Input } from "../../../shared/components/ui";
import { useResetPassword } from "../hooks/useUserQueries";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const resetPasswordSchema = z
	.object({
		code: z.string().length(6, "Code must be exactly 6 characters"),
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

const ResetPassword = () => {
	const navigate = useNavigate();
	const { mutate: resetPasswordMutation, isPending } = useResetPassword();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = (data) => {
		resetPasswordMutation(data, {
			onSuccess: () => {
				toast.success("Password reset successfully!");
				setTimeout(() => {
					navigate("/feed");
				}, 100);
			},
			onError: (error) => {
				toast.error(error?.response?.data?.message || "Failed to reset password");
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Reset Password
				</h2>
				<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Enter the 6-digit code sent to your email and your new password.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<Input
					label="Reset Code"
					icon={HiShieldCheck}
					type="text"
					placeholder="123456"
					maxLength={6}
					{...register("code")}
					error={errors.code?.message}
				/>

				<Input
					label="New Password"
					icon={HiLockClosed}
					type="password"
					placeholder="••••••••"
					{...register("password")}
					error={errors.password?.message}
				/>

				<Input
					label="Confirm New Password"
					icon={HiLockClosed}
					type="password"
					placeholder="••••••••"
					{...register("confirmPassword")}
					error={errors.confirmPassword?.message}
				/>

				<Button
					type="submit"
					className="w-full py-3"
					disabled={isPending}
				>
					{isPending ? "Resetting password..." : "Reset Password"}
				</Button>

				<div className="text-center">
					<Link
						to="/forgot-password"
						className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
					>
						<HiArrowLeft className="mr-2 h-4 w-4" />
						Back to Forgot Password
					</Link>
				</div>
			</form>
		</div>
	);
};

export default ResetPassword;
