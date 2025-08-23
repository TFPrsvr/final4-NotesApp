import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedText({ 
  text, 
  className,
  animation = "slideUp",
  staggerChildren = 0.05,
  ...props 
}) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 300,
        },
      },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 200,
        },
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="mr-2"
          variants={wordVariants[animation]}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}