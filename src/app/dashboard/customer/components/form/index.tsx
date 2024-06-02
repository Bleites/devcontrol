'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

const schema = z.object({
	name: z.string().min(1, 'Name is mandatory.'),
	email: z.string().email('Write a valid email.').min(1, 'Email is mandatory.'),
	phone: z.string().refine(
		(value) => {
			return (
				/^(?:\(\D{3}\)\s?)?\d{9}$/.test(value) ||
				/^\d{2}\s\d{9}$/.test(value) ||
				/^\d{11}$/.test(value) ||
				/^\d{12}$/.test(value)
			);
		},
		{
			message: 'The phone number should stay like (DDD) 999999999',
		}
	),
	adress: z.string(),
});

type FormData = z.infer<typeof schema>;

export function NewCustomerForm({ userId }: { userId: string }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const router = useRouter();

	async function handleRegisterCustomer(data: FormData) {
		console.log(data.adress);
		console.log(userId);
		await api.post('/api/customer', {
			name: data.name,
			phone: data.phone,
			email: data.email,
			adress: data.adress,
			userId: userId,
		});

		router.replace('/dashboard/customer');
		router.refresh();
	}

	return (
		<form
			className="flex flex-col mt-6"
			onSubmit={handleSubmit(handleRegisterCustomer)}
		>
			<label className="mb-1 text-lg font-medium">Name:</label>
			<Input
				type="text"
				name="name"
				placeholder="Write your name"
				error={errors.name?.message}
				register={register}
			/>
			<section className="flex gap-2 mt-2 flex-col sm:flex-row">
				<div className="flex-1">
					<label className="mb-1 text-lg font-medium">Cell Phone:</label>
					<Input
						type="number"
						name="phone"
						placeholder="Example +351 933444555"
						error={errors.phone?.message}
						register={register}
					/>
				</div>

				<div className="flex-1">
					<label className="mb-1 text-lg font-medium">Email:</label>
					<Input
						type="text"
						name="email"
						placeholder="Write your email address."
						error={errors.email?.message}
						register={register}
					/>
				</div>
			</section>

			<div className="mt-2">
				<label className="mb-1 text-lg font-medium">Address:</label>
				<Input
					type="text"
					name="adress"
					placeholder="Write your address."
					error={errors.adress?.message}
					register={register}
				/>
			</div>

			<button
				type="submit"
				className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold"
			>
				Register
			</button>
		</form>
	);
}
