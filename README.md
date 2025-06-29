# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Документация
**Содержание:**<br>
1. Введение
2. Интерфэйсы данных
* IProduct
* ICartItem
* IDeliveryAddress
* IPaymentMethod
* IBuyerContact
* IOrder

3. Api
* ApiListResponse type
* ApiPostMethods
* IApi интерфэйс
* Api class

4. Модели данных (The Model Layer)
* Назначение и зона ответственности
* Основные методы
* Событийный механизм 

5. Компоненты представлений (The View Layer)
* Основные принципы проектирования компонентов представлений
* Интерфейс IBaseView
* Абстрактный класс BaseView
* Конкретные интерфейсы представлений и конкретные реализации
* IProductCatalogView и ProductCatalogView
* IProductDetailModalView и ProductDetailModalView
* ICartView и CartView
* IMessageModalView и MessageModalView
* Представления оформления заказа (ICheckoutStep1View, ICheckoutStep2View)
* Взаимодействие с presenter

6. The Presenter Layer
* Основные принципы проектирования Presenter
* Интерфейс IBasePresenter
* Абстрактный класс BasePresenter
* Основные реализации Presenter 
* AppPresenter
* ProductCatalogPresenter
* ProductDetailPresenter
* CartPresenter
* CheckoutPresenter
* Поток взаимодействия (модель <-> презентатор <-> представление)

7. Описание системы событий
* Основной механизм событий в StoreModel
* productsUpdated
* cartUpdated
* orderDetailsUpdated
* orderPlaced


 ## 1. Введение
 Приложение Web-ларёк — это онлайн-магазин, разработанный для веб-разработчиков, предоставляющий каталог товаров, корзину для покупок и систему оформления заказов. Архитектура веб-приложения основывается на Model-View-Presenter(MVP)-паттерне и c соблюдением принципов SOLID.

## 2.Интерфэйсы данных
В этом разделе описаны основные интерфейсы данных, используемые в приложении. Они обеспечивают  четкую коммуникацию между различными архитектурными компонентами (Model, View, Presenter).

Основные интерфейсы данных:

**IProduct**
Назначение: Представляет собой один товар, доступный в каталоге Web-ларёк. Этот интерфейс инкапсулирует все необходимые детали для отображения и управления товаром.
Хранит в себе:
* id: string - Id товара;
* description: string - Подробное описание;
* image: string - URL-адрес изображения товара;
* title: string - Название товара;
* category: string - Категория товара;
* price: number - Цена товара;

interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

**ICartItem**
Назначение: Представляет собой товар, добавленный в корзину пользователя.
Хранит в себе:
* id: string - Id  IProduct;
* title: string - Название товара для UI;
* price: number - Цена товара для UI;
* quantity: number - (Опционально) Количество единиц товара для UI.

interface ICartItem {
    id: string;
    title: string;
    price: number;
    quantity?: number;  
}

**IDeliveryAddress**
Назначение:  Хранит данные, необходимые для отправки заказа.
Хранит в себе:
* address: string - Адрес пользователя для отправки заказа;

interface IDeliveryAddress {
    address: string;
}

**IPaymentMethod**
Назначение: Определяет доступные варианты оплаты.
Хранит в себе: Определенное строковое значение, представляющее способ оплаты.
type "payment" = “Онлайн” | “При получении“;

**IBuyerContact**
Назначение: Хранит контактные данные пользователя.
Хранит в себе:
* email: string - email пользователя;
* phone: string - контактный номер пользователя.

interface IBuyerContact {
    email: string;
    phone: string;
}

**IOrder**
Назначение: Представляет собой окончательный заказ клиента.
Хранит в себе:
* payment: IPaymentMethod;
* id: string - id пользователя;
* buyerContact: IBuyerContact;
* items: ICartItem[];
* address: IDeliveryAddress;
* total: number

interface IOrder {
    id: string,
    payment: IPaymentMethod,
    buyerContact: IBuyerContact,
    address: IDeliveryAddress,
    total: number,
    items: ICartItem[]
}


## 3. Api
В этом разделе описывается универсальный API-клиент, используемый для выполнения HTTP-запросов к бэкэнду.
* **ApiListResponse type**
Назначение: Определяет ожидаемую структуру для ответов от конечных точек API, которые возвращают список элементов, обычно с общим количеством.
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

