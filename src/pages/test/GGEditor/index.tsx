import { Col, Row, Button, message } from 'antd';
import GGEditor, { Flow } from 'gg-editor';

import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef } from 'react';
import EditorMinimap from './components/EditorMinimap';
// import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';
import { data } from './data';

GGEditor.setTrackable(false);

const Index = () => {
  const ref = useRef<any>(null);

  const onSave = () => {
    console.log('onSave', ref?.current?.editor?.getCurrentPage()?.getGraph()?.save());
    message.success('保存成功');
  };

  return (
    <PageContainer>
      <Row justify="end" style={{ marginBottom: 4 }}>
        <Button type="primary" onClick={onSave}>
          保存
        </Button>
      </Row>
      <GGEditor className={styles.editor} ref={ref}>
        <Row className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
          </Col>
        </Row>
        <Row className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <FlowItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
            <Flow className={styles.flow} data={data} />
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <FlowDetailPanel />
            <EditorMinimap />
          </Col>
        </Row>
      </GGEditor>
    </PageContainer>
  );
};

export default Index;
