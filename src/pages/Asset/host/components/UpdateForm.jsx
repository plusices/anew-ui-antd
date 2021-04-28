import React, { useState } from 'react';
import { updateHost } from '../service';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';

const UpdateForm = (props) => {
  const { actionRef, modalVisible, onCancel, values, authsType, hostsType } = props;
  const [isKey, setIsKey] = useState(false);

  return (
    <ModalForm
      title="修改主机"
      visible={modalVisible}
      onVisibleChange={onCancel}
      onFinish={(v) => {
        updateHost(values.id.toString(), v)
          .then((res) => {
            if (res.code === 200 && res.status === true) {
              message.success(res.message);
              actionRef.current.reload(); //刷新table
            }
          })
          .then(() => {
            onCancel(); //关闭弹窗
          });
        //return true;
      }}
    >
      <ProForm.Group>
        <ProFormText name="host_name" label="主机名称" width="m" initialValue={values.host_name} />
        <ProFormText
          name="port"
          label="端口"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.port}
        />
        <ProFormText
          name="public_ip"
          label="公有ip"
          width="m"
          initialValue={values.public_ip}
        />
        <ProFormText
          name="private_ip"
          label="私有ip"
          width="m"
          initialValue={values.private_ip}
        />
        <ProFormSelect
          name="host_type"
          label="主机类型"
          width="m"
          hasFeedback
          options={hostsType}
          initialValue={values.host_type}
        />
        <ProFormSelect
          name="auth_type"
          label="认证类型"
          hasFeedback
          width="m"
          initialValue={values.auth_type}
          options={authsType}
          rules={[{ required: true, message: '请选择认证类型' }]}
          fieldProps={{
            onSelect: (e) => {
              if (e === 'key') {
                setIsKey(true);
              } else {
                setIsKey(false);
              }
            },
          }}
        />

        <ProFormText
          name="user"
          label="用户"
          width="m"
          rules={[{ required: true }]}
          initialValue={values.user}
        />
        {isKey ? (
          <ProFormText name="privatekey" label="密钥路径" width="m" rules={[{ required: true }]} initialValue={values.privatekey} />
        ) : null}
        {isKey ? (
          <ProFormText.Password
            label="密钥密码"
            name="key_passphrase"
            width="m"
            placeholder="输入则修改"
          />
        ) : (
          <ProFormText.Password
            label="服务器密码"
            name="password"
            width="m"
            placeholder="输入则修改"
          />
        )}
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
