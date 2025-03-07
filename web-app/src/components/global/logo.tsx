// Types
interface LogoSize {
    size: "large" | "medium" | "small";
    text: string;
    dimensions: string;
}

const logoSizes: LogoSize[] = [
    {
        size: "small",
        text: "text-2xl font-audiowide font-bold",
        dimensions: "30"
    },
    {
        size: "medium",
        text: "text-6xl font-audiowide font-bold",
        dimensions: "70"
    },
    {   
        size: "large",
        text: "text-8xl font-audiowide font-bold",
        dimensions: "80"
    }
];

function getLogoProperties(size: "large" | "medium" | "small"): { text: string; dimensions: string } {
    const logoSize = logoSizes.find(logo => logo.size === size);
    
    if (!logoSize) {
        // This shouldn't happen with TypeScript's type checking, but providing a fallback
        throw new Error(`Invalid size: ${size}`);
    }
    
    return {
        text: logoSize.text,
        dimensions: logoSize.dimensions
    };
}

// Separated Shield Logo Component
export const ShieldLogo = ({ dimensions }: { dimensions: string }) => {
    return (
        <svg 
            width={dimensions} 
            height={dimensions} 
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c3e50" />
                    <stop offset="100%" stopColor="#34495e" />
                </linearGradient>
            </defs>
            <g>
                <path d="M100,5 L180,40 C180,100 165,150 100,195 C35,150 20,100 20,40 L100,5" 
                    fill="url(#shieldGradient)" stroke="white" strokeWidth="8" />
                <path d="M75,100 L95,120 L135,70" 
                    fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
};

// Main VeriShield Logo Component that uses the ShieldLogo
export const VeriShieldLogo = ({ size }: { size: LogoSize['size'] }) => {
    const { text, dimensions } = getLogoProperties(size);

    return (
        <div className="flex items-center justify-center">
            <div className={text}>VeriShield</div>
            <div className="ml-2">
                <ShieldLogo dimensions={dimensions} />
            </div>
        </div>
    );
};