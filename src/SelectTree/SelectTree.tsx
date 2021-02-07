/* eslint-disable react/jsx-props-no-spreading,no-nested-ternary */
import React, {
  FormEvent, ChangeEventHandler, ReactNode, ReactElement
} from 'react';
import cn from 'classnames';
import { TreeNodeNormal } from 'antd/es/tree/Tree';
import { Input, Tree, Tag } from 'antd';
import { TreeProps } from 'antd/lib/tree/Tree';
import Panel from './Panel';
import './SelectTree.less';

const { Search } = Input;
const { TreeNode } = Tree;

export interface SelectTreeProps extends TreeProps {
  prefix?: string;
  searchValue?: string;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
  dataList?: (TreeNodeNormal & {
    parentKeys: string[];
  })[];
  onChange?: (curCheckedKeys: string[] | {
    checked: string[];
    halfChecked: string[];
  }) => void;
  leftTitle?: ReactNode;
  rightTitle?: ReactNode;
  placeholder?: string;
  onlyFilterItem?: boolean;
}

const isMatchTitle = (title: ReactNode | undefined, searchValue: string) => {
  if (!title || typeof title !== 'string') {
    return {
      match: false,
      index: -1,
      beforeStr: '',
      afterStr: ''
    };
  }
  const index = title?.indexOf(searchValue);
  const beforeStr = title?.substr(0, index);
  const afterStr = title?.substr(index + searchValue.length);
  return {
    match: index > -1,
    index,
    beforeStr,
    afterStr
  };
};
const getChildrenMatch = (children: TreeNodeNormal[] | undefined, searchValue: string): boolean => {
  if (!children || children.length === 0) return false;

  return children.some((item) => {
    const { match } = isMatchTitle(item.title, searchValue);

    return match || getChildrenMatch(item.children, searchValue);
  });
};

const SelectTree = ({
  prefix = 'select-tree',
  treeData = [],
  searchValue = '',
  onSearchChange,
  dataList = [],
  leftTitle = '标签目录',
  rightTitle = '标签名称',
  placeholder = 'Search',
  onlyFilterItem = false,
  ...props
}: SelectTreeProps) => {
  const { checkedKeys, onCheck } = props;
  const loop = (data: TreeNodeNormal[]) => data.map((item): ReactElement => {
    const { match, beforeStr, afterStr } = isMatchTitle(item.title, searchValue);
    const childrenMatch = getChildrenMatch(item.children, searchValue);
    const title = match ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}
      </span>
    ) : (
      <span>{item.title}</span>
    );
    if (item.children) {
      return (
        <TreeNode className={(match || childrenMatch) ? '' : (onlyFilterItem ? `${prefix}-hide` : '')} key={item.key} title={title}>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode className={match ? '' : (onlyFilterItem ? `${prefix}-hide` : '')} key={item.key} title={title} />;
  });
  const getCheckedLabel = ((data: string[]) => data.map((key) => dataList.find((item) => item.key === key && (!item.children || item.children.length === 0)) && (
  <Tag
    closable
    onClose={(e: FormEvent) => {
      e.preventDefault();
      if (!onCheck) return;
      if (Array.isArray(checkedKeys)) {
        // 去掉父级
        // @ts-ignore
        onCheck(checkedKeys.filter((item) => item !== key && !dataList.find((a) => a.key === key)!.parentKeys.includes(item)));
      }
    }}
  >
    {dataList.find((item) => item.key === key)?.title}
  </Tag>
  )));
  return (
    <div className={cn(prefix)}>
      <Panel className={`${prefix}-search-box`} prefix={prefix} title={leftTitle}>
        <Search allowClear className={`${prefix}-searchbar`} placeholder={placeholder} onChange={onSearchChange} />
        <div
          className={`${prefix}-tree`}
        >
          <Tree
            checkable
            {...props}
          >
            {loop(treeData)}
          </Tree>
        </div>
      </Panel>
      <Panel className={`${prefix}-selected`} prefix={prefix} title={rightTitle}>
        {Array.isArray(checkedKeys) && getCheckedLabel(checkedKeys)}
        {/* {!Array.isArray(checkedKeys) && getCheckedLabel(checkedKeys?.checked ?? [])} */}
      </Panel>
    </div>
  );
};
export default SelectTree;
