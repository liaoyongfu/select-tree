import React, { ReactNode } from 'react';
import cn from 'classnames';

export interface PanelProps {
    prefix: string;
    title?: ReactNode;
    children?: ReactNode;
    className?: string;
}

const Panel = ({
  prefix, title, children, className
}: PanelProps) => (
  <div className={cn(`${prefix}-panel`, className)}>
    <div className={`${prefix}-panel-head`}>
      <div className={`${prefix}-panel-title`}>
        {title}
      </div>
    </div>
    <div className={`${prefix}-panel-body`}>
      {children}
    </div>
  </div>
);

export default Panel;
