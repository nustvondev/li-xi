"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type EnvelopeProps = {
    state: "idle" | "shaking" | "opening" | "opened";
    className?: string;
};

const shakeVariants: Variants = {
    idle: {
        rotate: [0, -2, 2, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
    shaking: {
        x: [-5, 5, -5, 5, 0],
        y: [-5, 5, -5, 5, 0],
        rotate: [-10, 10, -10, 10, 0],
        transition: {
            duration: 0.2, // Fast shake
            repeat: Infinity,
        },
    },
    opening: {
        scale: 1.1,
        y: -50,
        transition: { duration: 0.5 },
    },
    opened: {
        scale: 1,
        y: 0,
        opacity: 0, // Hibernate/Disappear to show message? Or stay? Let's hide it to show result card.
        transition: { duration: 0.5 },
    },
};

export function Envelope({ state, className }: EnvelopeProps) {
    return (
        <div className={cn("relative w-64 h-auto aspect-[3/4] flex items-center justify-center", className)}>
            <motion.div
                variants={shakeVariants}
                animate={state}
                className="w-full h-full relative"
            >
                {/* Use the asset provided by requirements */}
                <Image
                    src="/assets/envelope.svg"
                    alt="Lì Xì"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </motion.div>
        </div>
    );
}
