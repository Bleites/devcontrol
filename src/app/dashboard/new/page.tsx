import { Container } from '@/components/container';
import Link from 'next/link';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

// para ir buscar os nossos clientes á base de dados
import prismaClient from '@/lib/prisma';

export default async function NewTicket() {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		redirect('/');
	}

	// get de clientes da nossa base de dados
	const customers = await prismaClient.customer.findMany({
		where: {
			// aqui estamos a ir buscar todos os customers aka clients que estão registados no utilizador logado
			userId: session.user.id,
		},
	});

	// aqui estamos a usar um form de server side ,que vai usar as props de name de cada elemnto do nosso form
	// para ir buscar os dados, como estamos a usar uma server side function ela tem de ser declarada no corpo da função e ser async
	async function handleRegisterTicket(formData: FormData) {
		'use server';
		// agora vamos buscar os dados usando o formData

		const name = formData.get('name'); //atenção que aqui usamos o nome que demos na prop name de cada elmento
		const description = formData.get('description');
		const customerId = formData.get('customer');

		if (!name || !description || !customerId) {
			return;
		}

		// como estamos do lado do server podemos já entrar na nossa base de dados do prisma
		await prismaClient.ticket.create({
			data: {
				name: name as string,
				description: description as string,
				customerId: customerId as string,
				status: 'OPEN',
				userId: session?.user.id,
			},
		});

		console.log('ticket aberto com sucesso');
		redirect('/dashboard');
	}

	return (
		<Container>
			<main className="mt-9 mb-2">
				<div className="flex items-center gap-3">
					<Link
						href="/dashboard"
						className="text-white px-4 py-1 rounded bg-gray-900"
					>
						Back
					</Link>
					<h1 className="text-3xl font-bold">New Tickets</h1>
				</div>

				<form className="flex flex-col mt-6" action={handleRegisterTicket}>
					<label className="mb-1 font-medium text-lg">Ticket Name:</label>
					<input
						className="w-full border-2 rounded-md px-2 mb-2 h-11"
						type="text"
						placeholder="Type the ticket name."
						required
						name="name"
					/>

					<label className="mb-1 font-medium text-lg">Description:</label>
					<textarea
						className="w-full border-2 rounded-md px-2 mb-2 h-24 resize-none"
						placeholder="Describe the problem with a few words.."
						required
						name="description"
					></textarea>

					{customers.length !== 0 && (
						<>
							<label className="mb-1 font-medium text-lg">Select client:</label>
							<select
								className="w-full border-2 rounded-md px-2 mb-2 h-11 bg-11"
								name="customer"
							>
								{customers.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
						</>
					)}

					{customers.length === 0 && (
						<Link href="/dashboard/customer/new">
							You have no customers registered,{' '}
							<span className="text-blue-500 font-medium">
								please try to register your first customer.
							</span>
						</Link>
					)}

					<button
						type="submit"
						className="bg-blue-500 text-white font-bold px-2 h-11 rounded-md my-4 disabled:bg-gray-400 disabled:not-allowed"
						disabled={customers.length === 0}
					>
						Register
					</button>
				</form>
			</main>
		</Container>
	);
}
