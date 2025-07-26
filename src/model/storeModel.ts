import { EventEmitter } from '../components/base/events';
import {
	IProduct,
	IOrder,
	IPaymentMethod,
	IDeliveryAddress,
	IBuyerContact,
	IStoreModel,
} from '../types';

export class StoreModel implements IStoreModel {
	protected _products: IProduct[];
	protected _cartItems: IProduct[];
	protected _currentOrder: IOrder;
	protected readonly events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
		this._products = [];
		this._cartItems = [];
		this._currentOrder = {
			payment: 'Онлайн',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}

	on<T extends object>(
		event: string | RegExp,
		callback: (data: T) => void
	): void {
		this.events.on(event, callback);
	}
	emit<T extends object>(event: string, data?: T): void {
		this.events.emit(event, data);
	}
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void {
		return this.events.trigger(event, context);
	}

	private mapProductsWithCartStatus(products: IProduct[]): IProduct[] {
		return products.map((product) => ({
			...product,
			isAddedToCart: this._cartItems.some((item) => item.id === product.id),
		}));
	}

	loadProducts(items: IProduct[]): void {
		this._products = items;
		this.emit('productsUpdated', { products: this.getProducts() });
	}

	getProducts(): IProduct[] {
		return this.mapProductsWithCartStatus(this._products);
	}

	getProductById(productId: string): IProduct | undefined {
		const product = this._products.find((item) => item.id === productId);
		if (product) {
			return {
				...product,
				isAddedToCart: this._cartItems.some((item) => item.id === product.id),
			};
		}
		return undefined;
	}

	addToCart(product: IProduct): void {
		if (!this._cartItems.find((item) => item.id === product.id)) {
			this._cartItems.push(product);
			this.emit('cartUpdated', {
				cartItems: this.getCartItems(),
				total: this.getCartTotal(),
			});
			this.emit('productsUpdated', { products: this.getProducts() });
		}
	}

	removeFromCart(productId: string): void {
		const initialLength = this._cartItems.length;
		this._cartItems = this._cartItems.filter((item) => item.id !== productId);
		if (this._cartItems.length < initialLength) {
			this.emit('cartUpdated', {
				cartItems: this.getCartItems(),
				total: this.getCartTotal(),
			});
			this.emit('productsUpdated', { products: this.getProducts() });
		}
	}

	getCartItems(): IProduct[] {
		return [...this._cartItems];
	}

	getCartTotal(): number {
		return this._cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	clearCart(): void {
		this._cartItems = [];
		this.emit('cartUpdated', { cartItems: this._cartItems, total: 0 });
		this.emit('productsUpdated', { products: this.getProducts() });
	}

	setPaymentMethod(method: IPaymentMethod): void {
		this._currentOrder.payment = method;
		this.emit('orderDetailsUpdated', this._currentOrder);
	}

	setDeliveryAddress(address: IDeliveryAddress): boolean {
		this._currentOrder.address = address;
		this.emit('orderDetailsUpdated', this._currentOrder);
		return true;
	}

	setBuyerContact(contact: IBuyerContact): boolean {
		this._currentOrder.email = contact.email;
		this._currentOrder.phone = contact.phone;
		this.emit('orderDetailsUpdated', this._currentOrder);
		return true;
	}

	prepareOrderForPlacement(): IOrder {
		this._currentOrder.items = this._cartItems.map((item) => item.id);
		this._currentOrder.total = this.getCartTotal();

		if (
			!this._currentOrder.payment ||
			!this._currentOrder.address ||
			!this._currentOrder.email ||
			!this._currentOrder.phone ||
			this._currentOrder.items.length === 0 ||
			this._currentOrder.total === 0
		) {
			const errorMessage =
				'Order is incomplete. Please ensure all fields are filled and items are in cart.';
			console.error(
				'Model: Validation failed before preparing order:',
				errorMessage,
				this._currentOrder
			);
			this.emit('order:error', new Error(errorMessage));
			throw new Error(errorMessage);
		}

		this.emit('order:readyForPlacement', this._currentOrder);
		return this._currentOrder;
	}

	confirmOrderPlacement(confirmedOrder: IOrder): void {
		this.clearCart();
		this.resetOrder();
		this.events.emit('orderPlaced', confirmedOrder);
	}

	resetOrder(): void {
		this._currentOrder = {
			payment: 'Онлайн',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
		this.emit('orderDetailsUpdated', this._currentOrder);
	}
}
