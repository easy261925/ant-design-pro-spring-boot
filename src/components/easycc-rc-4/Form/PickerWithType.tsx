import React, { CSSProperties } from 'react';
import { DatePicker, TimePicker } from 'antd';

const { RangePicker } = DatePicker;
interface PickerWithTypeProps {
  type?: 'date' | 'dateWeek' | 'dateMonth' | 'dateQuarter' | 'dateYear' | 'dateTime' | 'time' | any;
  style?: CSSProperties;
  onChange?: any;
}

const PickerWithType: React.FC<PickerWithTypeProps> = (props) => {
  const { type, onChange, ...ext } = props;
  if (type === 'time') return <TimePicker onChange={onChange} {...ext} />;
  if (type === 'date') return <DatePicker onChange={onChange} {...ext} />;
  if (type === 'dateTime') {
    return <DatePicker showTime onChange={onChange} {...ext} />;
  }
  if (type === 'dateRange') {
    <RangePicker onChange={onChange} {...ext} />;
  }
  let currentType = null;
  switch (type) {
    case 'dateWeek':
      currentType = 'week';
      break;
    case 'dateMonth':
      currentType = 'month';
      break;
    case 'dateQuarter':
      currentType = 'quarter';
      break;
    case 'dateYear':
      currentType = 'year';
      break;
    default:
      break;
  }
  return <DatePicker picker={currentType || type} onChange={onChange} {...ext} />;
};

export default PickerWithType;
