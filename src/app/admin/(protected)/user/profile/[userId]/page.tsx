import BreadCrumb from "@/components/Breadcrumb";
import paths from "@/utils/paths";

type UserProfilePageProps = {
    params: { userId: string }
};

const UserProfilePage = ({ params }: UserProfilePageProps) => {
    const { userId } = params;

    const breadcrumbMain = {
        path: paths.admin.dashboard,
        name: "Dashboard",
    };

    const breadcrumbPaths = [
        {
            path: paths.admin.user.profile.main,
            name: "Profile",
        }
    ];

    return (
        <div>
            <BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
            UserProfile { userId }
        </div>
    );
}

export default UserProfilePage;