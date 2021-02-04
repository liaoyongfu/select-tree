/* eslint-disable react/jsx-props-no-spreading */
import React, { FormEvent, ChangeEventHandler, ReactNode } from 'react';
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
}

const SelectTree = ({
  prefix = 'select-tree',
  treeData = [],
  searchValue = '',
  onSearchChange,
  dataList = [],
  leftTitle = '标签目录',
  rightTitle = '标签名称',
  placeholder = 'Search',
  ...props
}: SelectTreeProps) => {
  const { checkedKeys, onChange } = props;
  const loop = (data: TreeNodeNormal[]) => data.map((item) => {
    if (!item.title || typeof item.title !== 'string') return <span>{item.title}</span>;
    const index = item.title?.indexOf(searchValue);
    const beforeStr = item.title?.substr(0, index);
    const afterStr = item.title?.substr(index + searchValue.length);
    const title = index > -1 ? (
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
        <TreeNode key={item.key} title={title}>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={title} />;
  });
  const getCheckedLabel = ((data: string[]) => data.map((key) => dataList.find((item) => item.key === key && (!item.children || item.children.length === 0)) && (
  <Tag
    closable
    onClose={(e: FormEvent) => {
      e.preventDefault();
      if (!onChange) return;
      if (Array.isArray(checkedKeys)) {
        // 去掉父级
        onChange(checkedKeys.filter((item) => item !== key && !dataList.find((a) => a.key === key)!.parentKeys.includes(item)));
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
      <Panel prefix={prefix} title={rightTitle}>
        {Array.isArray(checkedKeys) && getCheckedLabel(checkedKeys)}
        {/* {!Array.isArray(checkedKeys) && getCheckedLabel(checkedKeys?.checked ?? [])} */}
      </Panel>
    </div>
  );
};
export default SelectTree;
