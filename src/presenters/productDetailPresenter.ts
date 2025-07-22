import { EventEmitter } from '../components/base/events';
import { IStoreModel } from '../types';
import { ProductDetailModal } from '../components/productDetailModalView';
import { Modal } from '../components/modal/Modal';

export class ProductDetailPresenter {
	protected readonly model: IStoreModel;
	protected readonly view: ProductDetailModal;
	protected readonly events: EventEmitter;
	protected readonly modal: Modal;
	private currentProductId: string | null = null;

	constructor(
		model: IStoreModel,
		view: ProductDetailModal,
		events: EventEmitter,
		modal: Modal
	) {
		this.model = model;
		this.view = view;
		this.events = events;
		this.modal = modal;

		this.init();
	}

	init() {
		this.events.on('cartUpdated', this.handleCartUpdated.bind(this));

		this.view.onButtonClick(this.handleBuyOrRemoveClick.bind(this));

		this.events.on('modal:close', this.onModalClosed.bind(this));
	}

	showProductDetails(productId: string): void {
		this.currentProductId = productId;
		const product = this.model.getProductById(productId);

		if (product) {
			const productDetailElement = this.view.render(product);
			this.modal.render({ content: productDetailElement });
		} else {
			console.error(`Product with ID ${productId} not found for detail modal.`);
			this.closeModal();
		}
	}

	private handleBuyOrRemoveClick(action: 'add' | 'remove') {
		if (!this.currentProductId) {
			console.error('No current product ID set for the modal button click.');
			return;
		}

		if (action === 'add') {
			const productToAdd = this.model.getProductById(this.currentProductId);
			if (productToAdd) {
				this.model.addToCart(productToAdd);
			}
		} else if (action === 'remove') {
			this.model.removeFromCart(this.currentProductId);
		}
	}

	private handleCartUpdated(): void {
		if (this.currentProductId && this.modal.isOpen()) {
			const product = this.model.getProductById(this.currentProductId);
			if (product) {
				this.view.render(product);
			}
		}
	}

	private onModalClosed(): void {
		this.currentProductId = null;
	}

	closeModal(): void {
		this.modal.close();
	}
}
