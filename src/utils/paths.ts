const paths = {
    home: "/",
    customer: {
        home: {
            main: {
                path: "/",
                name: "Home",
            }
        },
        account: {
            main: {
                path: "/customer/account",
                name: "Account",
            }
        },
        cart: {
            main: {
                path: "/customer/cart",
                name: "Cart",
            }
        },
        login: {
            main: {
                path: "/customer/login",
                name: "Login",
            }
        },
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
            add: {
                path: "/admin/products/add",
                name: "Add",
            },
            edit: {
                path: "/admin/products/edit",
                name: "Edit"
            },
        },
    },
};

export default paths;