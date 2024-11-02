import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Image,
  Row,
  Col,
  Alert,
  Tooltip,
  notification,
} from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import uploadFile from "../../utils/upload";
import api from "../../config/axios";
import CardKoiFish from "../card-koi-fish";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./customTable.css";
import { current } from "@reduxjs/toolkit";
function DashboardTemplate({
  columns,
  title,
  formItems,
  apiURI,
  dateFields = [],
  keyField,
  formViewDetailsItem,
  isBasicCRUD,
  isIncludeImage,
  isRerender,
  form,
  apiUriPOST,
  apiUriPUT,
  apiUriDelete,
  formViewDetails,
  isShownCardKoiFish,
  isCreateNew,
  setSelectedFish,
  paginationTarget,
  setIsRender,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  // Fetch data when component mounts or `isRerender` changes
  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [isRerender]);

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  useEffect(() => {
    if (currentRecord) {
      // Reset fields and then set new values
      // formViewDetails.resetFields();
      formViewDetails.setFieldsValue(currentRecord);
    }
  }, [currentRecord, formViewDetails]);

  useEffect(() => {
    const newColumns = [
      ...columns,
      ...(isBasicCRUD
        ? [
            {
              title: "Actions",
              dataIndex: keyField,
              key: keyField,
              width: 150,
              render: (id, record) =>
                record?.koiStatus === "AVAILABLE" ? (
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Tooltip title="Delete">
                      <Popconfirm title={`Delete ${title}`} onConfirm={() => handleDelete(id)}>
                        <Button danger icon={<DeleteOutlined />} shape="round" />
                      </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <Button
                        style={{ backgroundColor: "orange", borderColor: "orange" }}
                        icon={<EditOutlined />}
                        shape="round"
                        onClick={() => {
                          const newRecord = { ...record };
                          setIsUpdate(true);
                          for (var key of Object.keys(newRecord)) {
                            const value = newRecord[key];
                            if (dateFields.includes(key)) {
                              newRecord[key] = dayjs(value);
                            }
                          }
                          if (newRecord.varieties) {
                            newRecord.varietiesID = newRecord.varieties.map(
                              (variety) => variety.id
                            );
                          }

                          form.setFieldsValue(newRecord);
                          handleOpenModal();
                        }}
                      />
                    </Tooltip>
                  </div>
                ) : (
                  <Tooltip title="Fish is not available">
                    <Alert message="Unavailable" type="warning" showIcon />
                  </Tooltip>
                ),
            },
          ]
        : []),
      {
        title: (
          <Tooltip title="View details">
            <span>Details</span>
            <InfoCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip>
        ),
        dataIndex: "details",
        key: "details",
        width: 120,
        render: (id, record) => (
          <Button
            onClick={() => {
              const newRecord = { ...record };

              for (var key of Object.keys(newRecord)) {
                const value = newRecord[key];
                if (dateFields.includes(key)) {
                  newRecord[key] = dayjs(value);
                }
              }
              if (newRecord.varieties) {
                newRecord.varieties = newRecord.varieties.map((variety) => variety.id);
              }
              setCurrentRecord(newRecord);
              setIsViewModalOpen(true);
              console.log(newRecord);

              formViewDetails.resetFields();
              formViewDetails.setFieldsValue(newRecord);
              // setIsRender(true);
              // const logTitle = formViewDetails.getFieldValue("title") || "No Title Available";
              // const logcreatedDate = dayjs(formViewDetails.getFieldValue("createdDate"));
              // const logdescription =
              //   formViewDetails.getFieldValue("description") || "No description available.";
              // const logresponseNote =
              //   formViewDetails.getFieldValue("responseNote") || "No response note available.";
              // const logkoiId = formViewDetails.getFieldValue("koi_id");
              // console.log(logTitle);
              // console.log(logcreatedDate);
              // console.log(logdescription);
              // console.log(logresponseNote);
              // console.log(logkoiId);
            }}
          >
            View
          </Button>
        ),
      },
    ];
    setTableColumns(newColumns);
  }, [columns]);

  const fetchData = async (current, pageSize) => {
    try {
      const response = await api.get(apiURI + `?page=${current - 1}&size=${pageSize}`);
      setIsFetching(false);
      setDataSource(response.data[paginationTarget]);
      setPagination({
        current,
        pageSize,
        total: response.data.totalElements,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    if (isUpdate) {
      form.resetFields();
    }
    setIsOpenModal(false);
    setSelectedFish(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    formViewDetails.resetFields();
    setCurrentRecord(null);
  };

  const handleSubmitForm = async (values) => {
    setLoading(true);
    let url = null;
    if (typeof values.image_url === "object") {
      url = await uploadFile(values.image_url.file.originFileObj);
      values.image_url = url;
    }
    try {
      if (values[keyField]) {
        await api.put(`${apiUriPUT}/${values[keyField]}`, values);
        fetchData(pagination.current, pagination.pageSize);
        notification.success({ message: `${title} updated successfully` });
      } else {
        const response = await api.post(`${apiUriPOST}`, values);
        fetchData(pagination.current, pagination.pageSize);
        notification.success({ message: `${title} created successfully` });
      }
      form.resetFields();
      handleCloseModal();
      console.log(response);
    } catch (error) {
      toast.error(error.response.data);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${apiUriDelete}/${id}`);
      fetchData(pagination.current, pagination.pageSize);
      notification.success({ message: `${title} deleted successfully` });
    } catch (err) {
      notification.error({ message: `Error while deleting ${title}` });
      console.error(err);
    }
  };
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <div>
      {isCreateNew && (
        <Button
          onClick={() => {
            setIsUpdate(false);
            handleOpenModal();
          }}
          type="primary"
          icon={<PlusOutlined />}
          shape="round"
          style={{ marginBottom: 16 }}
        >
          Add new {title}
        </Button>
      )}

      <Table
        columns={tableColumns}
        dataSource={dataSource}
        loading={isFetching}
        rowClassName={(record) =>
          record.koiStatus === "AVAILABLE" ? "row-available" : "row-unavailable"
        }
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* Modal for creating or editing a record */}
      <Modal
        open={isOpenModal}
        title={isUpdate ? `Edit ${title}` : `Create new ${title}`}
        onCancel={handleCloseModal}
        footer={
          <>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading}>
              Save
            </Button>
          </>
        }
      >
        <Form layout="horizontal" labelCol={{ span: 24 }} onFinish={handleSubmitForm} form={form}>
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          {formItems}
        </Form>
      </Modal>

      {/* Modal for viewing details */}
      <Modal
        width={800}
        open={isViewModalOpen}
        title={`View ${title} details`}
        onCancel={handleCloseViewModal}
        footer={<Button onClick={handleCloseViewModal}>Close</Button>}
      >
        <Form labelCol={{ span: 24 }} form={formViewDetails}>
          <Row gutter={16}>
            <Col span={12}>{formViewDetailsItem}</Col>
            <Col span={12}>
              {isShownCardKoiFish && <CardKoiFish id={formViewDetails.getFieldValue("koi_id")} />}
              {isIncludeImage && (
                <Form.Item label="Image" name="image_url">
                  {currentRecord?.image_url ? (
                    <Image width={200} src={currentRecord.image_url} />
                  ) : (
                    <span>No image available</span>
                  )}
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardTemplate;
