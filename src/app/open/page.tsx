'use client';
import { useState } from 'react';
import { Input } from '@/components/Input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FiSearch, FiX } from 'react-icons/fi';
import { FormTicket } from './components/FormTicket';
import { api } from '@/lib/api';

const schema = z.object({
	email: z
		.string()
		.email('Write here your email address.')
		.min(1, 'Email is mandatory.'),
});

type FormData = z.infer<typeof schema>;

export interface CustomerDataInfo {
	id: string;
	name: string;
}

export default function OpenTicket() {
	const [customer, setCustomer] = useState<CustomerDataInfo | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		setError,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	function handleClearCustomer() {
		setCustomer(null);
		setValue('email', '');
	}

	async function handleSearchCustomer(data: FormData) {
		const response = await api.get('/api/customer', {
			params: {
				email: data.email,
			},
		});

		if (response.data === null) {
			setError('email', {
				type: 'custom',
				message: 'Ops, customer not found!',
			});
			return;
		}

		// console.log(response.data);
		setCustomer({
			id: response.data.id,
			name: response.data.name,
		});
	}

	return (
		<div className="w-full max-w-2xl mx-auto px-2">
			<h1 className="font-bold text-3xl text-center mt-24">Open Ticket</h1>

			<main className="flex flex-col mt-4 mb-2">
				{customer ? (
					<div className="bg-slate-200 py-6 px-4 rounded border-2 flex items-center justify-between">
						<p className="text-lg">
							<strong>Customer selected:</strong> {customer.name}
						</p>
						<button
							onClick={handleClearCustomer}
							className="h-11 px-2 flex items-center justify-center rounded"
						>
							<FiX size={30} color="#ff0000" />
						</button>
					</div>
				) : (
					<form
						className="bg-slate-200 py-6 px-2 rounded border-2"
						onSubmit={handleSubmit(handleSearchCustomer)}
					>
						<div className="flex flex-col gap-3">
							<Input
								name="email"
								placeholder="write your customer email.."
								type="text"
								error={errors.email?.message}
								register={register}
							/>

							<button
								type="submit"
								className="bg-blue-500 flex flex-row gap-4 px-2 h-11 items-center justity-center text-white font-bold rounded"
							>
								Search Customer <FiSearch size={24} color="#FFF" />
							</button>
						</div>
					</form>
				)}

				{customer !== null && <FormTicket customer={customer} />}
			</main>
		</div>
	);
}
