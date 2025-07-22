import BreadCrumb from "@/components/Breadcrumb";
import paths from "@/utils/paths";
import path from "path";
import { ProductDataTable } from "./components/ProductDataTable";

const ProductPage = () => {
    const breadcrumbMain = {
        path: paths.admin.dashboard.main.path,
        name: paths.admin.dashboard.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.products.main.path,
            name: paths.admin.products.main.name,
        }
    ];

    return (
        <div>
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <ProductDataTable />
        </div>
    );
};

export default ProductPage;