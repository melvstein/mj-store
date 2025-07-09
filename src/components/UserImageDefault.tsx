import clsx from "clsx";
import Image from "next/image";

type Props = {
    className?: string;
}

const UserImageDefault = ({ className }: Props) => {
    return (
        <div>
            <Image src={"/images/user_default.png"} width={50} height={50} alt="User Image Default" className={clsx(className, "")} />
        </div>
    );
}

export default UserImageDefault;