* **IApi Interface**
Назначение: Определяет контракт для API-клиента. Этот интерфейс определяет методы, которые потребители (StoreModel) могут использовать для взаимодействия с бэкэнд-API. 

interface IApi {
    baseUrl: string;
    get(uri: string): Promise<object>;
    post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}

* **Api Class**
Назначение: Класс Api — это универсальный HTTP-клиент, отвечающий за выполнение сетевых запросов (GET, POST, PUT, DELETE) к указанному базовому URL. Этот класс реализует интерфейс IApi.
Зона ответственности:
* Инкапсулирует вызовы API fetch.
* Управляет базовым URL и параметрами запроса по умолчанию.
* Предоставляет методы для общих HTTP-запросов.
* Обрабатывает успешный ответ JSON и обрабатывает ошибки неуспешных ответов.

Хранит в себе (внутренние данные):
* readonly baseUrl: string; - Базовый URL для всех запросов API.
* protected options: RequestInit; - Параметры по умолчанию для запросов fetch, включая заголовки.

Основные методы:
1. constructor(baseUrl: string, options: RequestInit = {})
    * Назначение: Инициализирует API-клиент с базовым URL и параметрами запроса по умолчанию.
    * Зона ответственности: Устанавливает this.baseUrl и объединяет предоставленные options с заголовками по умолчанию ('Content-Type': 'application/json').

2. protected handleResponse(response: Response): Promise<object>
    * Назначение: Вспомогательный метод для обработки объекта Response API fetch. Он проверяет, был ли ответ успешным (response.ok), и разбирает тело JSON.
    * Зона ответственности:
        * Если response.ok - true, возвращает response.json().
        * Если response.ok - false, показывает сообщение об ошибке из тела JSON (data.error) или по умолчанию использует response.statusText, затем отклоняет промис с этой ошибкой.
3. get(uri: string)
    * Назначение: Выполняет HTTP GET-запрос по указанному URI, добавляемому к базовому URL.
    * Зона ответственности: Использует fetch с method: 'GET' и вызывает this.handleResponse для обработки результата.
4. post(uri: string, data: object, method: ApiPostMethods = 'POST')
    * Назначение: Выполняет HTTP-запрос (POST, PUT или DELETE) с телом запроса JSON по указанному URI.
    * Зона ответственности: Использует fetch с указанным method, преобразует объект data в строку JSON для body и вызывает this.handleResponse.

## Интеграция с StoreModel
StoreModel будет использовать экземпляр этого класса Api для взаимодействия с бэкэнд-сервером для получения данных о товарах, отправки заказов и для обновления данных. 


## 4. Модели данных - The Model Layer (StoreModel Class)
Model layer отвечает за управление данными приложения, бизнес-логикой и правилами. Он полностью независим от пользовательского интерфейса. Model уведомляет Presenters об изменении своих данных, позволяя им обновлять View соответствующим образом.
StoreModel Class: The 'M' в MVP
Класс StoreModel является Model Layer для нашего приложения Web-ларёк. Он представляет собой центральное хранилище данных и является исполнителем всех бизнес-операций, связанных с товарами, корзиной покупок и заказами.  
Назначение: StoreModel является единственным источником истины для всех данных приложения и бизнес-логики, которая работает с этими данными. Он предоставляет абстрактный интерфейс для взаимодействия презентаторов с состоянием приложения.

Взаимодействие в MVP-паттерне:
* Presenters -> Model: Presenters вызывают методы в StoreModel для запроса данных (getCartItems()) или для запуска бизнес-операций (addToCart(), placeOrder()).
* Model -> Presenters (via Events): Когда внутреннее состояние StoreModel изменяется (товар добавляется в корзину, размещается заказ), он генерирует события. Presenters подписываются на эти события, чтобы получать уведомления об изменениях, а затем соответствующим образом обновляют View.

Соблюдение принципов SOLID:
* Принцип единой ответственности (SRP): Единственная ответственность StoreModel — управление данными и бизнес-логика.
* Принцип открытости/закрытости (OCP): открыт для расширения (например, добавления новых типов данных), но закрыт для изменения (основная логика остается постоянной). 
* Принцип инверсии зависимости (DIP): Презентаторы зависят от абстрактной концепции Модели, а не от ее внутренних деталей реализации.

