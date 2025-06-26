const Unauthorized = () => {
    return (
        <div>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
                <p className="mt-4 text-lg">You do not have permission to access this page.</p>
            </div>
        </div>
    );
}

export default Unauthorized;