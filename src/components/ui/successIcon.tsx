import { motion } from "framer-motion"

const SuccessIcon = () => {
  return (
    <motion.svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="green"
        strokeWidth="5"
        fill="none"
      />
      <motion.path
        d="M30 50 L45 65 L70 35"
        stroke="green"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  )
}

export default SuccessIcon
