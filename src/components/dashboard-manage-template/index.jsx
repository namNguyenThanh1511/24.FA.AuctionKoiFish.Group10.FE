import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

import uploadFile from "../../utils/upload";
import api from "../../config/axios";

function DashboardTemplate({ columns, title, formItems, apiURI }) {
  const [dataSource, setDataSource] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formTag] = useForm();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tableColumns, setTableColumns] = useState([]);
  useEffect(() => {
    const newColumns = [
      ...columns,
      {
        title: "Action",
        dataIndex: "id",
        key: "id",
        render: (id, record) => (
          <div style={{ gap: "10px", display: "flex" }}>
            <Popconfirm
              title={`Delete ${title}`}
              description="Are you sure to delete ?"
              onConfirm={() => handleDelete(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
            <span style={{ margin: "10px 5px" }}>|</span>
            <Button
              type="primary"
              style={{ backgroundColor: "orange" }}
              onClick={() => {
                const newRecord = { ...record };
                console.log(record);
                setIsUpdate(true);
                formTag.setFieldsValue(newRecord);
                handleOpenModal();
              }}
            >
              Update
            </Button>
          </div>
        ),
      },
    ];
    setTableColumns(newColumns);
  }, [columns]);
  const fetchData = async () => {
    try {
      const response = await api.get(apiURI);
      console.log("fetched");
      setIsFetching(false);
      setDataSource(response.data);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleSubmitForm = async (values) => {
    setLoading(true); // loading save button when calling api

    try {
      let url = null;
      console.log(values);
      console.log(typeof values.image === "object");
      if (typeof values.image === "object") {
        url = await uploadFile(values.image.file.originFileObj);
        values.image = url;
      } else {
        // not upload any new file -> keep old image -> do nothing
        console.log("not a file");
      }

      if (values.id) {
        // id exist => update
        await api.put(`${apiURI}/${values.id}`, values);
        toast.success("update succesfully");
      } else {
        // id non exist => create
        await api.post(`${apiURI}`, values);
        toast.success("add succesfully");
      }
      formTag.resetFields();
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false); // cancel loading when calling api done
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`${apiURI}/${id}`);
      toast.success("Delete successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response.data);
    }
  };
  return (
    <div>
      <Button
        onClick={() => {
          setIsUpdate(false);
          handleOpenModal();
        }}
        type="primary"
      >
        Add new {title}
      </Button>
      <Table columns={tableColumns} dataSource={dataSource} loading={isFetching} />
      <Modal
        open={isOpenModal}
        title={isUpdate === true ? `Edit ${title}` : `Create new ${title}`}
        onCancel={handleCloseModal}
        // onOk={() => {
        //   /* submit user input to get "values" (parameter)  */
        //   formTag.submit();
        // }}
        footer={
          <>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={() => {
                formTag.submit();
              }}
              loading={loading}
            >
              Save
            </Button>
          </>
        }
      >
        <Form labelCol={{ span: 24 }} onFinish={handleSubmitForm} form={formTag}>
          <Form.Item name={"id"} hidden>
            <Input />
          </Form.Item>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardTemplate;
