import { CSSProperties, ReactNode } from 'react';
import { Rule } from 'antd/lib/form';
import { LayoutInterface, FormItemLayoutInterface } from './layout';
import { ProColumnType } from '@ant-design/pro-table';
import { TextAreaProps } from 'antd/lib/input/TextArea';
import { InputNumberProps } from 'antd/lib/input-number';
import { UploadProps } from 'antd/lib/upload';
import { InputProps } from 'antd/lib/input';

interface FormItemPropsInterface {
  rules?: Rule[];
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  eltype?: 'switch' | 'upload' | 'table';
  fileNameKey?: string;
  columns?: CCColumns<any>[];
  hideOption?: boolean;
}

export interface FormItemContent {
  colLayout?: LayoutInterface;
  formItemLayout?: FormItemLayoutInterface;
  element?: ReactNode | null | any;
  style?: CSSProperties;
  props?: FormItemPropsInterface & TextAreaProps & InputNumberProps & UploadProps & InputProps;
}

export interface CCColumns<T> extends ProColumnType<T> {
  formItem?: FormItemContent;
}

export type modeType = 'multiple' | 'tags' | undefined;