Основные методы StoreModel:
1. constructor()
Инициализирует внутренние структуры данных (products, cartItems, currentOrder).

2. loadProducts(productsData: IProduct[]): void
Заполняет каталог товаров. Вызывает событие 'productsUpdated'.

3. getProductById(productId: string): IProduct | undefined
Извлекает определенный товар по id.

4. addToCart(product: IProduct): void
Добавляет товар в корзину (если он еще не добавлен). Вызывает событие  'cartUpdated'.

5. removeFromCart(productId: string): void
Удаляет товар из корзины. Вызывает событие  'cartUpdated'.

6. getCartItems(): ICartItem[]
Возвращает текущие товары в корзине.

7. getCartTotal(): number
Вычисляет и возвращает общую стоимость товаров в корзине.

8. setPaymentMethod(method: IPaymentMethod): void
Устанавливает способ оплаты заказа. Вызывает событие 'orderDetailsUpdated'.

9. setDeliveryAddress(address: IDeliveryAddress): boolean
Устанавливает и проверяет адрес доставки. Вызывает событие 'orderDetailsUpdated'. Возвращает true в случае успеха, false в случае неудачи.

10. setBuyerContact(contact: IBuyerContact): boolean
Устанавливает и проверяет контактную информацию пользователя. Вызывает событие 'orderDetailsUpdated'. Возвращает true в случае удачи, false в случае неудачи.

11. placeOrder(): boolean
Завершает заказ, сохраняет его, очищает корзину и сбрасывает текущий заказ. Вызывает событие 'orderPlaced'. Возвращает true в случае успеха, false в случае неудачи.

**Механизм событий**
StoreModel включает систему событий для уведомления Presenters:
* on(eventName: string, callback: Function): void: Позволяет Presenters подписываться.
* emit(eventName: string, data?: any): void: Запускает события для подписчиков.


## 5. Компоненты представлений (The View Layer)
View Layer отвечает за визуальное представление состояния приложения и за захват пользовательских взаимодействий. Он отображает данные, предоставленные Presenter, и перенаправляет события пользовательского ввода обратно Presenter для обработки. 

Использование базовых классов обеспечивает значительные преимущества: повторное использование, поддерживаемость и расширяемость.
**IBaseView Interface**
Определяет те методы, которым должны соответствовать все классы View.

interface IBaseView<T = void>  {
render(data?: T): HTMLElement; - Отображает/обновляет содержимое
show(): void; - Делает View видимым
hide(): void; - Скрывает View
bindEvents(): void; - Связывает слушателей событий DOM
}

**BaseView Abstract Class**
Назначение: Класс BaseView предоставляет конкретную реализацию общих функций, определенных в IBaseView. Он обрабатывает стандартные взаимодействия с DOM и выступает в качестве родительского класса для всех конкретных компонентов View.

Основные задачи:
* Управляет корневым элементом DOM (container).
* Предоставляет вспомогательные методы для создания/поиска элементов HTML.
* Предоставляет методы show() и hide().

Основные методы:
* constructor(containerSelector: string): Инициализирует container.
* abstract render(data?: any): HTMLElement;: Абстрактный метод для конкретного рендеринга UI.
* show(): void: Делает View видимым.
* hide(): void: Скрывает View.
* protected createElement<T extends HTMLElement>(template: string): T: Вспомогательный метод для создания элемента DOM из HTML-строки.
* protected ensureElement(selector: string, context?: HTMLElement): HTMLElement: Вспомогательный метод для безопасного поиска элемента внутри контейнера представления или заданного контекста.
* protected addEventListener(element: HTMLElement, event: string, handler: EventListenerOrEventListenerObject): void: Вспомогательный метод для прикрепления обработчиков событий.
* abstract bindEvents(): void;: Абстрактный метод для конкретной привязки событий.

**View интерфейсы  и способы конкретных реализаций**
Каждый View расширяет BaseView и реализует свой интерфейс.

**IProductCatalogView & ProductCatalogView**
Назначение: Класс ProductCatalogView реализует IProductCatalogView и отображает главную страницу каталога товаров. 
Зона ответственности: Отображает товары, обрабатывает клики по карточкам товаров и значку корзины. 
Основные методы: updateCatalog(products: IProduct[]), onProductCardClick(handler: (productId: string) => void), onCartIconClick(handler: () => void).

