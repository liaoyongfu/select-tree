/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render } from 'react-dom';
import { TreeNodeNormal } from 'antd/es/tree/Tree';
import SelectTree, { useSelectTree } from '../src';
import './index.less';

const treeData: TreeNodeNormal[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const App = () => {
  const treeState = useSelectTree({
    treeData,
    initialCheckedKeys: ['0-0-0-0', '0-0-0-2'],
    initialExpandedKeys: ['0-0', '0-0-0']
  });
  return (
    <div>
      <SelectTree leftTitle="左侧标题" rightTitle="右侧标题" placeholder="请输入关键字" treeData={treeData} {...treeState} />
    </div>
  );
};

render(
  <App />,
  document.getElementById('root')
);
