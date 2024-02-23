import { Fragment, useMemo, useRef, type ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';

import { parse } from '@spec-box/text-parser';

interface Replacers {
  highlight: (props: { children: ReactNode }) => ReactNode;
  reference: (props: { children: ReactNode; url: string }) => ReactNode;
  url: (props: { children: ReactNode; url: string }) => ReactNode;
}

function createTextFormatter(replacers: Replacers) {
  return (children: string): ReactNode => {
    if (typeof children !== 'string') {
      throw new Error('The text formatter can only accept string children.');
    }

    const parsed = parse(children);

    let result: ReactNode[] = [parsed.text];

    for (const highlight of parsed.meta.highlights) {
      result = reactStringReplace(result, highlight.raw, (_, index) => (
        <Fragment key={index}>{replacers.highlight({ children: highlight.value })}</Fragment>
      ));
    }

    for (const reference of parsed.meta.references) {
      result = reactStringReplace(result, reference.raw, (_, index) => (
        <Fragment key={index}>
          {replacers.reference({
            children: reference.value,
            url: reference.value,
          })}
        </Fragment>
      ));
    }

    for (const url of parsed.meta.urls) {
      result = reactStringReplace(result, url.raw, (_, index) => (
        <Fragment key={index}>
          {replacers.url({
            children: url.value,
            url: url.value,
          })}
        </Fragment>
      ));
    }

    return result;
  };
}

export function useTextFormatter(props: Replacers) {
  const propsRef = useRef(props);

  propsRef.current = props;

  const format = useMemo(() => {
    return createTextFormatter(propsRef.current);
  }, []);

  return format;
}
