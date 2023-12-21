import { FC } from "react";

import { FormattedText } from "@/components/FormattedText/FormattedText";
import { Assertion as AssertionData } from "@/types";

import { bem } from "../FeatureCard.cn";

import { Badge } from "./Badge";

import "./Assertion.css";

type AssertionProps = {
  assertion: AssertionData;
};

export const Assertion: FC<AssertionProps> = (props) => {
  const { assertion } = props;

  const description = assertion.description ? (
    <div className={bem("AssertionDescription")}>{assertion.description}</div>
  ) : null;

  return (
    <div className={bem("Assertion")}>
      <div>— </div>
      <div className={bem("AssertionContent")}>
        <div className={bem("AssertionTitle")}>
          <FormattedText text={assertion.title} />
        </div>
        {description}
      </div>
      <div className={bem("AssertionBadge")}>
        <Badge automated={assertion.isAutomated} />
      </div>
    </div>
  );
};
