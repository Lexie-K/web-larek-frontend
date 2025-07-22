import { IEvents } from '../components/base/events';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	isAddedToCart?: boolean;
}

export interface ICartItem {
	id: string;
	title: string;
	price: number;
	quantity?: number;
}

export type IDeliveryAddress = string;

export type IPaymentMethod = 'Онлайн' | 'При получении';

export interface IBuyerContact {
	email: string;
	phone: string;
}
export interface IOrderForm {
	payment: IPaymentMethod;
	address: IDeliveryAddress;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	id?: string;
	items: string[];
	total: number;
}

export interface IBaseView<T = void> {
	render(data?: T): HTMLElement;
	show?(): void;
	hide?(): void;
	bindEvents?(): void;
}

export interface IProductCatalogView extends IBaseView {
	render(): HTMLElement;
	updateCatalog(products: IProduct[]): void;
	onProductCardClick(handler: (productId: string) => void): void;
	onCartIconClick(handler: () => void): void;
	setCartCounter(count: number): void;
}
export interface IModalData {
	content: HTMLElement;
}

export interface IProductDetailModalView extends IBaseView {
	showProductDetails(product: IProduct): void;
	onBuyButtonClick(handler: (productId: string) => void): void;
	onRemoveButtonClick(handler: (productId: string) => void): void;
	onClose(handler: () => void): void;
	setBuyButtonState(isAdded: boolean): void;
}

export interface ICartView extends IBaseView<void> {
	updateCart(items: ICartItem[], total: number): void;
	onRemoveCartItemClick(handler: (productId: string) => void): void;
	onCheckoutClick(handler: () => void): void;
	onClose(handler: () => void): void;
}

export interface IMessageModalView extends IBaseView {
	render(): HTMLElement;
	showMessage(message?: string): void;
	onClose(handler: () => void): void;
}
export interface ICheckoutStep1View extends IBaseView {
	onPaymentMethodSelect(handler: (method: IPaymentMethod) => void): void;
	onAddressInput(handler: (address: IDeliveryAddress) => void): void;
	onNextStepClick(handler: () => void): void;
	showAddressError(message: string): void;
	setNextButtonEnabled(enabled: boolean): void;
	setPaymentMethod(method: IPaymentMethod | null): void;
	setAddress(address: IDeliveryAddress): void;
	render(): HTMLElement;
}
export interface ICheckoutStep2View extends IBaseView {
	onEmailInput(handler: (email: string) => void): void;
	onPhoneInput(handler: (phone: string) => void): void;
	onSubmitClick(handler: () => void): void;
	showEmailError(message: string): void;
	showPhoneError(message: string): void;
	setSubmitButtonEnabled(enabled: boolean): void;
	setEmail(email: string): void;
	setPhone(phone: string): void;
	render(): HTMLElement;
}
export interface IStoreModel extends IEvents {
	loadProducts(productsData: IProduct[]): void;
	getProductById(productId: string): IProduct | undefined;

	addToCart(product: IProduct): void;
	removeFromCart(productId: string): void;
	getCartItems(): ICartItem[];
	getCartTotal(): number;
	clearCart(): void;

	setPaymentMethod(method: IPaymentMethod): void;
	setDeliveryAddress(address: IDeliveryAddress): boolean;
	setBuyerContact(contact: IBuyerContact): boolean;
	placeOrder(): Promise<IOrder>;
	resetOrder(): void;
}
export interface IBasePresenter {
	init(): void;
	destroy(): void;
}
