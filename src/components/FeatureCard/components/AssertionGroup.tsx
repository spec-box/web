import { FC } from "react";

import { AssertionGroup as AssertionGroupData } from "@/types";

import { bem } from "../FeatureCard.cn";
import { Assertion } from "./Assertion";

import "./AssertionGroup.css";

type AssertionGroupProps = {
  group: AssertionGroupData;
};

export const AssertionGroup: FC<AssertionGroupProps> = (props) => {
  const {
    group: { title, assertions },
  } = props;

  const list = assertions.map((assertion, index) => (
    <Assertion key={index} assertion={assertion} />
  ));

  return (
    <div className={bem("AssertionGroup")}>
      <div className={bem("AssertionGroupTitle")}>{title}</div>
      <div className={bem("Assertions")}>{list}</div>
    </div>
  );
};
