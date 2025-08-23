import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Shimmer({ 
  children, 
  className,
  shimmerColor = "rgba(255, 255, 255, 0.6)",
  duration = 2,
  ...props 
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {children}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
        animate={{
          translateX: "200%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}