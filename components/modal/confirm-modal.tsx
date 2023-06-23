import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";
import Button from "@components/button";

interface Props {
	children: React.ReactNode;
	showModal: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ConfirmModal = (
	{
		children,
		showModal,
		onClose,
		onConfirm
	}: Props
) => {


	// render

	return (
		<AnimatePresence
			initial={false}
			mode='wait'
			onExitComplete={() => null}>
			{
				showModal ?
				<Modal onClose={onClose}>
					<SectionTitle>Confirmation</SectionTitle>
					{children}
					<div>
						<Button 
							role="secondary"
							onClick={onClose}>
							Annuler
						</Button>
						<Button 
							error
							onClick={onConfirm}>
							Confirmer
						</Button>
					</div>
				</Modal>
				:
				<></>
			}
		</AnimatePresence>
	)
}

export default ConfirmModal