import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import React from "react";

type BreadCrumbProps = {
    main: {
        path: string;
        name: string;
    }
    paths: { path: string; name: string; }[];
};

const BreadCrumb = ({ main, paths }: BreadCrumbProps) => {
    return (
        <Breadcrumb className="w-full">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={main.path}>{ main.name }</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {
                    paths.map((path, index) => {
                        const pathsLength = paths.length;
                
                        return (
                            <React.Fragment key={index}>
                                {index < pathsLength - 1 ? (
                                    <>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={path.path}>{path.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </>
                                ) : (
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{path.name}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                )}
                            </React.Fragment>
                        );
                    })
                }
                {/* Remove hardcoded Users and Register breadcrumb items as they are now handled dynamically */}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadCrumb;