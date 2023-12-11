import { useStore } from "effector-react/scope";
import { FC } from "react";

import { AssertionsChart, AutotestsChart } from "@/components/Chart/Chart";
import { useTitle } from "@/hooks";
import * as model from "@/model/pages/stat";
import { cn } from "@bem-react/classname";

import "./Stat.css";

const bem = cn("Stat");

export const Stat: FC = () => {
  const { assertions, autotests, project } = useStore(model.$stat);
  const isLoading = useStore(model.$statIsLoading);

  useTitle(isLoading ? "Статистика" : `${project.title}. Статистика`);

  return (
    <div className={bem(null, ["container-fluid"])}>
      <div className={bem("Row", ["row"])}>
        <div className={bem("Col", ["col"])}>
          <AssertionsChart isPending={isLoading} stat={assertions} />
        </div>
        <div className={bem("Col", ["col"])}>
          <AutotestsChart isPending={isLoading} stat={autotests} />
        </div>
      </div>
    </div>
  );
};
