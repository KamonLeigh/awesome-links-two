import * as  React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";


type Props = {
    children?: React.ReactNode
    
  };

  const variants  = {
    out: {
        opacity: 0,
        y: 40,
        transition: {
            duration: 0.75
        }
    },
    in: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.75,
            delay: 0.5
        }
    }

  }

const Transition = ({ children }: Props) => {
    const { asPath } = useRouter();
    return (
        <div className="overflow-hidden">
            <AnimatePresence
                initial={false}
                exitBeforeEnter
                >
                <motion.div
                    key={asPath}
                    variants={variants}
                    animate="in"
                    initial="out"
                    exit="out"
                >
                    { children }
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Transition