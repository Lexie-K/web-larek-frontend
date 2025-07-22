import { IStoreModel, IProduct, IProductCatalogView } from '../types';
import { EventEmitter } from '../components/base/events';

export class ProductCatalogPresenter {
	protected readonly model: IStoreModel;
	protected readonly view: IProductCatalogView;
	protected readonly events: EventEmitter;

	constructor(
		model: IStoreModel,
		view: IProductCatalogView,
		events: EventEmitter
	) {
		this.model = model;
		this.view = view;
		this.events = events;

		this.events.on('productsUpdated', this.handleProductsUpdated.bind(this));
		this.events.on('cartUpdated', this.handleCartUpdated.bind(this));

		this.view.onProductCardClick(this.onProductCardClicked.bind(this));
		this.view.onCartIconClick(this.onCartIconClicked.bind(this));
	}

	private handleProductsUpdated(data: { products: IProduct[] }): void {
		this.view.updateCatalog(data.products);
	}

	private handleCartUpdated(data: {
		cartItems: IProduct[];
		total: number;
	}): void {
		this.view.setCartCounter(data.cartItems.length);
	}

	private onProductCardClicked(productId: string): void {
		this.events.emit('product:open', { id: productId });
	}

	private onCartIconClicked(): void {
		this.events.emit('cart:open');
	}
}
