import { BaseForm, TFormInputValues } from './formView';
import { ICheckoutStep1View, IPaymentMethod, IDeliveryAddress } from '../types';
import { ensureElement } from '../utils/utils';

interface ICheckoutStep1FormData extends TFormInputValues {
  address: string;
  payment: IPaymentMethod;
}

export class CheckoutStep1View
  extends BaseForm<ICheckoutStep1FormData>
  implements ICheckoutStep1View
{
  protected _onlineButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _addressError: HTMLElement; 

  protected _onPaymentMethodSelectHandler: (method: IPaymentMethod) => void;
  protected _onAddressInputHandler: (address: IDeliveryAddress) => void;
  protected _onNextStepClickHandler: () => void;

  constructor(container: HTMLElement) {
    super(container);

    this._onlineButton = ensureElement<HTMLButtonElement>(
      '.button_alt[name="card"]',
      this.container
    );
    this._cashButton = ensureElement<HTMLButtonElement>(
      '.button_alt[name="cash"]',
      this.container
    );
    this._addressInput = ensureElement<HTMLInputElement>(
      '.form__input[name="address"]',
      this.container
    );
   
    this._addressError = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );

    this.bindEvents();
  }

  render(): HTMLElement {
    return this.container;
  }

  onPaymentMethodSelect(handler: (method: IPaymentMethod) => void): void {
    this._onPaymentMethodSelectHandler = handler;
  }

  onAddressInput(handler: (address: string) => void): void {
    this._onAddressInputHandler = handler;
  }

  onNextStepClick(handler: () => void): void {
    this._onNextStepClickHandler = handler;
  }

  setNextButtonEnabled(enabled: boolean): void {
    this.setSubmitButtonEnabled(enabled);
  }

  showAddressError(message: string): void {
    this.setText(this._addressError, message);
    this.toggleClass(this._addressError, 'form__error_active', !!message);
  }

  bindEvents(): void {

    this.addEventListener(this._onlineButton, 'click', () => {
      this.toggleClass(this._onlineButton, 'button_alt-active', true);
      this.toggleClass(this._cashButton, 'button_alt-active', false);
      this._onPaymentMethodSelectHandler?.('Онлайн');
    });

    this.addEventListener(this._cashButton, 'click', () => {
      this.toggleClass(this._cashButton, 'button_alt-active', true);
      this.toggleClass(this._onlineButton, 'button_alt-active', false);
      this._onPaymentMethodSelectHandler?.('При получении');
    });

    this.addEventListener(this._addressInput, 'input', (e: Event) => {
      const inputElement = e.target as HTMLInputElement;
      this._onAddressInputHandler?.(inputElement.value);
    });
  }

  onSubmit(): void {
    this._onNextStepClickHandler?.();
  }

  setPaymentMethod(method: IPaymentMethod): void {
    this.toggleClass(
      this._onlineButton,
      'button_alt-active',
      method === 'Онлайн'
    );
    this.toggleClass(
      this._cashButton,
      'button_alt-active',
      method === 'При получении'
    );
  }

  setAddress(address: IDeliveryAddress): void {
    this._addressInput.value = address;
  }
}