import { Api } from '../components/base/api';
import { EventEmitter } from '../components/base/events';
import { ProductCatalogPresenter } from './productCatalogPresenter';
import { ProductCatalog } from '../components/productCatalogView';
import { IProduct, IStoreModel, IOrder } from '../types';
import { StoreModel } from '../model/storeModel';
import { ProductDetailModal } from '../components/productDetailModalView';
import { ProductDetailPresenter } from './productDetailPresenter';
import { Modal } from '../components/modal/Modal';
import { cloneTemplate } from '../utils/utils';
import { CartView } from '../components/cartView';
import { CartPresenter } from './cartPresenter';
import { CheckoutStep1View } from '../components/checkoutStep1View';
import { CheckoutStep2View } from '../components/checkoutStep2View';
import { CheckoutPresenter } from './checkoutPresenter';
import { MessageModalView } from '../components/messageModalView';
import { PageView } from '../components/pageView';

export class AppPresenter {
	protected readonly api: Api;
	protected readonly model: IStoreModel;
	protected readonly events: EventEmitter;
	protected readonly appModal: Modal;
	protected readonly productDetailModalView: ProductDetailModal;
	protected readonly productDetailPresenter: ProductDetailPresenter;
	protected readonly productCatalogView: ProductCatalog;
	protected readonly productCatalogPresenter: ProductCatalogPresenter;
	protected readonly cartView: CartView;
	protected readonly cartPresenter: CartPresenter;
	protected readonly checkoutStep1View: CheckoutStep1View;
	protected readonly checkoutStep2View: CheckoutStep2View;
	protected readonly messageModalView: MessageModalView;
	protected readonly checkoutPresenter: CheckoutPresenter;
	protected readonly pageView: PageView;

	constructor(
		api: Api,
		events: EventEmitter,
		galleryElement: HTMLElement,
		productCardTemplate: HTMLTemplateElement,
		modalContainer: HTMLElement,
		productPreviewTemplate: HTMLTemplateElement,
		cartTemplate: HTMLTemplateElement,
		cartItemTemplate: HTMLTemplateElement,
		orderFormTemplate: HTMLTemplateElement,
		contactsFormTemplate: HTMLTemplateElement,
		successMessageTemplate: HTMLTemplateElement
	) {
		this.api = api;
		this.events = events;

		this.model = new StoreModel(this.events);

		this.productCatalogView = new ProductCatalog(
			galleryElement,
			productCardTemplate
		);
		this.productCatalogPresenter = new ProductCatalogPresenter(
			this.model,
			this.productCatalogView,
			this.events
		);

		this.appModal = new Modal(modalContainer, this.events);
		this.pageView = new PageView(document.body);

		this.productDetailModalView = new ProductDetailModal(
			cloneTemplate(productPreviewTemplate)
		);
		this.productDetailPresenter = new ProductDetailPresenter(
			this.model,
			this.productDetailModalView,
			this.events,
			this.appModal
		);

		this.cartView = new CartView(cloneTemplate(cartTemplate), cartItemTemplate);
		this.cartPresenter = new CartPresenter(
			this.model,
			this.cartView,
			this.events,
			this.appModal
		);

		this.checkoutStep1View = new CheckoutStep1View(
			cloneTemplate(orderFormTemplate)
		);
		this.checkoutStep2View = new CheckoutStep2View(
			cloneTemplate(contactsFormTemplate)
		);

		this.messageModalView = new MessageModalView(successMessageTemplate.id);

		this.checkoutPresenter = new CheckoutPresenter(
			this.model,
			this.events,
			this.appModal,
			this.checkoutStep1View,
			this.checkoutStep2View,
			this.messageModalView
		);
	}

	init(): void {
		this.api
			.get('product')
			.then((data: { items: IProduct[] }) => {
				this.model.loadProducts(data.items);
			})
			.catch((err) => {
				console.error('Error loading products:', err);
			});

		this.events.on('product:open', (data: { id: string }) => {
			this.productDetailPresenter.showProductDetails(data.id);
		});

		this.events.on('cart:open', () => {
			this.cartPresenter.showCart();
		});

		this.events.on('modal:open', () => {
			this.pageView.setLocked(true);
		});

		this.events.on('modal:close', () => {
			this.pageView.setLocked(false);
		});

		this.events.on('order:start', () => {
			//
		});

		this.events.on('order:readyForPlacement', (orderData: IOrder) => {
			this.api
				.post('order', orderData)
				.then((response: IOrder) => {
					this.model.confirmOrderPlacement(response);
				})
				.catch((error) => {
					console.error('AppPresenter: Failed to place order via API:', error);
					this.events.emit('order:error', error);
				});
		});
		this.appModal.close();
	}
}
