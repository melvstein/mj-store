import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { LuSun, LuMoonStar } from "react-icons/lu";

const ThemeSwitch: React.FC = () => {
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme, setTheme } = useTheme()
	/* console.log(`Theme: ${theme}`); */

	useEffect(() => {
		setMounted(true);
	  }, [])
	
	  if (!mounted) {
		return null;
	  }

	return (
	<div className="select-none fixed bottom-5 right-5 bg-primary rounded-full sm:p-2 p-1 z-10">
		{theme === "light" ?
			<LuSun onClick={() => setTheme("dark")} className="ms:size-[30px] size-[25px] cursor-pointer fill-yellow-500 stroke-yellow-200" /> 
			:  
			<LuMoonStar onClick={() => setTheme("light")} className="ms:size-[30px] size-[25px] cursor-pointer fill-blue-300 stroke-yellow-200" />
		}
	</div>
	)
}

export default ThemeSwitch;