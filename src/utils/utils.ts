import { DicResultTypeEnum } from '@/interface';
import { getAllDicService } from '@/services/setting/dic';
import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const isEmpty = (value: any) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};

export const getDicByDicName = async (
  dicName: string,
  resultType: DicResultTypeEnum = DicResultTypeEnum.MAP,
) => {
  return getAllDicService({ current: 1, pageSize: 99999 }).then((res) => {
    if (res.success) {
      if (res.data.find((item: any) => item.groupNo === dicName)) {
        const dicDataArray = res.data.find((item: any) => item.groupNo === dicName)?.sysDictDto;
        if (resultType === DicResultTypeEnum.MAP) {
          const dicDataArrayEnum = {};
          dicDataArray.forEach((item: any) => {
            dicDataArrayEnum[item.dictNo] = { text: item.dictName };
          });
          return dicDataArrayEnum;
        } else if (resultType === DicResultTypeEnum.ARRAY) {
          return dicDataArray;
        }
      }
    }
    return {};
  });
};
