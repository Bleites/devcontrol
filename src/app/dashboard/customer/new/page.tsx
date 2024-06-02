import { Container } from '@/components/container';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { NewCustomerForm } from '../components/form';

export default async function NewCustomer() {
	// espera pelos dados do servidor da session, se existe ou não sessão
	const session = await getServerSession(authOptions);

	// se não existe sessão iniciada, ou não existe dados de utilizador nesta sessão
	// é redirecionado para a home.
	if (!session || !session.user) {
		redirect('/');
	}

	return (
		<Container>
			<main className="flex flex-col mt-9 mb-2">
				<div className="flex items-center gap-3">
					<Link
						href="/dashboard/customer"
						className="bg-gray-900 px-4 py-1 text-white rounded"
					>
						Back
					</Link>
					<h1 className="text-3xl font-bold">New Client</h1>
				</div>

				<NewCustomerForm userId={session.user.id}></NewCustomerForm>
			</main>
		</Container>
	);
}
