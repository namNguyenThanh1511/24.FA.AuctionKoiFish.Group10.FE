import { Button, Form, Input, Modal, Popconfirm, Table, Image } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

import uploadFile from "../../utils/upload";
import api from "../../config/axios";
import dayjs from "dayjs";

function DashboardTemplate({
  columns,
  title,
  formItems,
  apiURI,
  dateFields = [],
  keyField,
  formViewDetails,
  isBasicCRUD,
  isRerender,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formTag] = useForm();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, [isRerender]);

  useEffect(() => {
    const newColumns = [
      ...columns,
      ...(isBasicCRUD
        ? [
            {
              title: "Action",
              dataIndex: keyField,
              key: keyField,
              render: (id, record) => (
                <div style={{ gap: "10px", display: "flex" }}>
                  <Popconfirm
                    title={`Delete ${title}`}
                    description="Are you sure to delete ?"
                    onConfirm={() => {
                      console.log(id);
                      handleDelete(id);
                    }}
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

                      for (var key of Object.keys(newRecord)) {
                        const value = newRecord[key];
                        if (dateFields.includes(key)) {
                          newRecord[key] = dayjs(value);
                          console.log(`${key} is a date`);
                        } else {
                          newRecord[key] = record[key];
                          console.log(`${key} is not a date`);
                        }
                      }
                      formTag.setFieldsValue(newRecord);
                      handleOpenModal();
                    }}
                  >
                    Update
                  </Button>
                </div>
              ),
            },
          ]
        : []),
      {
        title: "More details",
        dataIndex: "details",
        key: "details",
        render: (id, record) => (
          <>
            <Button
              onClick={() => {
                const newRecord = { ...record };
                setCurrentRecord(newRecord);
                console.log(record);
                setIsViewModalOpen(true); // Open the View Details modal

                for (var key of Object.keys(newRecord)) {
                  const value = newRecord[key];

                  // Check if the field is listed in `dateFields` and should be treated as a date
                  if (dateFields.includes(key)) {
                    newRecord[key] = dayjs(value); // Convert to dayjs for date handling in Ant Design
                    console.log(`${key} is a date`);
                  } else {
                    newRecord[key] = record[key]; // Keep original value for non-date fields
                    console.log(`${key} is not a date`);
                  }
                }

                formTag.setFieldsValue(newRecord);
              }}
            >
              View details
            </Button>
          </>
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
    formTag.resetFields();
  };
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    formTag.resetFields();
    setCurrentRecord(null);
  };

  const handleSubmitForm = async (values) => {
    setLoading(true); // loading save button when calling api

    try {
      let url = null;
      console.log(values);
      console.log(typeof values.image_url === "object");
      if (typeof values.image_url === "object") {
        url = await uploadFile(values.image_url.file.originFileObj);
        values.image_url = url;
      } else {
        // not upload any new file -> keep old image -> do nothing
        console.log("not a file");
      }

      if (values[keyField]) {
        // id exist => update
        await api.put(`${apiURI}/${values[keyField]}`, values);
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
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          {formItems}
        </Form>
      </Modal>
      <Modal
        open={isViewModalOpen}
        title={`View ${title} details`}
        onCancel={handleCloseViewModal}
        footer={<Button onClick={handleCloseViewModal}>Close</Button>}
      >
        <Form labelCol={{ span: 24 }} onFinish={handleSubmitForm} form={formTag}>
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          {formViewDetails}

          {/* Image URL */}
          <Form.Item label="Image" name="image_url">
            {currentRecord && currentRecord.image_url ? (
              <Image width={200} src={currentRecord.image_url} />
            ) : (
              <span>No image available</span>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardTemplate;
