## 1. Перенос каталогов в слой страницы проекта

- [ ] 1.1 Создать каталог `src/pages/Project/components/` (техническая задача, подготовка к переносу)
- [ ] 1.2 Перенести `src/components/TreeFilterPanel/` в `src/pages/Project/components/TreeFilterPanel/` через `git mv`, сохранив `TreeFilterPanel.tsx`, `.cn.ts` и `.css`
- [ ] 1.3 Перенести `src/components/ProjectFeatures/` в `src/pages/Project/components/ProjectFeatures/` через `git mv` целиком, вместе с вложенными `components/` (`FeatureItem`, `Indent`, `ItemStat`, `Problems`, `TreeItem`) и `lib/compareTreeNodes.ts`
- [ ] 1.4 Перенести `src/components/FeatureCard/` в `src/pages/Project/components/FeatureCard/` через `git mv` целиком, вместе с вложенным `components/` (`Assertion`, `AssertionGroup`, `Badge`, `Header`, `Stat`, `UsageTable`)

## 2. Правка импортов

- [ ] 2.1 В `src/pages/Project/Project.tsx` заменить импорты `@/components/FeatureCard/FeatureCard`, `@/components/ProjectFeatures/ProjectFeatures` и `@/components/TreeFilterPanel/TreeFilterPanel` на относительные `./components/<Component>/<Component>`
- [ ] 2.2 Убедиться, что внутри перенесённых каталогов ничего править не пришлось: относительные импорты дочерних компонентов (`./components/TreeItem`, `./components/Header` и прочие), импорты `@/model/pages/project` и импорты общих компонентов (`FeatureTypeIcon`, `FormattedText`, `HighlightedText`, `ListItem`, `SearchInput`) остались прежними
- [ ] 2.3 Проверить, что в `src/` не осталось ссылок на старые пути: `grep -rn "@/components/TreeFilterPanel\|@/components/ProjectFeatures\|@/components/FeatureCard" src/` не даёт попаданий

## 3. Проверка правила слоёв

- [ ] 3.1 Проверить прямое свойство изменения: `grep -rn "@/pages\|@/model/pages" src/components/` не даёт ни одного попадания (Решение: «Перенос трёх каталогов целиком в слой страницы»)
- [ ] 3.2 Проверить, что зависимость сверху вниз сохранилась: каталоги в `src/pages/Project/components/` по-прежнему импортируют `FeatureTypeIcon`, `FormattedText`, `HighlightedText`, `ListItem` и `SearchInput` из `@/components/`, а эти компоненты не продублированы в слой страницы
- [ ] 3.3 Проверить, что `ProjectLayout`, `ProjectItem` и `Header` остались в `src/components/` и импортируют из `@/model` только роуты (Решение: «Граница между слоями — импорт модели, а не роутов»)

## 4. Проверка сборки и поведения

- [ ] 4.1 Прогнать `npx tsc --noEmit`, `npm run lint` и сборку проекта — убедиться в отсутствии битых путей после переноса
- [ ] 4.2 Вручную проверить на дев-сборке страницу проекта: поиск по названию фичи, фильтр по типу фичи, фильтр проблемных, раскрытие и сворачивание узлов дерева, выбор фичи и отображение карточки, копирование ссылки из карточки
- [ ] 4.3 Вручную проверить на дев-сборке, что фильтры по-прежнему восстанавливаются из query при перезагрузке страницы проекта с параметрами `search`, `featureType` и `hasProblems`
