import { FC } from "react";

import { FormattedText } from "@/components/FormattedText/FormattedText";
import { Assertion as AssertionData } from "@/types";
import { Label } from "@gravity-ui/uikit";

import { bem } from "../FeatureCard.cn";

import "./Assertion.css";

type AssertionProps = {
  assertion: AssertionData;
};

export const Assertion: FC<AssertionProps> = (props) => {
  const { assertion } = props;

  const description = assertion.description ? (
    <div className={bem("AssertionDescription")}>{assertion.description}</div>
  ) : null;

  const label = assertion.isAutomated ? (
    <Label theme="success" size="s">
      Done
    </Label>
  ) : (
    <Label theme="danger" size="s">
      Missing
    </Label>
  );

  return (
    <div className={bem("Assertion")}>
      <div>— </div>
      <div className={bem("AssertionContent")}>
        <div className={bem("AssertionTitle")}>
          <FormattedText text={assertion.title} />
        </div>
        {description}
      </div>
      <div>{label}</div>
    </div>
  );
};
