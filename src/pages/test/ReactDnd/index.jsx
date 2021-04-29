import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Row, Spin, Input, message } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import { CCModal } from 'easycc-rc-4';
import styles from './index.less';

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `常用网站 ${k + offset}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : '#fff',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  paddingBottom: 0,
  minWidth: 200,
  maxHeight: 650,
  margin: '0 4px',
  overflow: 'scroll',
});

const ReactDnd = () => {
  const [state, setState] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState('');
  const [titleIndex, setTitleIndex] = useState(null);
  const [mode, setMode] = useState('create');

  const getDataSource = () => {
    setLoading(true);
    setTimeout(() => {
      const result = [getItems(10), getItems(5, 10)];
      setState(result);
      setTitles(['未分组', '常用网站']);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getDataSource();
  }, []);

  function onDragEnd(onDragEndResult) {
    const { source, destination } = onDragEndResult;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      // setState(newState.filter(group => group.length));
      setState(newState);
    }
  }

  const onFinish = async () => {
    if (titleInputValue && titleInputValue.trim()) {
      let newState = [];
      let newTitles = [];
      if (mode === 'create') {
        newState = [...state, []];
        newTitles = [...titles, titleInputValue.trim()];
      } else {
        newState = state;
        newTitles = titles.map((title, index) => {
          if (index === titleIndex) {
            return titleInputValue.trim();
          } else {
            return title;
          }
        });
      }
      if (newState.length <= 5) {
        setState(newState);
        setTitles(newTitles);
        setTitleInputValue('');
        return {
          success: true,
        };
      } else {
        message.error('分组不能超过 5 个');
        setTitleInputValue('');
        return {
          success: false,
        };
      }
    } else {
      message.error('请填写分组名称');
      return {
        success: false,
      };
    }
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <Row justify="end" style={{ marginBottom: 10 }}>
          <CCModal
            title="添加分组"
            bodyStyle={{ minHeight: 40 }}
            onFinish={onFinish}
            onClickCallback={() => {
              setMode('create');
              setTitleInputValue('');
            }}
            content={
              <Input
                autoFocus
                addonBefore="分组名称"
                allowClear
                value={titleInputValue}
                maxLength={10}
                onChange={(e) => {
                  setTitleInputValue(e.target.value);
                }}
              />
            }
          >
            <Button>添加分组</Button>
          </CCModal>

          {/* <Button
          type="button"
          onClick={() => {
            setState([...state, getItems(1)]);
          }}
          style={{ marginLeft: 10 }}
        >
          Add new item
        </Button> */}
          <Button type="primary" style={{ marginLeft: 10 }}>
            确定保存
          </Button>
        </Row>
        <div style={{ display: 'flex' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {state.map((el, ind) => (
              <div className={styles.groupWrap} key={ind}>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>{titles[ind]}</div>
                  <CCModal
                    title="修改分组"
                    bodyStyle={{ minHeight: 40 }}
                    onFinish={onFinish}
                    content={
                      <Input
                        autoFocus
                        addonBefore="分组名称"
                        allowClear
                        maxLength={10}
                        value={titleInputValue}
                        onChange={(e) => {
                          setTitleInputValue(e.target.value);
                        }}
                      />
                    }
                    onClickCallback={() => {
                      setTitleInputValue(titles[ind]);
                      setMode('update');
                      setTitleIndex(ind);
                    }}
                  >
                    <EditTwoTone twoToneColor="#255796" />
                  </CCModal>
                </div>
                <Droppable droppableId={`${ind}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {el.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(pro, sna) => (
                            <div
                              ref={pro.innerRef}
                              {...pro.draggableProps}
                              {...pro.dragHandleProps}
                              style={getItemStyle(sna.isDragging, pro.draggableProps.style)}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                {item.content}
                                {/* <button
                                  type="button"
                                  onClick={() => {
                                    const newState = [...state];
                                    newState[ind].splice(index, 1);
                                    setState(
                                      newState.filter(group => group.length)
                                    );
                                  }}
                                >
                                  delete
                                </button> */}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>
    </Spin>
  );
};

export default ReactDnd;
