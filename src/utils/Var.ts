class Var {
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

    status = {
        authenticated: this.authenticated,
        unauthenticated: this.unauthenticated,
        loading: this.loading,
    } as const;
}

const varInstance = new Var();

export default varInstance;