**IProductDetailModalView & ProductDetailModalView**
Назначение: Класс ProductDetailModalView реализует IProductDetailModalView и управляет модальным окном с подробной информацией о товаре. 
Зона ответственности: Отображает детали товара, обрабатывает клики по кнопкам "Оплатить"/"Удалить", управляет закрытием модального окна. 
Основные методы:showProductDetails(product: IProduct), onBuyButtonClick(handler: (productId: string) => void), onRemoveButtonClick(handler: (productId: string) => void), onClose(handler: () => void), setBuyButtonState(isAdded: boolean).

**ICartView & CartView**
Назначение: Класс CartView реализует ICartView и отображает содержимое корзины для покупок.
Зона ответственности: Перечисляет товары в корзине, показывает общую сумму, обрабатывает удаление товаров, инициирует оформление заказа, управляет закрытием корзины. 
Основные методы: updateCart(items: ICartItem[], total: number), onRemoveCartItemClick(handler: (productId: string) => void), onCheckoutClick(handler: () => void), onClose(handler: () => void).

**IMessageModalView & MessageModalView**
Назначение: Класс MessageModalView реализует IMessageModalView и управляет модальным окном для отображения сообщений (сообщений об успехе создания заказа или ошибке). 
Зона ответственности: Отображает сообщение об успехе создания заказа или ошибке, обрабатывает закрытие модального окна. 
Основные методы: showMessage(message: string), onClose(handler: () => void).

**View оформления заказа (ICheckoutStep1View & CheckoutStep1View, 
ICheckoutStep2View & CheckoutStep2View)**
Назначение: Эти классы обрабатывают многошаговую форму оформления заказа, причем CheckoutStep1View управляет первым шагом, а CheckoutStep2View — вторым.
* ICheckoutStep1View / CheckoutStep1View: Управляет выбором способа оплаты и полями адреса доставки.
Основные методы: onPaymentMethodSelect, onAddressInput, onNextStepClick, showAddressError, setNextButtonEnabled.

* ICheckoutStep2View / CheckoutStep2View: Управляет полями электронной почты и контактного номера пользователя.
Основные методы: onContactInput, onPayButtonClick, showContactError, setPayButtonEnabled.

**Взаимодействие с Presenter**
View взаимодействуют с Presenter исключительно через:
1. Коллбэки: View регистрируют коллбэки (предоставленные Presenter) для UI событий.
2. Вызовы методов: Presenter вызывают методы интерфейсов View для обновления UI.

## 6. The Presenter Layer
Presenter — это "P" в MVP, который действует как посредник между Model и View. Он содержит логику представления, которая обрабатывает взаимодействия с пользователем, получает данные из Model, обрабатывает их и соответствующим образом и обновляет View. 

IBasePresenter Interface
Определяет общий метод(контракт) для всех Presenter.
interface IBasePresenter {
    init(): void;    
    destroy(): void; 
}

**BasePresenter Abstract Class**
Назначение: Класс BasePresenter предоставляет общую основу для всех конкретных Presenter, обрабатывая общие задачи (подписка на Model и связывание View-Model).
Зона ответственности:
* Хранит ссылки на Model и связанные с ней View (через их интерфейсы).
* Управляет подписками на события Model.
Хранит в себе:
* protected model: StoreModel; 
* protected view: IBaseView; 
* protected subscriptions: Array<{ event: string, handler: Function }>;
Основные методы:
* constructor(model: StoreModel, view: IBaseView)
* abstract init(): void;
* destroy(): void;
* protected subscribeToModel(eventName: string, handler: Function): void: 

Основные реализации Presenter
Каждый Presenter будет расширять BasePresenter и реализовывать свою уникальную логику представления для данной функциональной области.

**AppPresenter**
Назначение: AppPresenter обрабатывает начальную настройку, загрузку данных и управляет общим потоком приложения и переходами между представлениями.
Зона ответственности:
* Инициализирует StoreModel и все основные Presenter.
* Загружает начальные данные о товарах.
* Управляет отображением основных разделов приложения и координирует открытие модальных окон.
Основные методы: init(), showHomePage(), showProductDetail(productId: string), showCart(), startCheckout().

