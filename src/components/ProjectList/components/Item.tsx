import { FC } from "react";

import { Project } from "@/types";

import { bem } from "../ProjectList.cn";

import "./Item.css";
import { ListItem } from "@/components/ListItem/ListItem";

export interface ItemProps {
  project: Project;
}

export const Item: FC<ItemProps> = (props) => {
  const { project } = props;

  const description = project.description ? (
    <div className={bem("ProjectDescription")}>{project.description}</div>
  ) : undefined;

  return (
    <ListItem className={bem("Item")} view="normal">
      <div className={bem("ProjectTitle")}>{project.title}</div>
      {description}
    </ListItem>
  );
};
