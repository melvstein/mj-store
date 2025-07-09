import BreadCrumb from "@/components/Breadcrumb";
import paths from "@/utils/paths";
import path from "path";

const ProductPage = () => {
    const breadcrumbMain = {
        path: paths.admin.dashboard,
        name: "Dashboard",
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.products.main,
            name: "Products",
        }
    ];

    return (
        <div>
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            Product Page
        </div>
    );
};

export default ProductPage;