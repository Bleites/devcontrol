'use client';

import { createContext, ReactNode, useState } from 'react';
import { TicketProps } from '@/utils/tickets.type';
import { CustomerProps } from '@/utils/customer.type';
import { ModalTicket } from '@/components/modal';

// aqui criamos a interface para nos reger sobre aquilo que queremos que seja uniforme
interface ModalContextData {
	// vamos ter um boolean para ser false ou true e uma function que faça mudar os valores do nosso boolean
	visible: boolean;
	handleModalVisible: () => void;
	ticket: TicketInfo | undefined;
	setDetailTicket: (detail: TicketInfo) => void; //como não tem return retorna void antes de ser activada
}

interface TicketInfo {
	ticket: TicketProps;
	customer: CustomerProps | null;
}

// aqui criamos o nosso context
export const ModalContext = createContext({} as ModalContextData);

// aqui vai o nosso provider que vai receber a children as ReactNode que é o que o next nos pede
export const ModalProvider = ({ children }: { children: ReactNode }) => {
	// aqui istanciamos o nosso state boolean
	const [visible, setVisible] = useState(false);
	const [ticket, setTicket] = useState<TicketInfo>();

	// e aqui instanciamos a nossa function para fazer a troca do estado do boolean
	function handleModalVisible() {
		setVisible(!visible);
	}

	// aqui vamos fazer uma function para enviar os detalhes do ticket e do costumer
	function setDetailTicket(detail: TicketInfo) {
		setTicket(detail);
	}

	return (
		// vamos aqui exportar o que precisamos pelo nosso provider para poder usar na nossa pagina
		<ModalContext.Provider
			value={{ visible, handleModalVisible, ticket, setDetailTicket }}
		>
			{visible && <ModalTicket></ModalTicket>}
			{children}
		</ModalContext.Provider>
	);
};
