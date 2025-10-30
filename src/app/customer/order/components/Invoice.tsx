import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TOrder } from "@/types/TOrder";

const Invoice = ({ order } : { order: TOrder }) => {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>View Invoice</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default Invoice;