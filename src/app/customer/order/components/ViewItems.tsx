import { Button } from "@/components/ui/button";
import OrderDetails from "./OrderDetails"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TOrder } from "@/types/TOrder";

const ViewItems = ({ order }: { order: TOrder }) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer text-sm">
                    View Items
                </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
                <DrawerHeader>
                    <DrawerTitle>All Items</DrawerTitle>
                </DrawerHeader>
                <ScrollArea className="h-[600px]">
                    <OrderDetails order={order} />
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}

export default ViewItems;