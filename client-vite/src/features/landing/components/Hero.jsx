import React from "react";
import HeroDecorations from "./hero/HeroDecorations";
import HeroContent from "./hero/HeroContent";
import HeroImage from "./hero/HeroImage";

const Hero = () => {
	return (
		<section
			id="hero"
			className="pt-20 pb-20 overflow-hidden relative transition-colors duration-500"
		>
			<HeroDecorations />

			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center justify-between gap-12">
					<HeroContent />
					<HeroImage />
				</div>
			</div>
		</section>
	);
};

export default Hero;
