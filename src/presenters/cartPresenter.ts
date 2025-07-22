import { EventEmitter } from '../components/base/events';
import { IStoreModel, ICartView } from '../types';
import { Modal } from '../components/modal/Modal';

export class CartPresenter {
	protected readonly model: IStoreModel;
	protected readonly view: ICartView;
	protected readonly events: EventEmitter;
	protected readonly modal: Modal;

	constructor(
		model: IStoreModel,
		view: ICartView,
		events: EventEmitter,
		modal: Modal
	) {
		this.model = model;
		this.view = view;
		this.events = events;
		this.modal = modal;

		this.init();
	}

	init(): void {
		this.events.on('cartUpdated', this.handleCartUpdated.bind(this));

		this.view.onRemoveCartItemClick(this.onRemoveItemClicked.bind(this));
		this.view.onCheckoutClick(this.onCheckoutClicked.bind(this));
	}

	private handleCartUpdated(): void {
		if (this.modal.isOpen()) {
			const cartItems = this.model.getCartItems();
			const cartTotal = this.model.getCartTotal();
			this.view.updateCart(cartItems, cartTotal);
		}
	}

	showCart(): void {
		const cartItems = this.model.getCartItems();
		const cartTotal = this.model.getCartTotal();
		const cartContentElement = this.view.render();

		this.view.updateCart(cartItems, cartTotal);
		this.modal.open(cartContentElement);
	}

	private onRemoveItemClicked(productId: string): void {
		this.model.removeFromCart(productId);
	}

	private onCheckoutClicked(): void {	
		this.events.emit('order:start');
	}
}
