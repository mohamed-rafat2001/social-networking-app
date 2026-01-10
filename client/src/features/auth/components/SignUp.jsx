import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSignUp } from "../hooks/useUserQueries";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import SignUpProgressBar from "./detail/SignUpProgressBar";
import SignUpStep1 from "./detail/SignUpStep1";
import SignUpStep2 from "./detail/SignUpStep2";

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
		phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
		city: z.string().min(2, "City is required"),
		country: z.string().min(2, "Country is required"),
		gender: z.enum(["male", "female"], {
			errorMap: () => ({ message: "Please select your gender" }),
		}),
		userType: z.enum(
			["engineering student", "engineering teacher", "engineer"],
			{
				errorMap: () => ({ message: "Please select your profession" }),
			}
		),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const SignUp = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const { mutate: signUpMutation, isPending } = useSignUp();

	const {
		register,
		handleSubmit,
		setError,
		trigger,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		mode: "onChange",
	});

	const nextStep = async () => {
		const fieldsToValidate =
			step === 1
				? ["firstName", "lastName", "email", "password", "confirmPassword"]
				: [];

		const isValid = await trigger(fieldsToValidate);
		if (isValid) setStep(2);
	};

	const prevStep = () => setStep(1);

	const onSubmit = (data) => {
		const { confirmPassword, ...userData } = data;
		signUpMutation(userData, {
			onSuccess: () => {
				toast.success("Account created successfully!");
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
					toast.error(error?.response?.data?.message || "Registration failed");
				}
			},
		});
	};

	return (
		<div className="relative">
			<SignUpProgressBar step={step} />

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<AnimatePresence mode="wait">
					{step === 1 ? (
						<SignUpStep1
							register={register}
							errors={errors}
							nextStep={nextStep}
						/>
					) : (
						<SignUpStep2
							register={register}
							errors={errors}
							prevStep={prevStep}
							isPending={isPending}
						/>
					)}
				</AnimatePresence>

				<p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4 mt-6">
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
		</div>
	);
};

export default SignUp;
