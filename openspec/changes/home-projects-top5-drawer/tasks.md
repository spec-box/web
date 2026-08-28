## 1. Выделение общего компонента элемента проекта

- [x] 1.1 Создать `src/components/ProjectItem/ProjectItem.tsx` со своим bem-неймспейсом `ProjectItem` на основе текущего `src/components/ProjectList/components/Item.tsx` (та же ссылка через `useRouteLink({ to: projectRoute, params: { project: project.code } })`, заголовок и описание проекта)
- [x] 1.2 Перенести стили элемента (`ProjectList-Item`, `ProjectList-ProjectTitle`, `ProjectList-ProjectDescription`) в `src/components/ProjectItem/ProjectItem.css` под новым неймспейсом
- [x] 1.3 Удалить `src/components/ProjectList/components/Item.tsx` и `Item.css`, убрать соответствующие стили из `ProjectList.css`

## 2. Короткий список на главной странице (Требование: Краткий список проектов на главной странице)

- [x] 2.1 Изменить `src/components/ProjectList/ProjectList.tsx`: убрать `useState<page>`, `paginate`, `Pagination`; рендерить первые 5 элементов (`projects.slice(0, 5)`) через `ProjectItem`
- [x] 2.2 Проверить, что при количестве проектов 5 и меньше отображаются все проекты, а постраничная навигация отсутствует в обоих случаях (сценарии «Проектов больше пяти» и «Проектов пять или меньше»)

## 3. Панель с полным списком проектов и поиском

- [x] 3.1 Создать компонент `src/components/ProjectsDrawer/ProjectsDrawer.tsx` с пропсами `projects: Project[]`, `open: boolean`, `onClose: () => void`, использующий `Drawer` из `@gravity-ui/uikit` с `placement="right"` и высотой на весь экран
- [x] 3.2 Добавить в `ProjectsDrawer` поле поиска на основе `TextInput` из `@gravity-ui/uikit` (`startContent={<Icon data={Magnifier} />}`, `hasClear`) с локальным `useState<string>` для текста запроса, без debounce и без effector (Требование: Поиск проектов внутри панели)
- [x] 3.3 Реализовать клиентскую фильтрацию списка по вхождению текста запроса в название проекта без учёта регистра через `useMemo`; при пустом запросе показывать полный список (сценарии «Поиск находит совпадения», «Поиск не находит совпадений», «Очистка поиска»)
- [x] 3.4 Отрендерить отфильтрованный список через `ProjectItem` внутри прокручиваемого контейнера (`overflow-y: auto`) без `Pagination`, так чтобы прокрутка списка не влияла на остальную страницу (Требование: Полный список проектов в панели, сценарий «Список длиннее видимой области панели»)
- [x] 3.5 Добавить файлы `ProjectsDrawer.cn.ts` и `ProjectsDrawer.css` по принятой в проекте структуре компонента; в `ProjectsDrawer.css` задать `box-sizing: border-box` контейнеру, у которого одновременно заданы `width`/`height` и `padding`, чтобы содержимое (включая карточки `ProjectItem`) не выходило за границы `Drawer`

## 4. Подключение кнопки и панели к короткому списку

- [x] 4.1 Добавить в `src/components/ProjectList/ProjectList.tsx` кнопку «Все проекты» (`Button` из `@gravity-ui/uikit`) рядом с кратким списком и локальный `useState<boolean>` для открытия панели; в `ProjectList.css` выровнять кнопку по центру по горизонтали (`align-self: center` вместо `flex-start`), как ранее была центрирована `Pagination`
- [x] 4.2 Отрендерить `ProjectsDrawer` внутри `ProjectList` с теми же `projects`, привязать `open`/`onClose` к состоянию открытия (Требование: Открытие панели со всеми проектами, сценарий «Открытие панели по кнопке»)
- [x] 4.3 Убедиться, что `ProjectListProps` не изменился и `src/pages/Home/Home.tsx` продолжает работать без изменений в способе использования `ProjectList`

## 5. Проверка

- [x] 5.1 Вручную проверить на дев-сборке все сценарии `openspec/changes/home-projects-top5-drawer/specs/home/project-browser/spec.md`: краткий список из 5 проектов, кнопка «Все проекты», открытие панели на всю высоту справа, прокрутка полного списка без сдвига страницы, поиск с совпадениями, без совпадений и после очистки
- [x] 5.2 Прогнать `npm run lint` и сборку проекта, убедиться в отсутствии ошибок типов после выноса `ProjectItem`, удаления `Pagination` и добавления `SearchInput`

## 6. Общий компонент поля поиска и визуальные исправления

