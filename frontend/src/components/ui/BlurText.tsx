"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  text: string;
  className?: string;
}

export default function BlurText({ text, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const words = text.split(" ");

  return (
    <p ref={ref} className={`flex flex-wrap justify-center ${className}`} style={{ rowGap: "0.1em" }}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isInView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : undefined
          }
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: "easeOut",
            delay: (i * 100) / 1000,
          }}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
