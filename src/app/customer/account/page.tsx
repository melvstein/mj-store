"use client"

import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import clsx from "clsx";
import Loading from '@/components/Loading/Loading';
import { useGetCustomerByEmailQuery, useUpdateCustomerMutation } from '@/lib/redux/services/customersApi';
import { TAddress, TCustomer } from '@/types/TCustomer';
import { toast } from 'sonner';
import { TErrorResponse } from '@/types';
import paths from '@/utils/paths';
import Navbar from '@/components/Navbar';
import BreadCrumb from '@/components/Breadcrumb';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Response from '@/constants/Response';
import { useRouter } from 'next/navigation';

const Account: React.FC = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [customer, setCustomer] = useState<TCustomer>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		// ✅ Only redirect when status is fully known
		if (status === "unauthenticated") {
		router.push(paths.customer.login.main.path);
		}
	}, [status, router]);
	
	/* const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user); */
	const {data: response, error: apiError, isLoading: isCustomerLoading} = useGetCustomerByEmailQuery(
		session?.user?.email ?? "", // fallback to empty string if undefined or null
		{
			skip: !session?.user?.email,
		}
	);

	const error = apiError as TErrorResponse;
		
	useEffect(() => {
		if (isCustomerLoading) {
			setIsLoading(true);
		}

		if (apiError) {
			toast.error(error?.data?.message || "Failed to load user data.");
		}

		if (response?.data) {
			/* console.log("User data fetched:", response.data); */
			setCustomer(response.data);
		}
	}, [isCustomerLoading, apiError, response, error]);

    if (isLoading) {
        return <Loading onComplete={() => setIsLoading(false)} />;
    }

	if (apiError) {
		signOut({ callbackUrl: paths.customer.login.main.path });
	}

	const breadcrumbMain = {
        path: paths.customer.home.main.path,
        name: paths.customer.home.main.name,
    };

    const breadcrumbPaths = [
        {
            path: paths.customer.account.main.path,
            name: paths.customer.account.main.name,
        }
    ];

	return (
		<section className="container mx-auto py-20">
			<Navbar />
			<BreadCrumb main={breadcrumbMain} paths={breadcrumbPaths} />
			<div className='space-y-4 my-4'>
				<PersonalInformationForm customer={customer} />
				<AddressForm customer={customer} />
			</div>
		</section>
	)
}

