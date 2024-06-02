// aqui vamos receber uma children que vai ser sempre a pagina que vamos receber para
// renderizar dentro do componente

// tipagem do children que vamos receber
import React, { ReactNode } from 'react';

export function Container({ children }: { children: ReactNode }) {
	return <div className="w-full max-w-7xl mx-auto px-2">{children}</div>;
}
