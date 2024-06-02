'use client';
import { useContext } from 'react';
import { ModalContext } from '@/providers/modal';

import { CustomerProps } from '@/utils/customer.type';
import { TicketProps } from '@/utils/tickets.type';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

import { FiCheckSquare, FiFile } from 'react-icons/fi';

interface TicketItemProps {
	ticket: TicketProps;
	customer: CustomerProps | null;
}

export function TicketItem({ customer, ticket }: TicketItemProps) {
	const router = useRouter();

	async function handleChangeStatus() {
		try {
			const response = await api.patch('/api/ticket', {
				id: ticket.id,
			});
		} catch (error) {
			console.log(error);
		}
		router.refresh();
	}

	const { handleModalVisible, setDetailTicket } = useContext(ModalContext);

	function handleCheckModal() {
		handleModalVisible();
		setDetailTicket({
			customer: customer,
			ticket: ticket,
		});
	}

	return (
		<>
			<tr className="border-b-2 border-b-slate-200 h-16 last:border-b-0 bg-slate-100 hover:bg-gray-200 duration-300">
				<td className="text-left pl-1">{customer?.name}</td>
				<td className="text-left hidden sm:table-cell">
					{ticket.created_at?.toLocaleDateString('pt-br')}
				</td>
				<td className="text-left">
					<span className="bg-green-500 px-2 py-1 rounded">
						{ticket.status}
					</span>
				</td>
				<td className="text-left">
					<button className="mr-2" onClick={handleChangeStatus}>
						<FiCheckSquare size={26} color="#778477" />
					</button>
					<button className="mr-2" onClick={handleCheckModal}>
						<FiFile size={26} color="#3B82F6" />
					</button>
				</td>
			</tr>
		</>
	);
}
