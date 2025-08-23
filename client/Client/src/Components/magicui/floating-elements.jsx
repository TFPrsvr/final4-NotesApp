import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function FloatingElements({ 
  children, 
  className,
  count = 5,
  colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"],
  ...props 
}) {
  const elements = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: Math.random() * 40 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={cn(
            "absolute rounded-full opacity-20 blur-sm",
            element.color
          )}
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {children}
    </div>
  );
}