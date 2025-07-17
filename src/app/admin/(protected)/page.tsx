import DemoChartAreaInteractive from "@/components/Demo/DemoChartAreaInteractive"
import DemoChartBarInteractive from "@/components/Demo/DemoChartBarInteractive"
import DemoChartBarStacked from "@/components/Demo/DemoChartBarStacked"
import DemoChartPieDonutText from "@/components/Demo/DemoChartPieDonutText"
import DemoChartPieInteractive from "@/components/Demo/DemoChartPieInteractive"
import DemoChartRadialShape from "@/components/Demo/DemoChartRadialShape"

const AdminPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 gap-4 w-full">
            <div>
                <DemoChartBarStacked />
            </div>
            <div>
                <DemoChartPieDonutText />
            </div>
            <div>
                <DemoChartPieInteractive />
            </div>
            <div>
                <DemoChartRadialShape />
            </div>
            <div className="col-span-4">
                <DemoChartAreaInteractive />
            </div>
            <div className="col-span-4">
                <DemoChartBarInteractive />
            </div>
        </div>
    </div>
  )
}

export default AdminPage