const PersonalInformationForm = ({ customer } : { customer: TCustomer | undefined }) => {
	const [doUpdate] = useUpdateCustomerMutation();
	const [customerUpdateData, setCustomerUpdateData] = useState<{
		firstName: string;
		middleName?: string;
		lastName: string;
		contactNumber: string;
	}>({
		firstName: customer?.firstName ?? "",
		middleName: customer?.middleName ?? "",
		lastName: customer?.lastName ?? "",
		contactNumber: customer?.contactNumber ?? "",
	});

	const formUpdateSchema = z.object({
		firstName: z.string().min(1, { message: "First name is required." }),
		middleName: z.string().optional(),
		lastName: z.string().min(1, { message: "Last name is required." }),
		contactNumber: z.string().min(1, { message: "Contact number is required." })
	});

	const form = useForm<z.infer<typeof formUpdateSchema>>({
		mode: "onBlur",
		resolver: zodResolver(formUpdateSchema),
		defaultValues: {
			firstName: customer?.firstName ?? "",
			middleName: customer?.middleName ?? "",
			lastName: customer?.lastName ?? "",
			contactNumber: customer?.contactNumber ?? "",
		}
	});

	const onSubmit = async (data: z.infer<typeof formUpdateSchema>) => {
		try {
			if (!customer) {
				toast.error("Customer data is not available.");
				return;
			}
			const updateCustomer = { ...customer, 
				firstName: data.firstName, 
				middleName: data.middleName, 
				lastName: data.lastName, 
				contactNumber: data.contactNumber 
			};

			const response = await doUpdate({ id: customer.id, customer: updateCustomer }).unwrap();

			if (response?.code === Response.SUCCESS) {
				toast.success(response.message || "Customer updated successfully!");
			} else {
				toast.error(response?.message || "Customer failed to update!");
			}
		} catch (err: any) {
			if (err.data && err.data.message) {
				console.log("DB error", err.data.message);
				toast.error("Uknown error: Please contact the administrator.");
			} else {
				toast.error(err.message);
			}
		}

		setCustomerUpdateData(customerUpdateData);
	};

	const onError = (errors: any) => {
		console.log("Form errors:", errors);
		
		Object.entries(errors).forEach(([fieldName, error]: any) => {
			console.log(`${error.message}`);
			toast.error(`${fieldName}: ${error.message}`);
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<Card>
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
					</CardHeader>
					<CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="First Name" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="middleName"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Middle Name</FormLabel>
										<FormControl>
											<Input placeholder="Middle Name" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Last Name" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="contactNumber"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Contact Number</FormLabel>
										<FormControl>
											<Input placeholder="Contact Number" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</CardContent>
					<CardFooter className='flex items-center justify-end'>
						<Button>Save</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
};

const AddressForm = ({ customer } : { customer: TCustomer | undefined }) => {
	const [doUpdate] = useUpdateCustomerMutation();
	const [customerUpdateData, setCustomerUpdateData] = useState<TAddress>({
		addressType: customer?.address?.addressType ?? "home",
		street: customer?.address?.street ?? "",
		district: customer?.address?.district ?? "",
		city: customer?.address?.city ?? "",
		province: customer?.address?.province ?? "",
		country: customer?.address?.country ?? "",
		zipCode: customer?.address?.zipCode ?? 0,
		isDefault: customer?.address?.isDefault ?? true,
	});

	const formUpdateAddressSchema = z.object({
		addressType: z.string().min(1, { message: "Address type is required." }),
		street: z.string().min(1, { message: "Street is required." }),
		district: z.string().min(1, { message: "District is required." }),
		city: z.string().min(1, { message: "City is required." }),
		province: z.string().min(1, { message: "Province is required." }),
		country: z.string().min(1, { message: "Country is required." }),
		zipCode: z.number({ invalid_type_error: "Zip code must be a number." }).min(1000, { message: "Zip code must be at least 4 digits." }).max(9999, { message: "Zip code must be at most 4 digits." }),
		isDefault: z.boolean(),
	});

	const form = useForm<z.infer<typeof formUpdateAddressSchema>>({
  		mode: "onBlur",
		resolver: zodResolver(formUpdateAddressSchema),
		defaultValues: customerUpdateData
	});

	const onSubmit = async (data: z.infer<typeof formUpdateAddressSchema>) => {
		try {
			if (!customer) {
				toast.error("Customer data is not available.");
				return;
			}
			const updateCustomer = { ...customer, address: data };
			const response = await doUpdate({ id: customer.id, customer: updateCustomer }).unwrap();

			if (response?.code === Response.SUCCESS) {
				toast.success(response.message || "Customer updated successfully!");
			} else {
				toast.error(response?.message || "Customer failed to update!");
			}
		} catch (err: any) {
			if (err.data && err.data.message) {
				console.log("DB error", err.data.message);
				toast.error("Uknown error: Please contact the administrator.");
			} else {
				toast.error(err.message);
			}
		}

		setCustomerUpdateData(customerUpdateData);
	};

	const onError = (errors: any) => {
		console.log("Form errors:", errors);
		
		Object.entries(errors).forEach(([fieldName, error]: any) => {
			console.log(`${error.message}`);
			toast.error(`${fieldName}: ${error.message}`);
		});
	}

	useEffect(() => {
		if (customer?.address) {
			setCustomerUpdateData(customer.address);
			form.reset(customer.address);
		}
	}, [customer, form]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<Card>
					<CardHeader>
						<CardTitle>Address</CardTitle>
					</CardHeader>
					<CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<FormField
							control={form.control}
							name="addressType"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Address Type</FormLabel>
										<FormControl>
											<Input placeholder="home, work, etc.." {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="street"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Street</FormLabel>
										<FormControl>
											<Input placeholder="1234 Main St" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="district"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>District</FormLabel>
										<FormControl>
											<Input placeholder="District" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input placeholder="City" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="province"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Province</FormLabel>
										<FormControl>
											<Input placeholder="Province" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input placeholder="Country" {...field} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="zipCode"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Zip Code</FormLabel>
										<FormControl>
											<Input 
												type='number' 
												placeholder="Zip Code" 
												{...field}
  												onChange={(e) => field.onChange(e.target.valueAsNumber)}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="isDefault"
							render={({ field }) => {
								return (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>
												{field.value ? "Default" : "Not Default" }
											</FormLabel>
											<FormDescription>
												Toggle to set address as default or not default.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					</CardContent>
					<CardFooter className='flex items-center justify-end'>
						<Button>Save</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}

export default Account