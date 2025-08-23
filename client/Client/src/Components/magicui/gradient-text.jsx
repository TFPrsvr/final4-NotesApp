import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function GradientText({ 
  children, 
  className,
  from = "from-blue-500",
  via = "via-purple-500", 
  to = "to-pink-500",
  animated = true,
  ...props 
}) {
  const gradientClass = `bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent`;
  
  if (!animated) {
    return (
      <span className={cn(gradientClass, className)} {...props}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn(gradientClass, className)}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}