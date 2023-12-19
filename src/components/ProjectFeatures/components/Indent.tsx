import { CSSProperties, FC } from "react";

import { INDENT, bem } from "../ProjectFeatures.cn";

import "./Indent.css";

export const Indent: FC<{ level: number }> = ({ level }) => {
  const style: CSSProperties = {
    width: INDENT * level,
    backgroundSize: INDENT,
  };

  return <div style={style} className={bem("Indent")}></div>;
};
