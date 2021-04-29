import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Tooltip, message, Skeleton, Collapse } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { CloseCircleOutlined } from '@ant-design/icons';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
import Card from './components/Card';
import Header from './widgets/Header';
import HeaderCOnfig from './widgets/Header/config';
import Table from './widgets/Table';
import Chart from './widgets/Chart';
import Calendar from './widgets/Calendar';
import { ternEum } from './data';
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Index: React.FC = () => {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [layouts, setLayouts] = useState({});
  const [editConfig, setEditConfig] = useState<any>(null);

  // const getFromLS = (key: string) => {
  //   let ls = {};
  //   if (localStorage) {
  //     try {
  //       ls = JSON.parse(localStorage.getItem('rgl-8') as any) || {};
  //     } catch (e) {
  //       /* Ignore */
  //     }
  //   }
  //   return ls[key];
  // };

  // const saveToLS = (key: any, value: any) => {
  //   if (localStorage) {
  //     global.localStorage.setItem(
  //       'rgl-8',
  //       JSON.stringify({
  //         [key]: value,
  //       }),
  //     );
  //   }
  // };

  useEffect(() => {
    // setLayouts(getFromLS('layouts') || {});
  }, []);

  /**
   * 删除物料
   * @param i 唯一 id
   */
  const onRemove = (i: string) => {
    Modal.confirm({
      title: '确认删除吗?',
      onOk: () => {
        const newWidgets = widgets.filter((item) => item.i !== i);
        setWidgets(newWidgets);
      },
    });
  };

  const addWidget = (term: ternEum, widgetConfig?: any) => {
    const newWidget = {
      x: (widgets.length * 3) % 12,
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
      term,
      ...widgetConfig,
    };
    setWidgets(widgets.concat({ ...newWidget }));
  };

  const onEdit = (item: any) => {
    setEditConfig(item);
  };

  const generateDOM = () => {
    return _.map(widgets, (item) => {
      let component = null;
      switch (item.term) {
        case ternEum.Header:
          component = <Header />;
          break;
        case ternEum.Table:
          component = <Table />;
          break;
        case ternEum.Bar:
          component = <Chart term={ternEum.Bar} />;
          break;
        case ternEum.Line:
          component = <Chart term={ternEum.Line} />;
          break;
        case ternEum.Pie:
          component = <Chart term={ternEum.Pie} />;
          break;
        case ternEum.Calendar:
          component = <Calendar />;
          break;
        default:
          break;
      }
      if (component) {
        return (
          <div key={item.i} data-grid={item}>
            <CloseCircleOutlined className="remove" onClick={() => onRemove(item.i)} />
            {React.cloneElement(component, {
              ...item.termConfig,
              onClick: () => onEdit(item),
            })}
          </div>
        );
      }
      return null;
    });
  };

  const renderWidgetPanel = (term?: ternEum) => {
    const widgetsStyle = {
      border: '1px solid #ccc',
      padding: 6,
      marginTop: 6,
    };
    let component = null;
    switch (term) {
      case ternEum.Header:
        component = (
          <div
            onClick={() => {
              if (widgets.length > 0 && widgets.find((widget) => widget.term === ternEum.Header)) {
                message.info('只能添加一个 头部导航');
                return;
              }
              addWidget(ternEum.Header, {
                w: 12,
                h: 2,
                termConfig: {
                  title: '头部导航',
                },
              });
            }}
          >
            <Header />
          </div>
        );
        break;
      case ternEum.Table:
        component = (
          <div
            style={widgetsStyle}
            onClick={() => {
              addWidget(ternEum.Table, {
                w: 12,
                h: 6,
              });
            }}
          >
            <div>展示报表</div>
            <Skeleton />
          </div>
        );
        break;
      case ternEum.Calendar:
        component = (
          <div
            style={widgetsStyle}
            onClick={() => {
              addWidget(ternEum.Calendar, {
                w: 4,
                h: 4,
              });
            }}
          >
            <div>日历</div>
            <Calendar />
          </div>
        );
        break;
      case ternEum.Bar:
        component = (
          <div
            style={widgetsStyle}
            onClick={() => {
              addWidget(ternEum.Bar, {
                w: 4,
                h: 4,
              });
            }}
          >
            <div>柱图</div>
            <Chart term={ternEum.Bar} />
          </div>
        );
        break;
      case ternEum.Line:
        component = (
          <div
            style={widgetsStyle}
            onClick={() => {
              addWidget(ternEum.Line, {
                w: 4,
                h: 4,
              });
            }}
          >
            <div>折线图</div>
            <Chart term={ternEum.Line} />
          </div>
        );
        break;
      case ternEum.Pie:
        component = (
          <div
            style={widgetsStyle}
            onClick={() => {
              addWidget(ternEum.Pie, {
                w: 4,
                h: 4,
              });
            }}
          >
            <div>饼图</div>
            <Chart term={ternEum.Pie} />
          </div>
        );
        break;
      default:
        break;
    }
    return (
      <Tooltip placement="topRight" title={term}>
        {component}
      </Tooltip>
    );
  };

  const updateEditConfig = (item: any, termConfig: any) => {
    let newEditConfig = editConfig;
    const newWidgets = widgets.map((widget) => {
      if (widget.i === item.i) {
        newEditConfig = {
          ...widget,
          termConfig: {
            ...widget.termConfig,
            ...termConfig,
          },
        };
        return newEditConfig;
      }
      return widget;
    });
    setEditConfig(newEditConfig);
    setWidgets(newWidgets);
  };

  const renderOptionPanel = () => {
    if (editConfig) {
      if (editConfig.term === ternEum.Header)
        return <HeaderCOnfig updateEditConfig={updateEditConfig} editConfig={editConfig} />;
    }
    return null;
  };

  // const reset = () => {
  //   setEditConfig(null)
  // }

  return (
    <PageContainer>
      <Row gutter={10}>
        <Col span={4}>
          <Card title="物料区">
            <Collapse>
              <Collapse.Panel header="页面布局" key="1">
                {renderWidgetPanel(ternEum.Header)}
              </Collapse.Panel>
              <Collapse.Panel header="常用物料" key="2">
                {renderWidgetPanel(ternEum.Table)}
                {renderWidgetPanel(ternEum.Calendar)}
              </Collapse.Panel>
              <Collapse.Panel header="分析图表" key="3">
                {renderWidgetPanel(ternEum.Bar)}
                {renderWidgetPanel(ternEum.Line)}
                {renderWidgetPanel(ternEum.Pie)}
              </Collapse.Panel>
            </Collapse>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="编辑区">
            <ResponsiveReactGridLayout
              layouts={layouts}
              onLayoutChange={(_layout, _layouts) => {
                // saveToLS('layouts', _layouts);
                setLayouts(_layouts);
              }}
              cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
              rowHeight={20}
            >
              {generateDOM()}
            </ResponsiveReactGridLayout>
          </Card>
        </Col>
        <Col span={4}>
          <Card title="配置区">{renderOptionPanel()}</Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Index;
