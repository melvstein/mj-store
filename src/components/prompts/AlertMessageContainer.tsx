import { Bounce, ToastContainer } from "react-toastify";

const AlertMessageContainer = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={"colored"}
            transition={Bounce}
        />
    );
}

export default AlertMessageContainer;