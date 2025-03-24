class Var {
    appName = process.env.NEXT_PUBLIC_APP_NAME || "APP NAME";
    main = "Main";
    authenticated = "authenticated";
    unauthenticated = "unauthenticated";
    loading = "loading";
    signIn = "Sign In";
    signOut = "Sign Out";
    logIn = "Log In";
    logOut = "Log Out";
    home = "Home";
    products = "Products";
    cart = "Cart";
    manageAccount = "Manage Account";

    status = {
        authenticated: this.authenticated,
        unauthenticated: this.unauthenticated,
        loading: this.loading,
    } as const;
}

const varInstance = new Var();

export default varInstance;