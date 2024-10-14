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
  selectedFish,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Fetch data when component mounts or `isRerender` changes
  useEffect(() => {
    fetchData();
  }, [isRerender]);

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
              setCurrentRecord(newRecord);
              setIsViewModalOpen(true);
              for (var key of Object.keys(newRecord)) {
                const value = newRecord[key];
                if (dateFields.includes(key)) {
                  newRecord[key] = dayjs(value);
                }
              }
              formViewDetails.setFieldsValue(newRecord);
            }}
          >
            View
          </Button>
        ),
      },
    ];
    setTableColumns(newColumns);
  }, [columns]);

  const fetchData = async () => {
    try {
      const response = await api.get(apiURI);
      setIsFetching(false);
      setDataSource(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    form.resetFields();
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentRecord(null);
  };

  const handleSubmitForm = async (values) => {
    setLoading(true);
    try {
      let url = null;
      if (typeof values.image_url === "object") {
        url = await uploadFile(values.image_url.file.originFileObj);
        values.image_url = url;
      }

      if (values[keyField]) {
        await api.put(`${apiUriPUT}/${values[keyField]}`, values);
        notification.success({ message: `${title} updated successfully` });
      } else {
        await api.post(`${apiUriPOST}`, values);
        notification.success({ message: `${title} created successfully` });
      }
      form.resetFields();
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(error.response.data);
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${apiUriDelete}/${id}`);
      fetchData();
      notification.success({ message: `${title} deleted successfully` });
    } catch (err) {
      notification.error({ message: `Error while deleting ${title}` });
      console.error(err);
    }
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
        pagination={{ pageSize: 10 }}
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
        <Form labelCol={{ span: 24 }} onFinish={handleSubmitForm} form={form}>
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