- [x] 6.1 Создать `src/components/SearchInput/SearchInput.tsx` (+ `.cn.ts`, `.css`): обёртка над `TextInput` из `@gravity-ui/uikit` с пропами `value`, `onUpdate`, `placeholder`, необязательным `loading` (переключает иконку `Magnifier` на `Spin`, как сейчас в `TreeFilterPanel`) и `className`; перенести в его CSS переопределение `--g-border-radius-m`/`--g-border-radius-l` и стилизацию иконки (размер 16×16, отступы, `color: var(--g-color-text-hint)`) из `TreeFilterPanel.css`
- [x] 6.2 Заменить `TextInput` в `TreeFilterPanel.tsx` на `SearchInput`, передав `loading={showSpin}`; убрать из `TreeFilterPanel.css` перенесённые в `SearchInput` стили (`TreeFilterPanel-SearchIcon` и переопределение радиуса), сохранив только то, что специфично для расположения поля в самой панели
- [x] 6.3 Заменить `TextInput` в `ProjectsDrawer.tsx` на `SearchInput`, чтобы визуальный стиль поля поиска в панели совпадал со страницей проекта (Требование: Поиск проектов внутри панели)
- [x] 6.4 Повторно вручную проверить в шторке: содержимое (поле поиска и карточки проектов) не выходит за правую границу панели ни при каком размере окна; карточки проектов отображаются со скруглёнными углами со всех сторон; поле поиска в шторке выглядит идентично полю поиска на странице проекта; кнопка «Все проекты» на главной странице расположена по центру по горизонтали

## 7. Скругление карточек внутри Drawer и увеличение ширины панели

- [x] 7.1 (промежуточный шаг предыдущей итерации; значения переопределены пунктом 7.2) В `src/components/ApplicationLayout/ApplicationLayout.css` перенести на `:root` три статических токена без вложенных `var()`
- [ ] 7.2 В `src/components/ApplicationLayout/ApplicationLayout.css` объявить ВСЕ `--sb-*` токены (`--sb-outline-width`, `--sb-border-radius-2-xl`, `--sb-border-radius-3-xl`, `--sb-font-body-s`, `--sb-font-body-m`, `--sb-font-header-s`, `--sb-font-header-m`, `--sb-font-subheader-s`, `--sb-font-subheader-m`, `--sb-font-subheader-l`) на новом селекторе `.g-root` (уже присутствует на узле `ThemeProvider` вместе с `.ApplicationLayout`, а также появляется на узле любого `Portal` со scoped-темой — `Drawer`, `Modal`, `Popup`, `Select` и т. п.); убрать текущий блок `:root { --sb-outline-width; --sb-border-radius-2-xl; --sb-border-radius-3-xl; }` и текущие объявления `--sb-font-*` на `.ApplicationLayout` — все они переезжают в единый блок `.g-root { ... }`. `.ApplicationLayout` сохраняет `--g-color-text-link`/`-hover` и раскладочные свойства (`display`, `flex-direction`, `flex`, `font: var(--sb-font-body-m)`, `color`). Тема-зависимые блоки `.ApplicationLayout.g-root_theme_light`/`.ApplicationLayout.g-root_theme_dark` не менять
- [ ] 7.3 Убедиться на дев-сборке (DevTools computed styles), что шрифты на главной странице, странице проекта и статистике (`font-family` содержит `Inter`) совпадают с состоянием до правок этого изменения, И что шрифт карточек `ProjectItem`/`ListItem` внутри открытой `Drawer` теперь тоже `Inter` (а не браузерный `Times`/serif по умолчанию)
- [x] 7.4 В `src/components/ProjectsDrawer/ProjectsDrawer.tsx` передать компоненту `Drawer` явный проп `size={460}`; в `src/components/ProjectsDrawer/ProjectsDrawer.css` заменить фиксированный `width` контейнера `.ProjectsDrawer` на `width: 100%`
- [ ] 7.5 Вручную проверить на дев-сборке: карточки проектов в открытой шторке скруглены со всех четырёх углов так же, как на главной странице (в т.ч. правый край — не срезан) и отображаются шрифтом `Inter`; ширина шторки — `460px`, содержимое (поле поиска и карточки) не выходит за её правую границу; поле поиска в шторке по стилю совпадает с полем поиска на странице проекта; кнопка «Все проекты» центрирована по горизонтали; шрифты на главной странице, странице проекта и статистике визуально не изменились
- [ ] 7.6 Отменить не относящееся к задачам этого изменения изменение `vite.config.ts` (прокси `server.proxy['/api'].target` должен остаться `http://localhost:5059`, а не `https://spec-box.yandex-team.ru`)
