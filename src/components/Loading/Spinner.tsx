const Spinner = () => {
    return (
        <div>
            <div className="flex items-center justify-center h-screen">
                <svg
                    className="animate-spin h-10 w-10 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.93A8.003 8.003 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-3.008zM12 20a8.003 8.003 0 01-6.93-4.07L2.07 18A10.002 10.002 0 0012 22v-2zm6.93-1.07A8.003 8.003 0 0120 12h4c0 3.042-1.135 5.824-3 7.938l-3.07-2.008zM20 12a8.003 8.003 0 01-4.07-6.93L18 2a10.002 10.002 0 00-6-2v4a6.002 6.002 0 004.93 5z"
                    ></path>
                </svg>
            </div>
            <div className="text-center text-gray-500 mt-4"></div>
                <p>Loading...</p>
        </div>
    );
}

export default Spinner;