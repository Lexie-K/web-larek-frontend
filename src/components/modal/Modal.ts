import { IModalData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class Modal extends BaseView<IModalData> {
	protected readonly _closeButton: HTMLButtonElement;
	protected readonly _content: HTMLElement;

	constructor(container: HTMLElement, protected readonly events: EventEmitter) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);

		this.setEventListeners();
	}

	private _toggleModal(state = true) {
		this.toggleClass(this.container, 'modal_active', state);
	}

	private _handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};

	protected setEventListeners(): void {
		this._closeButton.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('click', (e: MouseEvent) => {
			if (e.target === this.container) {
				this.close();
			}
		});
	}

	public open(content: HTMLElement): void {
		this._content.replaceChildren(content);
		this._toggleModal(true);

		document.addEventListener('keydown', this._handleEscape);

		this.events.emit('modal:open');

		this._closeButton.focus();
	}

	public close(): void {
		this._toggleModal(false);
		this._content.replaceChildren();

		document.removeEventListener('keydown', this._handleEscape);

		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		this.open(data.content);
		return this.container;
	}

	public isOpen(): boolean {
		return this.container.classList.contains('modal_active');
	}

	bindEvents(): void {
		//
	}
}
