export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	isAddedToCart?: boolean;
}
export interface ICartItem {
	id: string;
	title: string;
	price: number;
	quantity?: number;
}
export interface IDeliveryAddress {
	address: string;
}

export type IPaymentMethod = 'Онлайн' | 'При получении';
export interface IBuyerContact {
	email: string;
	phone: string;
}
export interface IOrder {
	id: string;
	payment: IPaymentMethod;
	buyerContact: IBuyerContact;
	address: IDeliveryAddress;
	total: number;
	items: ICartItem[];
}
export interface IBaseView<T = void> {
  render(data?: T): HTMLElement;
	show(): void;
	hide(): void;
	bindEvents(): void;
}
export interface IProductCatalogView extends IBaseView {
	updateCatalog(products: IProduct[]): void;
	onProductCardClick(handler: (productId: string) => void): void;
	onCartIconClick(handler: () => void): void;
}
export interface IProductDetailModalView extends IBaseView {
  showProductDetails(product: IProduct): void;
	
  onBuyButtonClick(handler: (productId: string) => void): void;
	onRemoveButtonClick(handler: (productId: string) => void): void;
	onClose(handler: () => void): void;
	setBuyButtonState(isAdded: boolean): void;
}
export interface ICartView extends IBaseView {
	updateCart(items: ICartItem[], total: number): void;

	onRemoveCartItemClick(handler: (productId: string) => void): void;
	onCheckoutClick(handler: () => void): void;
	onClose(handler: () => void): void;
}
export interface IMessageModalView extends IBaseView {
	showMessage(message: string): void;
	onClose(handler: () => void): void;
}
export interface ICheckoutStep1View extends IBaseView {
	onPaymentMethodSelect(handler: (method: IPaymentMethod) => void): void;

	onAddressInput(handler: (address: IDeliveryAddress) => void): void;

	onNextStepClick(handler: () => void): void;
	showAddressError(message: string): void;
	setNextButtonEnabled(enabled: boolean): void;
}
export interface ICheckoutStep2View extends IBaseView {
	onContactInput(handler: (contact: IBuyerContact) => void): void;
	onPayButtonClick(handler: () => void): void;
	showContactError(message: string): void;
	setPayButtonEnabled(enabled: boolean): void;
}
export interface IBasePresenter {
	init(): void;
	destroy(): void;
}
