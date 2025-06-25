// components/ui/skeleton.tsx
import React from "react";
import clsx from "clsx";

const Skeleton = ({className}: {className?: string;}) => {
    return (
        <div
            className={clsx(
                "animate-pulse bg-red-500 rounded-md",
                className
            )}
        />
    );
};

export default Skeleton;