import { FC } from 'react';

import { Magnifier, TriangleExclamation } from '@gravity-ui/icons';
import { Button, Icon, SegmentedRadioGroup, TextInput } from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';

import {
  $filterFeatureType,
  $filterHasProblems,
  $filterTitle,
  parseFeatureType,
  setFilterFeatureType,
  setFilterHasProblems,
  setFilterTitle,
} from '@/model/pages/project';

import { bem } from './TreeFilterPanel.cn';

import './TreeFilterPanel.css';

const FEATURE_TYPE_ALL = 'All';

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

  return (
    <div className={bem(null, [className])}>
      <TextInput
        className={bem('Title')}
        value={title}
        onUpdate={onTitleChange}
        placeholder="Поиск по названию"
        startContent={<Icon data={Magnifier} />}
        hasClear
      />
      <SegmentedRadioGroup
        value={featureType ?? FEATURE_TYPE_ALL}
        onUpdate={(value) => onFeatureTypeChange(parseFeatureType(value))}
        options={[
          { value: FEATURE_TYPE_ALL, content: 'Все' },
          { value: 'Functional', content: 'Функциональные' },
          { value: 'Visual', content: 'Визуальные' },
        ]}
      />
      <Button selected={hasProblems} onClick={() => onHasProblemsChange(!hasProblems)}>
        <Icon data={TriangleExclamation} />
        Только проблемы
      </Button>
    </div>
  );
};
