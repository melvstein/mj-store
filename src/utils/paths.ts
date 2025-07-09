const paths = {
    home: "/",
    customer: {
        account: "/customer/account",
        cart: "/customer/cart",
        login: "/customer/login",
        logout: "/customer/logout",
    },
    admin: {
        dashboard: {
            main: {
                path: "/admin",
                name: "Dashboard",
            }
        },
        login: {
            path: "/admin/login",
            name: "Login",
        },
        user: {
            profile: {
                main: {
                    path: "/admin/user/profile",
                    name: "Profile",
                },
                update: {
                    path: "/admin/user/profile/update",
                    name: "Update"
                },
            },
        },
        users: {
            main: {
                path: "/admin/users",
                name: "Users",
            },
            register: {
                path: "/admin/users/register",
                name: "Register",
            },
        },
        customers: {
            main: {
                path: "/admin/customers",
                name: "Customers",
            }
        },
        products: {
            main: {
                path: "/admin/products",
                name: "Products",
            },
        },
    },
};

export default paths;