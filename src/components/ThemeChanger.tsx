import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { LuSun, LuMoonStar } from "react-icons/lu";

const ThemeChanger: React.FC = () => {
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme, setTheme } = useTheme()
	console.log(`Theme: ${theme}`);

	useEffect(() => {
		setMounted(true);
	  }, [])
	
	  if (!mounted) {
		return null;
	  }

	return (
	<div>
		{theme === 'light' ?
			<LuSun onClick={() => setTheme('dark')} className="size-[30px] cursor-pointer fill-yellow-500 stroke-yellow-200" /> 
			:  
			<LuMoonStar onClick={() => setTheme('light')} className="size-[30px] cursor-pointer fill-blue-300 stroke-yellow-200" />
		}
	</div>
	)
}

export default ThemeChanger;