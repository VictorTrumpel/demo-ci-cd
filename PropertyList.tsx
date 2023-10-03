import { useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Collapse, CollapseProps, Descriptions, DescriptionsProps, Space, Typography } from 'antd';
import { PropertyItem } from './PropertyItem';
import { Properties as Prop } from '@/shared/types';
import { toJS } from 'mobx';
import './PropertyList.scss';
import { DescriptionsItemType } from 'antd/es/descriptions';

const keys = new Set(['name', 'entitytype', 'globalid', 'translatedtype', 'type', 'objectype']);
interface PropertyListProps {
  properties: Prop;
}

export const PropertyList = observer(({ properties }: PropertyListProps) => {
  const { collapseItems, descrItems } = useMemo(() => {
    const descrItems: [null | DescriptionsItemType, ...DescriptionsItemType[]] = [null];
    const collapseItems: CollapseProps['items'] = [];

    Object.entries(properties).forEach(([key, value]) => {
      key = key.toLowerCase();

      const isDescrItem = typeof value === 'string';

      if (isDescrItem) {
        const isDescrName = key === 'name';

        isDescrName
          ? (descrItems[0] = createDescrName(key, value))
          : descrItems.push(createDescrItem(key, value));

        return;
      }

      const children =
        value instanceof Object
          ? Object.entries(value).map(([key, value]) => (
              <PropertyItem key={key} title={key} value={String(value)} />
            ))
          : value;

      collapseItems.push({ key, label: key, children });
    });

    return { collapseItems, descrItems };
  }, [properties]);

  return (
    <Space direction='vertical' className='property-container'>
      <Descriptions
        items={descrItems as DescriptionsItemType[]}
        size='small'
        column={1}
        layout='horizontal'
        bordered
      />
      <Collapse accordion size='small' items={collapseItems} className='property-list' />
    </Space>
  );
});

const createDescrItem = (key: string, value: string): DescriptionsItemType => ({
  key,
  label: key,
  children: <p className='spreadName'>{value}</p>,
});

const createDescrName = (key: string, value: string): DescriptionsItemType => ({
  key,
  label: key,
  children: <Typography.Text className='spreadName'>{value}</Typography.Text>,
});
