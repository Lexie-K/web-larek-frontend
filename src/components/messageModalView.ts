import { BaseView } from './base/baseView';
import { IMessageModalView } from '../types';

export class MessageModalView
	extends BaseView<string>
	implements IMessageModalView
{
	protected titleElement: HTMLElement;
	protected descriptionElement: HTMLElement;
	protected actionButton: HTMLButtonElement;

	constructor(templateId = 'success') {
		const template = document.getElementById(templateId) as HTMLTemplateElement;
		if (!template) {
			throw new Error(`Template with id "${templateId}" not found.`);
		}
		const initialContent = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;
		if (!initialContent) {
			throw new Error(`Content not found in template with id "${templateId}".`);
		}

		super(initialContent);

		this.titleElement = this.ensureElement(
			'.order-success__title',
			this.container
		);
		this.descriptionElement = this.ensureElement(
			'.order-success__description',
			this.container
		);
		this.actionButton = this.ensureElement(
			'.order-success__close',
			this.container
		) as HTMLButtonElement;
	}

	render(message?: string): HTMLElement {
		if (message) {
			this.showMessage(message);
		}
		return this.container;
	}

	showMessage(message: string): void {
		this.descriptionElement.textContent = message;
	}

	onClose(handler: () => void): void {
		this.actionButton.addEventListener('click', handler);
	}

	bindEvents(): void {
		//
	}
}
