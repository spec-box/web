import { FC } from "react";

import { cn } from "@bem-react/classname";

import "./PlaceholderMessage.css";

const bem = cn("PlaceholderMessage");

type PlaceholderMessageProps = {
  className?: string;
  contentClassName?: string;

  title?: string;
  description?: string;
};

export const PlaceholderMessage: FC<PlaceholderMessageProps> = (props) => {
  const title = props.title ? (
    <div className={bem("Title")}>{props.title}</div>
  ) : undefined;

  const description = props.description ? (
    <div className={bem("Description")}>{props.description}</div>
  ) : undefined;

  return (
    <div className={bem(null, [props.className])}>
      <div className={bem("Content", [props.contentClassName])}>
        {title}
        {description}
      </div>
    </div>
  );
};
