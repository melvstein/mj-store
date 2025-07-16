"use client"

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/redux/store";
import { getUser } from '@/lib/redux/slices/userSlice';
import clsx from "clsx";
import Loading from '@/components/Loading/Loading';

const Account: React.FC = () => {
	const { data: session } = useSession();
	const [tab, setTab] = useState<string>('userProfile');
	const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (session?.user?.email) {
			dispatch(getUser(session.user.email));
		}

    }, [dispatch, session?.user?.email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center pt-[180px]">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }

	return (
		<section className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto space-y-4">
			<h1 className="w-full">
				Manage Account
			</h1>
			<div className="grid grid-cols-3 rounded-lg border shadow w-full">
				<div className="col-span-1 border-r">
					<button
						onClick={() => { setTab("userProfile") }}
						className={clsx(
							"dark:text-white text-black w-full rounded-tl flex items-center justify-start px-4 py-2 border-b",
							tab === "userProfile" ? "bg-slate-100 dark:bg-slate-500" : "dark:bg-slate-400"
						)}>
							Profile
					</button>
					<button
						onClick={() => { setTab("changePassword") }}
						className={clsx(
							"dark:text-white text-black w-full rounded-tl flex items-center justify-start px-4 py-2 border-b",
							tab === "changePassword" ? "bg-slate-100 dark:bg-slate-500" : "dark:bg-slate-400"
						)}>
							Change Password
					</button>
				</div>
				<div className="col-span-2 p-4">
					<form id="userProfile" className={clsx(`${tab === 'userProfile' ? "flex" : "hidden"}`, "flex-col items-stretch justify-center space-y-4")}>
						<div>
							<label htmlFor="name" className="text-xs uppercase">Name</label>
							<input type="text" id="name" name="name" placeholder="Name" className="input-skin" defaultValue={session?.user?.name ?? ""} />
						</div>
						<div>
							<label htmlFor="username" className="text-xs uppercase">Username</label>
							<input type="text" id="username" name="username" placeholder="Username" className="input-skin" defaultValue={user?.username ?? ""} />
						</div>
						<div>
							<label htmlFor="email" className="text-xs uppercase">Email</label>
							<input type="text" id="email" name="email" placeholder="Email" className="input-skin" defaultValue={session?.user?.email ?? ""} />
						</div>

						<div className="flex items-center justify-center">
							<button className="button-skin">
								Save
							</button>
						</div>
					</form>
					<form id="changePassword" className={clsx(`${tab === 'changePassword' ? "flex" : "hidden"}`, "flex-col items-stretch justify-center space-y-4")}>
						<div>
							<label htmlFor="oldPassword" className="text-xs uppercase">Old Password</label>
							<input type="password" id="oldPassword" name="oldPassword" placeholder="Old Password" className="input-skin" />
						</div>
						<div>
							<label htmlFor="newPassword" className="text-xs uppercase">New Password</label>
							<input type="password" id="newPassword" name="newPassword" placeholder="New Password" className="input-skin" />
						</div>
						<div>
							<label htmlFor="confirmPassword" className="text-xs uppercase">New Password</label>
							<input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" className="input-skin" />
						</div>

						<div className="flex items-center justify-center">
							<button className="button-skin">
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default Account