import { EventEmitter } from '../components/base/events';
import {
	IStoreModel,
	IPaymentMethod,
	IDeliveryAddress,
	IOrder,
} from '../types';
import { Modal } from '../components/modal/Modal';
import { CheckoutStep1View } from '../components/checkoutStep1View';
import { CheckoutStep2View } from '../components/checkoutStep2View';
import { MessageModalView } from '../components/messageModalView';

export class CheckoutPresenter {
	protected readonly model: IStoreModel;
	protected readonly events: EventEmitter;
	protected readonly modal: Modal;
	protected readonly checkoutStep1View: CheckoutStep1View;
	protected readonly checkoutStep2View: CheckoutStep2View;
	protected readonly messageModalView: MessageModalView;

	private currentPaymentMethod: IPaymentMethod | null = null;
	private currentAddress: IDeliveryAddress = '';
	private currentEmail = '';
	private currentPhone = '';
	private isAddressValidationActive = false;

	constructor(
		model: IStoreModel,
		events: EventEmitter,
		modal: Modal,
		checkoutStep1View: CheckoutStep1View,
		checkoutStep2View: CheckoutStep2View,
		messageModalView: MessageModalView
	) {
		this.model = model;
		this.events = events;
		this.modal = modal;
		this.checkoutStep1View = checkoutStep1View;
		this.checkoutStep2View = checkoutStep2View;
		this.messageModalView = messageModalView;

		this.init();
	}

	init(): void {
		this.events.on('order:start', this.handleOrderStart.bind(this));
		this.events.on(
			'order:step1Complete',
			this.handleOrderStep1Complete.bind(this)
		);

		this.model.on('orderPlaced', this.handleOrderPlaced.bind(this));

		this.checkoutStep1View.onPaymentMethodSelect(
			this.handlePaymentMethodSelect.bind(this)
		);
		this.checkoutStep1View.onAddressInput(this.handleAddressInput.bind(this));
		this.checkoutStep1View.onNextStepClick(this.handleNextStepClick.bind(this));

		this.checkoutStep2View.onEmailInput(this.handleEmailInput.bind(this));
		this.checkoutStep2View.onPhoneInput(this.handlePhoneInput.bind(this));
		this.checkoutStep2View.onSubmitClick(this.handleSubmitClick.bind(this));

		this.events.on('modal:close', this.resetCheckoutState.bind(this));
	}

	private handleOrderStart(): void {
		this.resetCheckoutState();
		this.showCheckoutStep1();
	}

	private showCheckoutStep1(): void {
		this.checkoutStep1View.setPaymentMethod(this.currentPaymentMethod);
		this.checkoutStep1View.setAddress(this.currentAddress);
		this.checkoutStep1View.showAddressError('');
		this.checkoutStep1View.setNextButtonEnabled(false);

		this.modal.open(this.checkoutStep1View.render());
	}

	private handlePaymentMethodSelect(method: IPaymentMethod): void {
		this.currentPaymentMethod = method;
		this.model.setPaymentMethod(method);

		if (this.currentAddress.trim() === '') {
			this.isAddressValidationActive = true;
		}
		this.validateStep1AndUpdateView();
	}

	private handleAddressInput(address: IDeliveryAddress): void {
		this.currentAddress = address;
		this.model.setDeliveryAddress(address);
		this.isAddressValidationActive = true;

		this.validateStep1AndUpdateView();
	}

	private validateStep1AndUpdateView(): void {
		const isPaymentSelected = !!this.currentPaymentMethod;
		const isAddressEntered = this.currentAddress.trim().length > 0;
		const isValidStep1 = isPaymentSelected && isAddressEntered;

		this.checkoutStep1View.setNextButtonEnabled(isValidStep1);

		if (this.isAddressValidationActive) {
			if (!isAddressEntered) {
				this.checkoutStep1View.showAddressError('Необходимо указать адрес');
			} else {
				this.checkoutStep1View.showAddressError('');
			}
		} else {
			this.checkoutStep1View.showAddressError('');
		}
	}

	private handleNextStepClick(): void {
		this.isAddressValidationActive = true;
		this.validateStep1AndUpdateView();

		const isPaymentSelected = !!this.currentPaymentMethod;
		const isAddressEntered = this.currentAddress.trim().length > 0;

		if (isPaymentSelected && isAddressEntered) {
			this.events.emit('order:step1Complete');
		}
	}

	private handleOrderStep1Complete(): void {
		this.showCheckoutStep2();
	}

	private showCheckoutStep2(): void {
		this.checkoutStep2View.setEmail(this.currentEmail);
		this.checkoutStep2View.setPhone(this.currentPhone);
		this.checkoutStep2View.showEmailError('');
		this.checkoutStep2View.showPhoneError('');
		this.modal.open(this.checkoutStep2View.render());
		this.updateSubmitButtonState();
	}

	private handleEmailInput(email: string): void {
		this.currentEmail = email;
		const isValid = this.validateEmail(email);
		this.model.setBuyerContact({ email, phone: this.currentPhone });
		this.checkoutStep2View.showEmailError(isValid ? '' : 'Некорректный email');
		this.updateSubmitButtonState();
	}

	private handlePhoneInput(phone: string): void {
		this.currentPhone = phone;
		const isValid = this.validatePhone(phone);
		this.model.setBuyerContact({ email: this.currentEmail, phone });
		this.checkoutStep2View.showPhoneError(
			isValid ? '' : 'Некорректный номер телефона'
		);
		this.updateSubmitButtonState();
	}

	private validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private validatePhone(phone: string): boolean {
		const cleanedPhone = phone.replace(/[\s()-]/g, '');
		return /^((\+7)|8|7)\d{10}$/.test(cleanedPhone);
	}

	private updateSubmitButtonState(): void {
		const isEmailValid = this.validateEmail(this.currentEmail);
		const isPhoneValid = this.validatePhone(this.currentPhone);
		const isButtonEnabled = isEmailValid && isPhoneValid;
		this.checkoutStep2View.setSubmitButtonEnabled(isButtonEnabled);
	}

	private handleSubmitClick(): void {
		if (
			this.validateEmail(this.currentEmail) &&
			this.validatePhone(this.currentPhone)
		) {
			try {
				this.model.prepareOrderForPlacement();
			} catch (error) {
				console.error('CheckoutPresenter: Order preparation failed:', error);
			}
		} else {
			this.updateSubmitButtonState();
		}
	}

	private handleOrderPlaced(order: IOrder): void {
		this.modal.close();

		const message = `Списано ${order.total} синапсов`;
		this.messageModalView.showMessage(message);

		this.messageModalView.onClose(() => {
			this.modal.close();
			this.events.emit('app:returnHome');
		});

		this.modal.open(this.messageModalView.render());
	}

	private resetCheckoutState(): void {
		this.currentPaymentMethod = null;
		this.currentAddress = '';
		this.currentEmail = '';
		this.currentPhone = '';
		this.isAddressValidationActive = false;

		this.checkoutStep1View.showAddressError('');
		this.checkoutStep1View.setNextButtonEnabled(false);
		this.checkoutStep1View.setPaymentMethod(null);
		this.checkoutStep1View.setAddress('');

		this.checkoutStep2View.showEmailError('');
		this.checkoutStep2View.showPhoneError('');
		this.checkoutStep2View.setSubmitButtonEnabled(false);
		this.checkoutStep2View.setEmail('');
		this.checkoutStep2View.setPhone('');

		this.model.resetOrder();
	}
}
