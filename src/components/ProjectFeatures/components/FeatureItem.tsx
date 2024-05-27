import { FC, ReactNode, useCallback } from 'react';
import { ListUl, Picture } from '@gravity-ui/icons';
import { ArrowToggle, Icon } from '@gravity-ui/uikit';
import { useUnit, useStoreMap } from 'effector-react';

import { ListItem, ListItemState } from '@/components/ListItem/ListItem';
import { FeatureTreeNode, GroupTreeNode } from '@/types';
import { $collapseState, toggle } from '@/model/pages/project';

import { bem } from '../ProjectFeatures.cn';

import { ItemStat } from './ItemStat';
import { Indent } from './Indent';
import { Problems } from './Problems';

import './FeatureItem.css';

interface FeatureGroupItemProps {
  level: number;
  node: GroupTreeNode;
  children: ReactNode;
}

const useIsOpen = (id: string) => useStoreMap($collapseState, (s) => Boolean(s[id]));

export const FeatureGroupItem: FC<FeatureGroupItemProps> = (props) => {
  const {
    level,
    node: { totalCount, automatedCount, problemCount, title, id },
    children,
  } = props;

  const isOpen = useIsOpen(id);
  const toggleItem = useUnit(toggle);

  const onSelect = useCallback(() => toggleItem(id), [toggleItem, id]);

  const arrow = (
    <ArrowToggle className={bem('CollapseIcon')} direction={isOpen ? 'bottom' : 'right'} />
  );

  const stat = <ItemStat totalCount={totalCount} automatedCount={automatedCount} />;
  const problems = problemCount && !isOpen ? <Problems count={problemCount} /> : null;

  const displayText = title === undefined ? '[значение атрибута не указано]' : title;

  return (
    <>
      <div className={bem('Item', { isOpen })}>
        <Indent level={level} />
        <ListItem
          view="flat"
          className={bem('ItemContent')}
          onPress={onSelect}
          before={arrow}
          after={stat}
        >
          {displayText}
          {problems}
        </ListItem>
      </div>
      {isOpen ? children : null}
    </>
  );
};

interface FeatureItemProps {
  level: number;
  node: FeatureTreeNode;
  onSelect: (featureCode: string) => void;
  selectedCode?: string;
}

const commonFeatureIcon = <Icon className={bem('FeatureIcon')} size={16} data={ListUl} />;
const visualFeatureIcon = <Icon className={bem('FeatureIcon')} size={16} data={Picture} />;

export const FeatureItem: FC<FeatureItemProps> = (props) => {
  const {
    node: { totalCount, automatedCount, problemCount, featureCode, featureType, title },
    onSelect: onFeatureSelect,
    selectedCode,
    level,
  } = props;

  const onSelect = useCallback(() => onFeatureSelect(featureCode), [featureCode, onFeatureSelect]);

  const stat = <ItemStat totalCount={totalCount} automatedCount={automatedCount} />;

  const state: ListItemState = featureCode === selectedCode ? 'active' : 'normal';

  const icon = featureType === 'Visual' ? visualFeatureIcon : commonFeatureIcon;

  const problems = problemCount ? <Problems count={problemCount} /> : null;

  return (
    <div className={bem('Item')}>
      <Indent level={level} />
      <ListItem
        view="flat"
        className={bem('ItemContent')}
        state={state}
        onPress={onSelect}
        before={icon}
        after={stat}
      >
        {title}
        {problems}
      </ListItem>
    </div>
  );
};
