import React from "react";
import { AnimatePresence } from "framer-motion";
import SignUpProgressBar from "./detail/SignUpProgressBar";
import SignUpStep1 from "./detail/SignUpStep1";
import SignUpStep2 from "./detail/SignUpStep2";
import WelcomeLoading from "./detail/WelcomeLoading";
import { useSignUpForm } from "../hooks/useSignUpForm";

const SignUp = () => {
	const {
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
	} = useSignUpForm();

	return (
		<div className="relative">
			<AnimatePresence>
				{showWelcome && <WelcomeLoading firstName={signedUpName} />}
			</AnimatePresence>

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

				<p className="text-xs text-center text-slate-500 dark:text-slate-400 px-4 mt-6">
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
