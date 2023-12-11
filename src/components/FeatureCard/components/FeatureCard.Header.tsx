import { useEvent } from 'effector-react/scope';
import { FC, useCallback, useMemo } from 'react';

import { FormattedText } from '@/components/FormattedText/FormattedText';
import * as model from '@/model/pages/project';
import { Feature } from '@/types';
import { Copy } from '@gravity-ui/icons';
import { Button, Icon, Link } from '@gravity-ui/uikit';

import { bem } from '../FeatureCard.cn';
import { FeatureCardStat } from './FeatureCard.Stat';

type FeatureCardHeaderProps = {
  feature: Feature;
  repositoryUrl?: string;
};

const buildUrl = (url?: string, baseUrl?: string): string | undefined => {
  if (!url || !baseUrl) {
    return undefined;
  }

  return new URL(url, (baseUrl + '/').replace(/\/+$/, '/')).href;
};

export const FeatureCardHeader: FC<FeatureCardHeaderProps> = (props) => {
  const { feature, repositoryUrl } = props;
  const { total, automated } = feature.assertionsCount;

  const copyToClipboard = useEvent(model.copyToClipboard);
  const onClickCopyButton = useCallback(() => {
    copyToClipboard({ text: feature.code });
  }, [feature.code, copyToClipboard]);

  const description = feature.description ? (
    <div className={bem('Description')}>
      <FormattedText text={feature.description} />
    </div>
  ) : null;

  const link = useMemo(
    () => buildUrl(feature.filePath, repositoryUrl),
    [feature.filePath, repositoryUrl],
  );

  const actions = link ? (
    <div className={bem('Actions')}>
      <Button href={link} target="_blank" size="m" view="outlined">
        Перейти к YML
      </Button>
    </div>
  ) : null;

  return (
    <div className={bem('Header')}>
      <div className={bem('HeaderBody')}>
        <div className={bem('HeaderContent')}>
          <div className={bem('Code')}>
            <Link view="primary" onClick={onClickCopyButton}>
              {feature.code}
              <Icon className={bem('CopyIcon')} size={16} data={Copy} />
            </Link>
          </div>
          <div className={bem('Title')}>{feature.title}</div>
          {description}
        </div>
        {actions}
      </div>
      <div className={bem('HeaderSidebar')}>
        <FeatureCardStat total={total} automated={automated} />
      </div>
    </div>
  );
};
