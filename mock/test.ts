import { Request, Response } from 'express';
import { parse } from 'url';

const genList = (current: number, pageSize: number) => {
  const list: any[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    // const index = (current - 1) * 10 + i;
    list.push({
      id: i + 1,
      username: `${i}username`,
      password: `${i}password`,
      multiple: ['a', 'c'],
      dateRange: [Date.now(), Date.now()],
      digit: i,
      switch: i % 2 === 0 ? true : false,
      dtCreaDateTime: Date.now(),
      dtUpdateDateTime: Date.now(),
      textarea:
        '这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字这是一段文字',
      select: `${i % 2}`,
      uploadFile: [
        {
          id: '1',
          // fileName: 'abc',
          // name: 'image.png',
          // status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      selectUser: [91],
    });
  }
  list.reverse();
  return list;
};

let tableListDataSource = genList(1, 100);

function getAll(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = (parse(realUrl, true).query as unknown) as any;
  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  // const sorter = JSON.parse(params.sorter as any);
  // if (sorter) {
  //   dataSource = dataSource.sort((prev, next) => {
  //     let sortNumber = 0;
  //     Object.keys(sorter).forEach((key) => {
  //       if (sorter[key] === 'descend') {
  //         if (prev[key] - next[key] > 0) {
  //           sortNumber += -1;
  //         } else {
  //           sortNumber += 1;
  //         }
  //         return;
  //       }
  //       if (prev[key] - next[key] > 0) {
  //         sortNumber += 1;
  //       } else {
  //         sortNumber += -1;
  //       }
  //     });
  //     return sortNumber;
  //   });
  // }
  // if (params.filter) {
  //   const filter = JSON.parse(params.filter as any) as {
  //     [key: string]: string[];
  //   };
  //   if (Object.keys(filter).length > 0) {
  //     dataSource = dataSource.filter((item) => {
  //       return Object.keys(filter).some((key) => {
  //         if (!filter[key]) {
  //           return true;
  //         }
  //         if (filter[key].includes(`${item[key]}`)) {
  //           return true;
  //         }
  //         return false;
  //       });
  //     });
  //   }
  // }

  if (params.username) {
    dataSource = dataSource.filter(
      (data) => data.username && data.username.includes(params.username || ''),
    );
  }

  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
  };

  return res.json(result);
}

export default {
  'GET /api/test': getAll,
};
