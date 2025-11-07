import BreadCrumb from "@/components/Breadcrumb";
import { OrdersDataTable } from "./components/OrdersDataTable";
import paths from "@/utils/paths";

const OrdersPage = () => {
    const breadcrumbMain = {
        path: paths.admin.dashboard.main.path,
        name: paths.admin.dashboard.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.customers.orders.path,
            name: paths.admin.customers.orders.name,
        }
    ];

    return (
        <div>
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <OrdersDataTable />
        </div>
    );
}

export default OrdersPage;