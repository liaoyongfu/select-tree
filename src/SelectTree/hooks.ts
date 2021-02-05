/* eslint-disable no-plusplus */
import {
  ChangeEvent,
  useState
} from 'react';
import { TreeNodeNormal } from 'antd/es/tree/Tree';

const getParentKey = (key: string, tree: TreeNodeNormal[]): string => {
  let parentKey: string = '';
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export interface useSelectTreeProps {
    treeData: TreeNodeNormal[];
    initialExpandedKeys?: string[];
    initialAutoExpandParent?: boolean;
    initialCheckedKeys?: string[];
}

// 获取一颗可选择的树
const useSelectTree = ({
  treeData, initialExpandedKeys = [], initialAutoExpandParent = false, initialCheckedKeys = []
}: useSelectTreeProps) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(initialExpandedKeys);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(initialAutoExpandParent);
  const [checkedKeys, setCheckedKeys] = useState<string[] | {
      checked: string[];
      halfChecked: string[];
  }>(initialCheckedKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const dataList: (TreeNodeNormal & {
    parentKeys: string[]
  })[] = [];
  const generateList = (data: TreeNodeNormal[], parentKeys: string[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push({
        ...node,
        parentKeys
      });
      if (node.children) {
        generateList(node.children, [...parentKeys, node.key]);
      }
    }
  };
  generateList(treeData, []);

  const onExpand = (curExpandedKeys: string[]) => {
    // console.log('onExpand', curExpandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(curExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (curCheckedKeys: string[] | {
    checked: string[];
    halfChecked: string[];
  }) => {
    setCheckedKeys(curCheckedKeys);
  };

  const onCheck = (curCheckedKeys: string[] | {
      checked: string[];
      halfChecked: string[];
  }) => {
    onChange(curCheckedKeys);
  };

  const onSelect = (curSelectedKeys: string[]) => {
    // console.log('onSelect', curSelectedKeys);
    setSelectedKeys(curSelectedKeys);
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const curExpandedKeys = dataList
      .map((item) => {
        if (!item.title || typeof item.title !== 'string') return null;
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(curExpandedKeys as string[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  return {
    onExpand,
    onCheck,
    onSelect,
    expandedKeys,
    checkedKeys,
    selectedKeys,
    autoExpandParent,
    searchValue,
    onSearchChange,
    dataList,
    onChange
  };
};

export default useSelectTree;
