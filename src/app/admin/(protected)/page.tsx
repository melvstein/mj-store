import DemoChartAreaInteractive from "@/components/Demo/DemoChartAreaInteractive"
import DemoChartBarInteractive from "@/components/Demo/DemoChartBarInteractive"
import UsersChart from "../components/charts/UsersChart"
import CustomersChart from "../components/charts/CustomersChart"
import ProductsChart from "../components/charts/ProductsChart"

const AdminPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="w-full">
                <UsersChart />
            </div>
            <div className="w-full">
                <CustomersChart />
            </div>
            <div className="w-full">
                <ProductsChart />
            </div>
            <div className="col-span-full">
                <DemoChartAreaInteractive />
            </div>
            <div className="col-span-full">
                <DemoChartBarInteractive />
            </div>
        </div>
    </div>
  )
}

export default AdminPage