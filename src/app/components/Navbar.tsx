const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between bg-blue-400 text-white">
            <div className="flex items-center justify-center">
                <a href="" className="px-4 py-2 hover:bg-white hover:text-blue-400">MJ STORE</a>
            </div>
            <ul className="flex items-center justify-between">
                <li className="flex items-center justify-center">
                    <a href="" className="px-4 py-2 hover:bg-white hover:text-blue-400">Products</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="" className="px-4 py-2 hover:bg-white hover:text-blue-400">Cart</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="" className="px-4 py-2 hover:bg-white hover:text-blue-400">Login</a>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;