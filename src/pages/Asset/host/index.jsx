import {
  DeleteOutlined,
  PlusOutlined,
  FormOutlined,
  CodeTwoTone,
} from '@ant-design/icons';
import { Button, Tooltip, Divider, Modal, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryHosts, deleteHost } from './service';
import { queryDicts } from '@/pages/System/dict/service';
import { queryGroups } from '@/pages/Asset/group/service';
import styles from './host.less';

const HostList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [hostsType, setHostsType] = useState([]);
  const [authsType, setAuthsType] = useState([]);
  const [hostsGroup,setHostsGroup] = useState([]);
  const actionRef = useRef();

  const handleDelete = (record) => {
    if (!record) return;
    if (Array.isArray(record.ids) && !record.ids.length) return;
    const content = `您是否要删除这${Array.isArray(record.ids) ? record.ids.length : ''}项？`;
    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        deleteHost(record).then((res) => {
          if (res.code === 200 && res.status === true) {
            message.success(res.message);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        });
      },
      onCancel() {},
    });
  };
  useEffect(() => {
    queryDicts({ type_key: 'host_type' }).then((res) => {
      if (Array.isArray(res.data)) {
        setHostsType(
          res.data.map((item) => ({
            label: item.value,
            value: item.key,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    queryDicts({ type_key: 'auth_type' }).then((res) => {
      if (Array.isArray(res.data)) {
        setAuthsType(
          res.data.map((item) => ({
            label: item.value,
            value: item.key,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    queryGroups({ all: true }).then((res) => {
      console.log(res)
      if (Array.isArray(res.data.data)) {
        setHostsGroup(
          res.data.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      }
    });
  }, []);

  const columns = [
    {
      title: '主机分组',
      dataIndex: 'group_id',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        options: hostsGroup,
      },
    },
    {
      title: '主机名',
      dataIndex: 'host_name',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      // valueType: 'option',
      render: (_, record) =>(
        <>
          <span>{record.public_ip?record.public_ip+"(公有)":"" }</span><br/>
          <span> {record.private_ip?record.private_ip+"(私有)":""}</span>
        </>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'buy_date',
      valueType: 'dateTime'
    },
    {
      title: '服务商',
      dataIndex: 'provider'
    },
    {
      title: '区域/账号',
      dataIndex: 'zone',
    },
    {
      title: '配置',
      valueType: 'option',
      render: (_, record) =>(
        <>
          <span>{record.instance_size }</span><br/>
          <span> {record.cpu+' vcpu'+record.memory+' GB' }</span>
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      filters: true,
      onFilter: true,
      valueEnum: {
        'running': {
          text: 'running',
        },
        'deallocated': {
          text: 'deallocated',
        },
      },
    },
    // {
    //   title: '端口',
    //   dataIndex: 'port',
    // },
    // {
    //   title: '主机类型',
    //   dataIndex: 'host_type',
    //   valueType: 'select',
    //   fieldProps: {
    //     options: hostsType,
    //   },
    // },
    // {
    //   title: '认证类型',
    //   dataIndex: 'auth_type',
    //   valueType: 'select',
    //   fieldProps: {
    //     options: authsType,
    //   },
    // },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Tooltip title="控制台">
            <CodeTwoTone
              style={{ fontSize: '17px', color: 'blue' }}
              onClick={() => {
                // history.push('/asset/console?host_id=' + record.id.toString())
                window.open('/ssh/console?host_id=' + record.id.toString())
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="修改">
            <FormOutlined
              style={{ fontSize: '17px', color: '#52c41a' }}
              onClick={() => {
                setFormValues(record);
                handleUpdateModalVisible(true);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除">
            <DeleteOutlined
              style={{ fontSize: '17px', color: 'red' }}
              onClick={() => handleDelete({ ids: [record.id] })}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProCard className={styles.hostCard}
        tabs={{
          type: 'card',
        }}
      >
        <ProCard.TabPane key="tab1" tab="产品一">
        <ProTable
        //  tableStyle={{margin:'0px' }}
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button key="1" type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> 新建
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Button
                key="2"
                type="primary"
                onClick={() => handleDelete({ ids: selectedRows.map((item) => item.id) })}
                danger
              >
                <DeleteOutlined /> 删除
              </Button>
            ),
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowKeys.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          )}
          request={(params) => queryHosts({ ...params }).then((res) => res.data)}
          columns={columns}
          rowSelection={{}}
        />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="产品二">
          内容二
        </ProCard.TabPane>
      </ProCard>

      {createModalVisible && (
        <CreateForm
          authsType={authsType}
          hostsType={hostsType}
          actionRef={actionRef}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
        />
      )}
      {updateModalVisible && (
        <UpdateForm
          authsType={authsType}
          hostsType={hostsType}
          actionRef={actionRef}
          onCancel={() => {
            handleUpdateModalVisible(false);
          }}
          modalVisible={updateModalVisible}
          values={formValues}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default HostList;