**ProductCatalogPresenter**
Назначение: ProductCatalogPresenter управляет логикой представления для главной страницы, отображает каталог товаров.
Зона ответственности:
* Слушает событие productsUpdated от Model для рендеринга каталога товаров.
* Обрабатывает клики по карточкам товаров и значку корзины.
* Подписывается на cartUpdated для обновления состояний кнопок "Оформить".
Основные методы: init(), handleProductsUpdated(), handleCartUpdated(), onProductCardClicked(), onCartIconClicked().

**ProductDetailPresenter**
Назначение: ProductDetailPresenter управляет логикой представления для модального окна с подробной информацией о товаре.
Зона ответственности:
* Извлекает подробную информацию о товаре из Model, отображает ее.
* Обрабатывает клики по кнопкам "Оформить" и "Удалить".
* Подписывается на cartUpdated для обновления состояния своей кнопки "Оформить"/"Удалить".
Основные методы: init(), showProductDetails(), onBuyClicked(), onRemoveClicked(), handleCartUpdated(), onModalClosed().

**CartPresenter**
Назначение: CartPresenter управляет логикой представления для корзины для покупок.
Зона ответственности:
* Слушает cartUpdated для отображения содержимого.
* Обрабатывает клики "Удалить" для отдельных товаров и клик по кнопке "Оформить".
Основные методы: init(), showCart(), handleCartUpdated(), onRemoveItemClicked(), onCheckoutClicked(), onModalClosed().

**CheckoutPresenter**
Назначение: CheckoutPresenter управляет многошаговым процессом оформления заказа, координируя взаимодействие между Model и представлениями оформления заказа.
Зона ответственности:
* Управляет состоянием шагов оформления заказа.
* Обновляет Model данными, введенными пользователем, и обрабатывает обратную связь по валидации.
* Включает/отключает кнопки "Далее" и "Оплатить".
* Обрабатывает размещение заказа и отображает сообщения об успехе/ошибке.
Ключевые методы: init(), startCheckout(), handlePaymentMethodSelected(), handleDeliveryAddressInput(), handleNextStepClick(), handleBuyerContactInput(), handlePayButtonClick(), handleOrderDetailsUpdated(), handleOrderPlaced().

## 7. Описание системы событий 
**Основной механизм событий в StoreModel**
* on(eventName: string, callback: Function): void: Позволяет Presenter подписываться на событие.
* emit(eventName: string, data?: any): void: Вызывается внутренне методами StoreModel для запуска событий и передачи соответствующих данных.

События, связанные с данными, генерируемые StoreModel:
1. **productsUpdated**
* Инициатор: StoreModel.loadProducts()
* Передаваемые данные (Payload): products: IProduct[]
* Назначение: Уведомляет Presenter о том, что каталог товаров был загружен или обновлен.
* Зона ответственности: ProductCatalogPresenter обновляет productCatalogView для отображения нового каталога.
2. **cartUpdated**
* Инициатор: StoreModel.addToCart(), StoreModel.removeFromCart(), StoreModel.placeOrder()
* Передаваемые данные (Payload): cartItems: ICartItem[], cartTotal: number
* Назначение: Уведомляет Presenter всякий раз, когда изменяется содержимое или общая стоимость корзины.
* Зона ответственности:
    * CartPresenter обновляет cartView для обновления отображения корзины.
    * ProductCatalogPresenter и ProductDetailPresenter обновляют состояния кнопок "Оплатить"/"Удалить" на карточках товаров и в модальных окнах.
    * Обновляются глобальные элементы UI (например, значок счетчика корзины).
3. **orderDetailsUpdated**
* Инициатор: StoreModel.setPaymentMethod(), StoreModel.setDeliveryAddress(), StoreModel.setBuyerContact()
* Передаваемые данные (Payload): currentOrder: Partial<IOrder>
* Назначение: Информирует CheckoutPresenter о том, что детали заказа были обновлены или проверены.
* Зона ответственности: CheckoutPresenter проверяет полноту/действительность и включает/отключает кнопки "Далее" или "Оплата" на представлениях оформления заказа, отображая сообщения об ошибках валидации при необходимости.
4. **orderPlaced**
* Инициатор: StoreModel.placeOrder()
* Передаваемые данные (Payload): order: IOrder, message?: string 
* Назначение: Указывает на успешное завершение процесса заказа.
* Зона ответственности: CheckoutPresenter запускает сообщение об успехе через MessageModalView, перенаправляет пользователя и гарантирует, что корзина будет визуально очищена.
