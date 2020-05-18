import React, { useState } from 'react';
import styles from './index.less';
import { Button, Upload, notification, Spin } from 'antd';
import * as lib from '@/utils/lib';
import xml2js from 'xml2js';
import Excel from '@/utils/excel';
import * as R from 'ramda';

const getXLSCfg = (data, title) => {
  let excel = new Excel({
    header: data.header,
    body: data.data,
    filename: title + ' ' + lib.ymdhms(),
  });
  excel.save();
};
export default () => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.main}>
      <Upload.Dragger
        fileList={state}
        beforeUpload={(file) => {
          console.log(file);
          setLoading(true);
          lib.loadDataFile(file).then((buffer) => {
            if (!buffer) {
              setLoading(false);
              return;
            }
            let data = buffer.replace(/&#x0;/g, '');
            var parser = new xml2js.Parser(/* options */);
            parser
              .parseStringPromise(data)
              .then(function (result) {
                let dist = result.NewDataSet.Table;
                let title = file.name.split('.his')[0];

                if (dist.length == 0) {
                  notification.error({
                    message: '文件解析成功',
                    description: '被解析文件无有效数据',
                  });
                  return;
                }
                let header = Object.keys(dist[0]);
                let data = R.map((item) => R.flatten(Object.values(item)))(dist);
                getXLSCfg(
                  {
                    header,
                    data,
                  },
                  title,
                );
              })
              .catch((e) => {
                notification.error({
                  message: '文件解析错误',
                  description: '错误信息:' + e.message,
                });
              })
              .finally(() => {
                setLoading(false);
              });
          });
          return false;
        }}
        showUploadList={true}
        accept=".his"
        style={{ padding: 10 }}
      >
        <Spin tip="文件解析中..." spinning={loading}>
          <Button type="primary">
            {/* <UploadOutlined /> */}
            读取文件
          </Button>
        </Spin>
      </Upload.Dragger>
    </div>
  );
};
