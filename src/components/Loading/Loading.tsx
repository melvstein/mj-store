"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface LoadingProps {
  onComplete?: () => void;
  duration?: number;
  children?: React.ReactNode;
}

const Loading = ({ onComplete, duration = 500, children }: LoadingProps) => {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showChildren, setShowChildren] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          return 100
        }
        return prevProgress + (100 / (duration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration])

  useEffect(() => {
    if (isComplete) {
      // Delay the callback and child render until after render cycle
      const timeout = setTimeout(() => {
        onComplete?.()
        setShowChildren(true)
      }, 0)
      return () => clearTimeout(timeout)
    }
  }, [isComplete, onComplete])

  if (showChildren && children) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
      <div className="w-full max-w-md">
        <Progress value={progress} className="w-full" />
      </div>
      <p className="text-sm text-muted-foreground">
        Loading... {Math.round(progress)}%
      </p>
    </div>
  )
}

export default Loading;
