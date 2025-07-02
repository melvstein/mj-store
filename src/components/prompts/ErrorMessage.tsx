type ErrorMessageParams = {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageParams) => {

    return (
        <div className="absolute top-4 right-4 bg-red-100 border text-red-800 rounded shadow" role="alert">
            <div className="relative flex items-center justify-between p-4">
                <button className="absolute top-0 right-2 font-bold">x</button>
                <div>
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {message}</span>
                </div>
            </div>
        </div>
    );

}

export default ErrorMessage;