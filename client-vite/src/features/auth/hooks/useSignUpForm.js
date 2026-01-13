import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSignUp } from "./useUserQueries";

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
		major: z.enum(
			[
				"aerospace engineering",
				"agricultural engineering",
				"architectural engineering",
				"biomedical engineering",
				"chemical engineering",
				"civil engineering",
				"computer engineering",
				"computer science",
				"electrical engineering",
				"environmental engineering",
				"geological engineering",
				"industrial engineering",
				"marine engineering",
				"materials science and engineering",
				"mechanical engineering",
				"mechatronics engineering",
				"mining engineering",
				"nuclear engineering",
				"petroleum engineering",
				"software engineering",
				"systems engineering",
				"other",
			],
			{
				errorMap: () => ({ message: "Please select your major" }),
			}
		),
		gender: z.enum(["male", "female"], {
			errorMap: () => ({ message: "Please select your gender" }),
		}),
		userType: z.enum(
			["engineering student", "engineering teacher", "engineer", "other"],
			{
				errorMap: () => ({ message: "Please select your profession" }),
			}
		),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const useSignUpForm = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [showWelcome, setShowWelcome] = useState(false);
	const [signedUpName, setSignedUpName] = useState("");
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
				setSignedUpName(data.firstName);
				setShowWelcome(true);
				setTimeout(() => {
					navigate("/feed");
				}, 3500);
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

	return {
		step,
		showWelcome,
		signedUpName,
		isPending,
		register,
		handleSubmit,
		errors,
		nextStep,
		prevStep,
		onSubmit,
	};
};
