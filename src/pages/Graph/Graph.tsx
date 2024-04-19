import Graphin, { Behaviors, Components } from '@antv/graphin';
import { useStore } from 'effector-react/scope';
import * as model from '@/model/pages/graph';
import { prepareDataToView } from './helpers';
import { CfgConfig } from '@/types';
import { cn } from '@bem-react/classname';
import { GraphTooltip } from './components/GraphTooltip/GraphTooltip';

import './Graph.css';
const bem = cn('Graph');

const { Tooltip, ContextMenu } = Components;
const { ZoomCanvas, ActivateRelations } = Behaviors;

export const Graph = () => {
  const data = useStore(model.$graph);
  const isLoading = useStore(model.$graphIsLoading);

  const drawingData = {
    ...data,
    nodes: data.nodes.map(prepareDataToView),
  };
  const layout = {
    type: 'graphin-force',
    preset: {
      type: 'concentric',
    },
  };

  return (
    <div className={bem()}>
      {isLoading ? (
        <div>...loading</div>
      ) : (
        <Graphin data={drawingData} layout={layout}>
          <ZoomCanvas enableOptimize />
          <ActivateRelations trigger="click" />
          <ContextMenu bindType="node">
            {(value) => {
              const model = value.item?._cfg?.model as CfgConfig;
              const { automatedCount, totalCount, problemCount, featureCode, title } = model || {};

              return (
                <GraphTooltip
                  automatedCount={automatedCount}
                  totalCount={totalCount}
                  problemCount={problemCount}
                  code={featureCode}
                  title={title}
                />
              );
            }}
          </ContextMenu>
          <Tooltip placement={'auto'}>
            {() => {
              return null;
            }}
          </Tooltip>
        </Graphin>
      )}
    </div>
  );
};
