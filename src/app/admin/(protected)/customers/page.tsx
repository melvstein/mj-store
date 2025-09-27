"use client";

import BreadCrumb from "@/components/Breadcrumb";
import paths from "@/utils/paths";
import { CustomersDataTable } from "./components/CustomersDataTable";

const CustomersPage = () => {
    const breadcrumbMain = {
        path: paths.admin.dashboard.main.path,
        name: paths.admin.dashboard.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.customers.main.path,
            name: paths.admin.customers.main.name,
        }
    ];

    return (
        <div>
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            <CustomersDataTable />
        </div>
    );
};

export default CustomersPage;