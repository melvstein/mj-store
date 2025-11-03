import { Button } from "@/components/ui/button";
import { TOrder } from "@/types/TOrder";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const ViewInvoice = ({ order } : { order: TOrder }) => {

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button  variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 cursor-pointer text-sm">
                        View Invoice
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] min-w-[700px] min-h-[700px]">
                    <DialogHeader>
                        <DialogTitle className="flex flex-col">
                            <p className="text-3xl font-bold">INVOICE</p>
                        </DialogTitle>
                            <p>INV-{order.orderNumber}</p>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                        <div className="grid gap-4">
                        
                        </div>
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewInvoice;