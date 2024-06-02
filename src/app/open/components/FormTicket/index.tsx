'use client';
import { Input } from '@/components/Input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { CustomerDataInfo } from '../../page';
// import { useRouter } from 'next/navigation';

const schema = z.object({
	name: z.string().min(1, 'The ticket name is mandatory!'),
	description: z.string().min(1, 'Describe your issue...'),
});

type FormData = z.infer<typeof schema>;

interface FormTicketProps {
	customer: CustomerDataInfo;
}

export function FormTicket({ customer }: FormTicketProps) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	async function handleRegisterTicket(data: FormData) {
		const response = await api.post('/api/ticket', {
			name: data.name,
			description: data.description,
			customerId: customer.id,
		});

		console.log(response.data);
		setValue('name', '');
		setValue('description', '');
	}

	return (
		<form
			className="bg-slate-200 mt-6 px-4 py-6 rounded border-2"
			onSubmit={handleSubmit(handleRegisterTicket)}
		>
			<label className="mb-1 font-medium text-lg">Ticket Name:</label>
			<Input
				register={register}
				type="text"
				placeholder="write the ticket name..."
				name="name"
				error={errors.name?.message}
			/>

			<label className="mb-1 font-medium text-lg">Describe the issue:</label>
			<textarea
				className="w-full border-2 rounded-md h-24 resize-none px-2"
				placeholder="describe your problem..."
				id="description"
				{...register('description')}
			></textarea>
			{errors.description?.message && (
				<p className="text-red-500 my-1 mt-1 mb-4">
					{errors.description?.message}
				</p>
			)}

			<button
				type="submit"
				className="bg-blue-500 rounded-md w-full h-11 px-2 text-white font-bold"
			>
				Register
			</button>
		</form>
	);
}
