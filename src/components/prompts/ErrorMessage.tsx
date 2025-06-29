type ErrorMessageParams = {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageParams) => {

    return (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {message}</span>
        </div>
    );

}

export default ErrorMessage;