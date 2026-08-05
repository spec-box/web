import { FC } from 'react';

import { Magnifier, TriangleExclamation } from '@gravity-ui/icons';
import { Button, Icon, Select, SelectOption, Spin, TextInput } from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';

import { FeatureTypeIcon } from '@/components/FeatureTypeIcon/FeatureTypeIcon';
import {
  $filterFeatureType,
  $filterHasProblems,
  $filterTitle,
  $structureIsLoading,
  $structureLoaded,
  parseFeatureType,
  setFilterFeatureType,
  setFilterHasProblems,
  setFilterTitle,
} from '@/model/pages/project';

import { bem } from './TreeFilterPanel.cn';

import './TreeFilterPanel.css';

const FEATURE_TYPE_ALL = 'All';

const FEATURE_TYPE_OPTIONS: SelectOption[] = [
  { value: FEATURE_TYPE_ALL, content: 'Все типы' },
  { value: 'Functional', content: 'Функциональные' },
  { value: 'Visual', content: 'Визуальные' },
];

// пункт меню: у конкретных типов — та же иконка, что у фичей в дереве.
// штатного слота иконки у SelectOption нет, поэтому пункт рендерится целиком,
// а место под иконку резервируется всегда — чтобы текст был выровнен во всех пунктах
const renderFeatureTypeOption = (option: SelectOption) => {
  const optionType = parseFeatureType(option.value);

  return (
    <span className={bem('TypeOption')}>
      <span className={bem('TypeOptionIcon')}>
        {optionType && <FeatureTypeIcon featureType={optionType} />}
      </span>
      {option.content}
    </span>
  );
};

type TreeFilterPanelProps = {
  className?: string;
};

export const TreeFilterPanel: FC<TreeFilterPanelProps> = ({ className }) => {
  const [title, featureType, hasProblems] = useUnit([
    $filterTitle,
    $filterFeatureType,
    $filterHasProblems,
  ]);

  const [onTitleChange, onFeatureTypeChange, onHasProblemsChange] = useUnit([
    setFilterTitle,
    setFilterFeatureType,
    setFilterHasProblems,
  ]);

  // индикатор перезагрузки структуры; при первичной загрузке
  // не показывается — тогда вместо дерева рисуется скелетон
  const [isLoading, isLoaded] = useUnit([$structureIsLoading, $structureLoaded]);
  const showSpin = isLoading && isLoaded;

  return (
    <div className={bem(null, [className])}>
      <TextInput
        size="l"
        className={bem('Title')}
        value={title}
        onUpdate={onTitleChange}
        placeholder="Поиск"
        startContent={
          // контейнер фиксированного размера: иконка поиска и спиннер
          // одинаковой геометрии, при переключении ничего не перескакивает
          <span className={bem('SearchIcon')}>
            {showSpin ? <Spin size="xs" /> : <Icon data={Magnifier} size={16} />}
          </span>
        }
        hasClear
      />
      <Select
        size="l"
        value={[featureType ?? FEATURE_TYPE_ALL]}
        onUpdate={(values) => onFeatureTypeChange(parseFeatureType(values[0]))}
        options={FEATURE_TYPE_OPTIONS}
        renderOption={renderFeatureTypeOption}
      />
      <Button
        view="outlined"
        size="l"
        title="Только проблемы"
        aria-label="Только проблемы"
        selected={hasProblems}
        onClick={() => onHasProblemsChange(!hasProblems)}
      >
        <Icon data={TriangleExclamation} />
      </Button>
    </div>
  );
};
