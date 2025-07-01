import Spinner from "@/components/Loading/Spinner";

const Loading = () => {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-screen">
            <Spinner />
        </div>
    );
}

export default Loading;